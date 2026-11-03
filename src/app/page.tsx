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

  const fetchTargets = async () => {
    setLoading(true);
    const { data } = await supabase.from("targets").select("*").order("created_at", { ascending: false });
    setTargets(data || []);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;

    const loadTargets = async () => {
      setLoading(true);
      const { data } = await supabase.from("targets").select("*").order("created_at", { ascending: false });
      setTargets(data || []);
      setLoading(false);
    };

    void loadTargets();
  }, [session]);

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
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Rewards Watcher</h1>
              <p className="text-sm text-muted-foreground">Keep an eye on the rewards that matter.</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => supabase.auth.signOut()} className="self-start sm:self-auto">
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </header>

        <TargetForm onAdd={handleAdd} />

        <section aria-label="Tracked rewards">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold">Your trackers</h2>
              <p className="text-sm text-muted-foreground">Monitor pages for reward updates.</p>
            </div>
            {targets.length > 0 && <span className="text-sm text-muted-foreground">{targets.length} active</span>}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="text-muted-foreground">Loading trackers...</p>
            ) : targets.length === 0 ? (
              <p className="col-span-full rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
                No trackers yet. Add your first reward page above.
              </p>
            ) : (
              targets.map((target) => <TargetCard key={target.id} target={target} onDelete={handleDelete} />)
            )}
          </div>
        </section>
      </div>
    </main>
  );
}