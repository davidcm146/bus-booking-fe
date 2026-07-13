import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpSearchParams } from "./search-params";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Create a free BusGo account to book bus tickets across Vietnam and manage your trips.",
  alternates: {
    canonical: "/signup",
  },
};

export default function SignUpPage() {
  return (
    <AuthShell>
      <Suspense fallback={<SignUpForm />}>
        <SignUpSearchParams />
      </Suspense>
    </AuthShell>
  );
}
