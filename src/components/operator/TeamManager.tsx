"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DeleteDialog,
  EmptyCollection,
  ManagerHeader,
  PaginationBar,
} from "@/components/operator/ManagementPrimitives";
import { StaffEditorSheet } from "@/components/operator/StaffEditorSheet";
import { StatusBadge } from "@/components/operator/StatusBadge";
import { useOperator } from "@/contexts/OperatorContext";
import { usePagination } from "@/hooks/usePagination";
import type { StaffRecord } from "@/types/operator";

export function TeamManager() {
  const { data, deleteStaff, pendingKey } = useOperator();
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffRecord | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffRecord | null>(null);
  const staff = useMemo(() => {
    const value = query.trim().toLowerCase();
    return data.staff.filter((item) =>
      `${item.fullName} ${item.email} ${item.phone} ${item.role}`
        .toLowerCase()
        .includes(value),
    );
  }, [data.staff, query]);
  const pagination = usePagination(staff, 5);
  function openEditor(record: StaffRecord | null) {
    setEditingStaff(record);
    setEditorOpen(true);
  }
  async function confirmDelete() {
    if (!deletingStaff) return;
    await deleteStaff(deletingStaff.id);
    setDeletingStaff(null);
  }
  return (
    <div className="space-y-5">
      <ManagerHeader
        title="People & access"
        description="Maintain operator users, role assignments, account state, and tenant identity."
      />
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="no-scrollbar h-10 w-fit max-w-full justify-start overflow-x-auto bg-muted/70 p-1">
          <TabsTrigger value="users">
            Operator users
          </TabsTrigger>
          <TabsTrigger value="roles">
            Roles
          </TabsTrigger>
          <TabsTrigger value="profile">
            Operator profile
          </TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-10"
                placeholder="Search users"
              />
            </div>
            <Button type="button" onClick={() => openEditor(null)}>
              <Plus className="size-4" />
              Add user
            </Button>
          </div>
          {staff.length === 0 ? (
            <EmptyCollection
              title="No users found"
              description="Clear the search or add an operator user."
              actionLabel="Add user"
              onAction={() => openEditor(null)}
            />
          ) : (
            <Card className="gap-0 py-0 shadow-card">
              <CardContent className="divide-y divide-border px-4">
                {pagination.pageItems.map((record) => (
                  <div
                    key={record.id}
                    className="grid gap-3 py-4 md:grid-cols-[1fr_1fr_auto] md:items-center"
                  >
                    <div>
                      <p className="font-extrabold">{record.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {record.email} · {record.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{record.role}</p>
                      <StatusBadge
                        label={record.status}
                        tone={
                          record.status === "active"
                            ? "positive"
                            : record.status === "blocked"
                              ? "critical"
                              : "neutral"
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditor(record)}
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        aria-label={`Delete ${record.fullName}`}
                        onClick={() => setDeletingStaff(record)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <PaginationBar
                page={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                onPageChange={pagination.setPage}
              />
            </Card>
          )}
        </TabsContent>
        <TabsContent value="roles">
          <div className="grid gap-3 md:grid-cols-3">
            {data.roles.map((role) => (
              <Card key={role.id} className="shadow-card">
                <CardContent className="p-5">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <ShieldCheck className="size-4" />
                  </span>
                  <p className="mt-4 font-extrabold">{role.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {role.userCount} assigned users
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="profile">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                {data.profile.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold text-muted-foreground">
                  OPERATOR CODE
                </p>
                <p className="mt-1 font-semibold">{data.profile.code}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground">
                  STATUS
                </p>
                <div className="mt-1">
                  <StatusBadge label={data.profile.status} tone="positive" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground">
                  HOTLINE
                </p>
                <p className="mt-1 font-semibold">{data.profile.hotline}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground">EMAIL</p>
                <p className="mt-1 font-semibold">{data.profile.email}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-bold text-muted-foreground">
                  POLICY
                </p>
                <p className="mt-1 text-sm">{data.profile.policy}</p>
              </div>
              <p className="flex items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
                <UsersRound className="size-4" />
                Tenant ID: {data.operatorId}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {editorOpen ? (
        <StaffEditorSheet
          open={editorOpen}
          onOpenChange={setEditorOpen}
          staff={editingStaff}
        />
      ) : null}
      <DeleteDialog
        open={deletingStaff !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingStaff(null);
        }}
        label={deletingStaff?.fullName ?? "user"}
        pending={pendingKey === `staff:${deletingStaff?.id ?? ""}`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
