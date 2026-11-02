"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Target } from "@/types";
import { AuthForm } from "@/components/auth/AuthForm";
import { TargetForm } from "@/components/dashboard/TargetForm";
import { TargetCard } from "@/components/dashboard/TargetCard";
import { Button } from "@/components/ui/button";
import { Activity, LogOut } from "lucide-react";
import { Session } from "@supabase/supabase-js";

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchTargets();
  }, [session]);

  const fetchTargets = async () => {
    setLoading(true);
    const { data } = await supabase.from("targets").select("*").order("created_at", { ascending: false });
    setTargets(data || []);
    setLoading(false);
  };

  const handleAdd = async (target: { name: string; url: string; selector: string }) => {
    await supabase.from("targets").insert([{ ...target, user_id: session?.user.id }]);
    fetchTargets();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("targets").delete().eq("id", id);
    fetchTargets();
  };

  if (!session) return <AuthForm />;

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Activity className="h-8 w-8 text-blue-600" />
          Rewards Watcher
        </h1>
        <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>

      <TargetForm onAdd={handleAdd} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-gray-500">Loading targets...</p>
        ) : targets.length === 0 ? (
          <p className="text-gray-500 col-span-full">No active trackers. Add one above.</p>
        ) : (
          targets.map((target) => <TargetCard key={target.id} target={target} onDelete={handleDelete} />)
        )}
      </div>
    </main>
  );
}