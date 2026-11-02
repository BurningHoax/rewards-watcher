"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, Activity, Plus, LogOut } from "lucide-react";
import { Session } from "@supabase/supabase-js";

type Target = {
  id: string;
  name: string;
  url: string;
  selector: string;
  is_active: boolean;
};

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [selector, setSelector] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchTargets();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchTargets();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTargets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("targets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching targets:", error);
    else setTargets(data || []);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for the confirmation link!");
    setAuthLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setTargets([]);
  };

  const addTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    const { error } = await supabase.from("targets").insert([
      { name, url, selector, user_id: session.user.id },
    ]);

    if (error) {
      console.error("Error adding target:", error);
      alert("Failed to add target.");
    } else {
      setName("");
      setUrl("");
      setSelector("");
      fetchTargets();
    }
  };

  const deleteTarget = async (id: string) => {
    const { error } = await supabase.from("targets").delete().eq("id", id);
    if (!error) fetchTargets();
  };

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-600" />
              Rewards Watcher
            </CardTitle>
            <CardDescription>Sign in to manage your tracking targets.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="w-full" onClick={handleSignIn} disabled={authLoading}>Sign In</Button>
                <Button className="w-full" variant="outline" onClick={handleSignUp} disabled={authLoading}>Sign Up</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Activity className="h-8 w-8 text-blue-600" />
          Rewards Watcher
        </h1>
        <Button variant="ghost" onClick={handleSignOut} className="gap-2">
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Target</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTarget} className="flex flex-wrap gap-4 items-end">
            <div className="grid flex-1 min-w-[200px] items-center gap-1.5">
              <Label htmlFor="name">Item Name</Label>
              <Input required id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Flipkart Gift Card" />
            </div>
            <div className="grid flex-1 min-w-[200px] items-center gap-1.5">
              <Label htmlFor="url">Page URL</Label>
              <Input required id="url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid flex-1 min-w-[200px] items-center gap-1.5">
              <Label htmlFor="selector">CSS Selector / Text</Label>
              <Input required id="selector" value={selector} onChange={(e) => setSelector(e.target.value)} placeholder="e.g. .out-of-stock-btn" />
            </div>
            <Button type="submit" className="gap-2">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-gray-500">Loading targets...</p>
        ) : targets.length === 0 ? (
          <p className="text-gray-500 col-span-full">No active trackers. Add one above.</p>
        ) : (
          targets.map((target) => (
            <Card key={target.id} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg truncate pr-8">{target.name}</CardTitle>
                <button 
                  onClick={() => deleteTarget(target.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-2 truncate">
                  <a href={target.url} target="_blank" rel="noreferrer" className="hover:underline text-blue-500">
                    View Page
                  </a>
                </div>
                <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded truncate">
                  {target.selector}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                  <div className={`h-2.5 w-2.5 rounded-full ${target.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                  {target.is_active ? 'Active' : 'Paused'}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}