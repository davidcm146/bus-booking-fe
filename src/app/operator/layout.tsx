"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { isOperatorUser } from "@/lib/auth/access";

export default function OperatorLayout({ children }: { readonly children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const allowed = isOperatorUser(user);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-10">
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!allowed) {
    router.replace("/login?redirect=/operator");
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <Card>
          <CardContent className="flex flex-col items-center p-10 text-center">
            <ShieldAlert className="size-8 text-warning" />
            <p className="mt-4 font-extrabold">Operator access required</p>
            <p className="mt-1 text-sm text-muted-foreground">Redirecting to the demo operator sign-in.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}
