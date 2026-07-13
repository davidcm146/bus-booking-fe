"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useOperator } from "@/contexts/OperatorContext";
import type { StaffRecord } from "@/types/operator";

function isStaffStatus(value: string): value is StaffRecord["status"] {
  return value === "active" || value === "inactive" || value === "blocked";
}

export function StaffEditorSheet({
  open,
  onOpenChange,
  staff,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly staff: StaffRecord | null;
}) {
  const { data, saveStaff, pendingKey } = useOperator();
  const [fullName, setFullName] = useState(staff?.fullName ?? "");
  const [email, setEmail] = useState(staff?.email ?? "");
  const [phone, setPhone] = useState(staff?.phone ?? "");
  const [role, setRole] = useState(staff?.role ?? data.roles[0]?.name ?? "");
  const [status, setStatus] = useState<StaffRecord["status"]>(
    staff?.status ?? "active",
  );
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName.trim() || !email.includes("@") || !phone.trim() || !role) {
      setError("Full name, valid email, phone, and role are required.");
      return;
    }
    const result = await saveStaff({
      id: staff?.id ?? crypto.randomUUID(),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      status,
    });
    if (result.kind === "success") onOpenChange(false);
    else setError(result.message);
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>
            {staff ? "Edit operator user" : "Add operator user"}
          </SheetTitle>
          <SheetDescription>
            Assign a workspace role and account status. The server will enforce
            the same operator tenant later.
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-5 px-4 pb-6" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="staff-name">Full name</Label>
            <Input
              id="staff-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="staff-email">Email</Label>
              <Input
                id="staff-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-phone">Phone</Label>
              <Input
                id="staff-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="staff-role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="staff-role" className="w-full">
                  <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent>
                  {data.roles.map((item) => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  if (isStaffStatus(value)) setStatus(value);
                }}
              >
                <SelectTrigger id="staff-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error ? (
            <Alert className="border-destructive/30 bg-destructive/8">
              <AlertTitle>Could not save user</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <SheetFooter className="px-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pendingKey?.startsWith("staff:") === true}
            >
              {pendingKey?.startsWith("staff:") === true ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save user
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
