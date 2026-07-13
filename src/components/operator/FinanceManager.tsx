"use client";

import { useMemo, useState } from "react";
import {
  BellRing,
  CheckCircle2,
  CreditCard,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  Star,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ManagerHeader,
  PaginationBar,
} from "@/components/operator/ManagementPrimitives";
import { StatusBadge } from "@/components/operator/StatusBadge";
import { useOperator } from "@/contexts/OperatorContext";
import { usePagination } from "@/hooks/usePagination";
import { formatVND } from "@/lib/format";
import type { PaymentRecord } from "@/types/operator";

export function FinanceManager() {
  const {
    data,
    pendingKey,
    refundPayment,
    reconcilePayment,
    retryNotification,
  } = useOperator();
  const [query, setQuery] = useState("");
  const [refundTarget, setRefundTarget] = useState<PaymentRecord | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const normalized = query.trim().toLowerCase();
  const payments = useMemo(
    () =>
      data.payments.filter((item) =>
        `${item.bookingCode} ${item.provider} ${item.transactionRef}`
          .toLowerCase()
          .includes(normalized),
      ),
    [data.payments, normalized],
  );
  const auditLogs = useMemo(
    () =>
      data.auditLogs.filter((item) =>
        `${item.actorName} ${item.action} ${item.entityType} ${item.entityId}`
          .toLowerCase()
          .includes(normalized),
      ),
    [data.auditLogs, normalized],
  );
  const paymentPages = usePagination(payments, 5);
  const notificationPages = usePagination(data.notifications, 5);
  const auditPages = usePagination(auditLogs, 6);

  async function confirmRefund() {
    if (!refundTarget || !refundReason.trim()) {
      setMessage("Add a refund reason before continuing.");
      return;
    }
    const result = await refundPayment(refundTarget.id, refundReason.trim());
    setMessage(result.message);
    if (result.kind === "success") {
      setRefundTarget(null);
      setRefundReason("");
    }
  }
  async function reconcile(id: string) {
    const result = await reconcilePayment(id);
    setMessage(result.message);
  }
  async function retry(id: string) {
    const result = await retryNotification(id);
    setMessage(result.message);
  }

  return (
    <div className="space-y-5">
      <ManagerHeader
        title="Finance & communications"
        description="Reconcile transactions, issue refunds, retry failed notifications, and inspect immutable activity."
      />
      {message ? (
        <Alert className="border-primary/25 bg-primary-light/20">
          <AlertTitle>Workspace update</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      ) : null}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="pl-10"
          placeholder="Search payments or audit activity"
        />
      </div>
      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList className="no-scrollbar h-10 w-fit max-w-full justify-start overflow-x-auto bg-muted/70 p-1">
          <TabsTrigger value="payments">
            Payments
          </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="inventory">
            Seat inventory
          </TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews
          </TabsTrigger>
          <TabsTrigger value="audit">
            Audit log
          </TabsTrigger>
        </TabsList>
        <TabsContent value="payments">
          <Card className="gap-0 py-0 shadow-card">
            <CardContent className="divide-y divide-border px-4">
              {paymentPages.pageItems.map((payment) => (
                <div
                  key={payment.id}
                  className="grid gap-3 py-4 lg:grid-cols-[1.1fr_1fr_auto] lg:items-center"
                >
                  <div>
                    <p className="font-extrabold">{payment.bookingCode}</p>
                    <p className="text-xs text-muted-foreground">
                      {payment.transactionRef}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold tabular-nums">
                      {formatVND(payment.amount)}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <StatusBadge
                        label={payment.status}
                        tone={
                          payment.status === "paid"
                            ? "positive"
                            : payment.status === "failed"
                              ? "critical"
                              : payment.status === "pending"
                                ? "warning"
                                : "neutral"
                        }
                      />
                      <span className="text-xs text-muted-foreground">
                        {payment.provider} ·{" "}
                        {payment.method.replaceAll("_", " ")}
                      </span>
                    </div>
                    {payment.refundReason ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Refund: {payment.refundReason}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    {payment.status === "pending" ? (
                      <Button
                        type="button"
                        size="sm"
                        disabled={pendingKey === `payment:${payment.id}`}
                        onClick={() => reconcile(payment.id)}
                      >
                        {pendingKey === `payment:${payment.id}` ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-4" />
                        )}
                        Reconcile
                      </Button>
                    ) : null}
                    {payment.status === "paid" ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRefundTarget(payment);
                          setMessage(null);
                        }}
                      >
                        <RotateCcw className="size-4" />
                        Refund
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
            <PaginationBar
              page={paymentPages.page}
              totalPages={paymentPages.totalPages}
              totalItems={paymentPages.totalItems}
              onPageChange={paymentPages.setPage}
            />
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card className="gap-0 py-0 shadow-card">
            <CardContent className="divide-y divide-border px-4">
              {notificationPages.pageItems.map((notification) => (
                <div
                  key={notification.id}
                  className="grid gap-3 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <BellRing className="size-4" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-extrabold">{notification.title}</p>
                      <StatusBadge
                        label={notification.status}
                        tone={
                          notification.status === "sent"
                            ? "positive"
                            : notification.status === "failed"
                              ? "critical"
                              : "warning"
                        }
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {notification.channel} ·{" "}
                      {notification.type.replaceAll("_", " ")} ·{" "}
                      {notification.attemptCount} attempts
                    </p>
                    {notification.lastError ? (
                      <p className="mt-1 text-xs font-semibold text-destructive">
                        {notification.lastError}
                      </p>
                    ) : null}
                  </div>
                  {notification.status === "failed" ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={
                        pendingKey === `notification:${notification.id}`
                      }
                      onClick={() => retry(notification.id)}
                    >
                      {pendingKey === `notification:${notification.id}` ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <RefreshCcw className="size-4" />
                      )}
                      Retry
                    </Button>
                  ) : null}
                </div>
              ))}
            </CardContent>
            <PaginationBar
              page={notificationPages.page}
              totalPages={notificationPages.totalPages}
              totalItems={notificationPages.totalItems}
              onPageChange={notificationPages.setPage}
            />
          </Card>
        </TabsContent>
        <TabsContent value="inventory">
          <div className="grid gap-3 md:grid-cols-3">
            {data.seatInventories.map((inventory) => (
              <Card key={inventory.tripLabel} className="shadow-card">
                <CardHeader>
                  <CardTitle>{inventory.tripLabel}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-primary-light/45 p-3">
                    <p className="text-2xl font-extrabold text-primary-dark">
                      {inventory.available}
                    </p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                  <div className="rounded-xl bg-muted p-3">
                    <p className="text-2xl font-extrabold">
                      {inventory.booked}
                    </p>
                    <p className="text-xs text-muted-foreground">Booked</p>
                  </div>
                  <div className="rounded-xl bg-warning/10 p-3">
                    <p className="text-2xl font-extrabold">{inventory.held}</p>
                    <p className="text-xs text-muted-foreground">Held</p>
                  </div>
                  <div className="rounded-xl bg-destructive/8 p-3">
                    <p className="text-2xl font-extrabold">
                      {inventory.blocked}
                    </p>
                    <p className="text-xs text-muted-foreground">Blocked</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="grid gap-3 md:grid-cols-2">
            {data.reviews.map((review) => (
              <Card key={review.bookingCode} className="shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold">{review.passengerName}</p>
                    <span className="flex items-center gap-1 font-bold text-warning">
                      <Star className="size-4 fill-current" />
                      {review.rating}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6">{review.comment}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {review.bookingCode} · {review.createdAt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="audit">
          <Card className="gap-0 py-0 shadow-card">
            <CardContent className="divide-y divide-border px-4">
              {auditPages.pageItems.map((audit) => (
                <div
                  key={audit.id}
                  className="grid gap-2 py-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
                >
                  <div>
                    <p className="font-extrabold">{audit.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {audit.actorName}
                    </p>
                  </div>
                  <p className="text-sm">
                    {audit.entityType} · {audit.entityId}
                  </p>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {audit.createdAt}
                  </p>
                </div>
              ))}
            </CardContent>
            <PaginationBar
              page={auditPages.page}
              totalPages={auditPages.totalPages}
              totalItems={auditPages.totalItems}
              onPageChange={auditPages.setPage}
            />
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog
        open={refundTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRefundTarget(null);
            setRefundReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund {refundTarget?.bookingCode}</DialogTitle>
            <DialogDescription>
              Issue a full refund of{" "}
              {refundTarget ? formatVND(refundTarget.amount) : "the payment"}.
              This mock action records the reason and audit event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="refund-reason">Refund reason</Label>
            <Textarea
              id="refund-reason"
              value={refundReason}
              onChange={(event) => setRefundReason(event.target.value)}
              placeholder="Customer cancellation, duplicate charge…"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRefundTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={pendingKey === `payment:${refundTarget?.id ?? ""}`}
              onClick={confirmRefund}
            >
              <CreditCard className="size-4" />
              Confirm refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
