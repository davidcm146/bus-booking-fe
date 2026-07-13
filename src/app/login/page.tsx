import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginSearchParams } from "./search-params";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your BusGo account to manage your bus bookings and view tickets.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense fallback={<LoginForm />}>
        <LoginSearchParams />
      </Suspense>
    </AuthShell>
  );
}
