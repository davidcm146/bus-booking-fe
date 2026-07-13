"use client";

import { useSearchParams } from "next/navigation";
import { SignUpForm } from "@/components/auth/SignUpForm";

export function SignUpSearchParams() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || undefined;
  return <SignUpForm redirectUrl={redirect} />;
}
