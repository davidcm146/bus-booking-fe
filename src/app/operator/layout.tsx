"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isOperatorUser } from "@/lib/auth/access";

export default function OperatorLayout({ children }: { readonly children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const allowed = isOperatorUser(user);

  if (loading) return null;
  if (!allowed) redirect("/login?redirect=/operator");

  return children;
}
