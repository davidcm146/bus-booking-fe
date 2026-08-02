"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserRoundPlus, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SignUpFormProps {
  readonly redirectUrl?: string;
}

export function SignUpForm({ redirectUrl }: SignUpFormProps) {
  const router = useRouter();
  const { signUp } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters with uppercase, lowercase, and a digit");
      return;
    }
    setLoading(true);
    try {
      await signUp({ phone, password });
      router.push(redirectUrl || "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-0 bg-surface p-2 shadow-float ring-1 ring-border/70">
      <CardHeader className="pb-2">
        <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
          <UserRoundPlus className="h-5 w-5" />
        </span>
        <CardTitle className="text-3xl font-extrabold tracking-[-0.04em]">Create your account</CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">Save tickets, passenger details, and upcoming journeys.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+84 90 123 4567"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters with uppercase, lowercase, and a digit"
              required
              minLength={8}
            />
          </div>
          {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive" role="alert">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            No marketing messages without your permission.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
