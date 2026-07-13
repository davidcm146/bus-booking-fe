"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { DEMO_OPERATOR_EMAIL, DEMO_OPERATOR_PASSWORD } from "@/lib/auth/authService";

interface LoginFormProps {
  readonly redirectUrl?: string;
}

export function LoginForm({ redirectUrl }: LoginFormProps) {
  const router = useRouter();
  const { logIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await logIn({ email, password });
      router.push(redirectUrl || "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-0 bg-surface p-2 shadow-float ring-1 ring-border/70">
      <CardHeader className="pb-2">
        <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
          <LogIn className="h-5 w-5" />
        </span>
        <CardTitle className="text-3xl font-extrabold tracking-[-0.04em]">Welcome back</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">Sign in to see your tickets and manage upcoming travel.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary-light/25 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold">Operator demo</p>
                <p className="mt-1 text-xs text-muted-foreground">{DEMO_OPERATOR_EMAIL} · {DEMO_OPERATOR_PASSWORD}</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => { setEmail(DEMO_OPERATOR_EMAIL); setPassword(DEMO_OPERATOR_PASSWORD); }}>
                Use demo
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>
          {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive" role="alert">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in securely
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            Your account details stay on this device in the demo.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
