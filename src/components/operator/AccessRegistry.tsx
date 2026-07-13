import { ShieldCheck, UserRoundCog, UsersRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/operator/StatusBadge";
import type { OperatorDashboardData } from "@/types/operator";

interface AccessRegistryProps {
  readonly data: OperatorDashboardData;
}

export function AccessRegistry({ data }: AccessRegistryProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
      <Card className="shadow-card">
        <CardHeader className="border-b border-border pb-4"><div className="flex items-center justify-between"><div><CardTitle className="text-lg font-extrabold">Roles</CardTitle><p className="mt-1 text-sm text-muted-foreground">Access groups for operator users.</p></div><ShieldCheck className="size-5 text-primary" /></div></CardHeader>
        <CardContent className="space-y-3 p-5">
          {data.roles.map((role) => <Card key={role.id} size="sm" className="bg-muted/45 shadow-none"><CardContent className="flex items-center justify-between gap-3 p-4"><div><p className="font-extrabold">{role.name}</p><p className="mt-1 text-xs text-muted-foreground">Role ID {role.id}</p></div><span className="flex items-center gap-1 text-sm font-bold"><UsersRound className="size-4 text-primary" /> {role.userCount}</span></CardContent></Card>)}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="border-b border-border pb-4"><div className="flex items-center justify-between"><div><CardTitle className="text-lg font-extrabold">Operator users</CardTitle><p className="mt-1 text-sm text-muted-foreground">Staff identity, role, and account status.</p></div><UserRoundCog className="size-5 text-primary" /></div></CardHeader>
        <CardContent className="space-y-3 p-5">
          {data.staff.map((user) => <Card key={user.id} size="sm" className="shadow-none"><CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center"><div><p className="font-extrabold">{user.fullName}</p><p className="mt-1 text-xs text-muted-foreground">{user.email}</p></div><div><p className="text-sm font-bold">{user.role}</p><p className="mt-1 text-xs text-muted-foreground">{user.phone}</p></div><StatusBadge label={user.status} tone={user.status === "active" ? "positive" : "neutral"} /></CardContent></Card>)}
        </CardContent>
      </Card>
    </div>
  );
}
