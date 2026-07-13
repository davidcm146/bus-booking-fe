"use client";

import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";

export function LoginSearchParams() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || undefined;
  return <LoginForm redirectUrl={redirect} />;
}
