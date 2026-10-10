"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeGoogleLogin } = useAuth();

  useEffect(() => {
    const denied = searchParams.get("error");
    if (denied) {
      router.replace(`/login?error=${encodeURIComponent("Google sign-in was cancelled")}`);
      return;
    }
    const code = searchParams.get("code");
    if (!code) {
      router.replace(`/login?error=${encodeURIComponent("Missing authorization code")}`);
      return;
    }
    async function handleCallback(authCode: string) {
      try {
        await completeGoogleLogin(authCode);
        router.push("/");
      } catch (err) {
        router.replace(`/login?error=${encodeURIComponent(err instanceof Error ? err.message : "Google login failed")}`);
      }
    }
    handleCallback(code);
  }, [searchParams, router, completeGoogleLogin]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Completing Google sign-in…</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <GoogleCallbackHandler />
    </Suspense>
  );
}
