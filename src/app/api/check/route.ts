import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import * as cheerio from "cheerio";

export async function GET() {
  // This will fetch all active targets
  const { data: targets, error } = await supabase
    .from("targets")
    .select("*")
    .eq("is_active", true);

  if (error || !targets) {
    return NextResponse.json({ error: "Failed to fetch targets" }, { status: 500 });
  }

  const results = [];

  for (const target of targets) {
    try {
      const response = await fetch(target.url, { cache: 'no-store' });
      const html = await response.text();
      const $ = cheerio.load(html);

      const elementExists = $(target.selector).length > 0;
      
      const status = elementExists ? "SELECTOR_FOUND" : "SELECTOR_MISSING";

      await supabase.from("audit_logs").insert([
        {
          target_id: target.id,
          status: status,
          message: `Checked at ${new Date().toISOString()}`
        }
      ]);

      // 4. Update the target's last_checked timestamp
      await supabase
        .from("targets")
        .update({ last_checked: new Date().toISOString() })
        .eq("id", target.id);

      results.push({ id: target.id, name: target.name, status });

    } catch (err) {
      console.error(`Error checking target ${target.id}:`, err);
      results.push({ id: target.id, name: target.name, status: "ERROR" });
    }
  }

  return NextResponse.json({ success: true, checked: results.length, results });
}