import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";
import nodemailer from "nodemailer";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function GET() {
  const { data: targets, error } = await supabaseAdmin.from("targets").select("*").eq("is_active", true);
  if (error || !targets) return NextResponse.json({ error: "Failed to fetch targets" }, { status: 500 });

  const results = [];

  for (const target of targets) {
    try {
      // Added Cookie and User-Agent headers here to act as your logged-in browser
      const response = await fetch(target.url, { 
        cache: "no-store",
        headers: {
          "Cookie": process.env.MICROSOFT_COOKIE || "",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const elementExists = $(target.selector).length > 0;
      const status = elementExists ? "IN_STOCK" : "OUT_OF_STOCK";

      if (status === "IN_STOCK") {
        await transporter.sendMail({
          from: `"Rewards Watcher" <${process.env.SMTP_EMAIL}>`,
          to: process.env.ALERT_EMAIL_ADDRESS,
          subject: `🚨 Restock Alert: ${target.name}`,
          html: `<p>Your tracked item is back! <a href="${target.url}">Click here to buy it now.</a></p>`
        });
      }

      await supabaseAdmin.from("audit_logs").insert([{ target_id: target.id, status, message: `Checked at ${new Date().toISOString()}` }]);
      await supabaseAdmin.from("targets").update({ last_checked: new Date().toISOString() }).eq("id", target.id);
      
      results.push({ id: target.id, name: target.name, status });
    } catch (err) {
      console.error(`Error checking target ${target.id}:`, err);
      results.push({ id: target.id, name: target.name, status: "ERROR" });
    }
  }

  return NextResponse.json({ success: true, checked: results.length, results });
}