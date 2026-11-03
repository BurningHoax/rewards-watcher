import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowRight, ShieldCheck } from "lucide-react";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (isSignUp: boolean) => {
    setLoading(true);
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    
    if (error) alert(error.message);
    else if (isSignUp) alert("Check your email for the confirmation link.");
    setLoading(false);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/40 px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      <Card className="relative w-full max-w-md border-border/70 bg-card/95 shadow-xl shadow-black/5 backdrop-blur">
        <CardHeader className="gap-4 px-6 pb-2 pt-7 sm:px-8 sm:pt-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Activity className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl tracking-tight normal-case">
              Welcome to Rewards Watcher
            </CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              Track reward pages and get notified when something changes.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 px-6 pb-7 pt-5 sm:px-8 sm:pb-8">
          <div className="space-y-4">
            <label className="block space-y-2 text-sm font-medium">
              Email address
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="h-11 rounded-lg border border-input bg-background px-3 placeholder:text-muted-foreground/70 focus-visible:border-ring"
              />
            </label>
            <label className="block space-y-2 text-sm font-medium">
              Password
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="h-11 rounded-lg border border-input bg-background px-3 placeholder:text-muted-foreground/70 focus-visible:border-ring"
              />
            </label>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:flex-1" onClick={() => handleAuth(false)} disabled={loading}>
              Sign In <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button className="w-full sm:flex-1" variant="outline" onClick={() => handleAuth(true)} disabled={loading}>
              Sign Up
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Your account is protected with secure authentication.
          </div>
        </CardContent>
      </Card>
    </main>
  );
}