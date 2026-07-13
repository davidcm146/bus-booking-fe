import { BellRing, ClipboardList, CreditCard, Gift, MessageSquareText, TicketCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/operator/StatusBadge";
import { formatVND } from "@/lib/format";
import type { OperatorDashboardData, PaymentStatus } from "@/types/operator";

interface ActivityRegistryProps {
  readonly data: OperatorDashboardData;
}

function paymentTone(status: PaymentStatus): "positive" | "warning" | "critical" | "neutral" {
  if (status === "paid") return "positive";
  if (status === "pending" || status === "unpaid") return "warning";
  if (status === "failed") return "critical";
  return "neutral";
}

export function ActivityRegistry({ data }: ActivityRegistryProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card className="shadow-card">
        <CardHeader className="border-b border-border pb-4"><div className="flex items-center justify-between"><div><CardTitle className="text-lg font-extrabold">Seat inventory</CardTitle><p className="mt-1 text-sm text-muted-foreground">Available, held, booked, and blocked by trip.</p></div><TicketCheck className="size-5 text-primary" /></div></CardHeader>
        <CardContent className="space-y-3 p-5">{data.seatInventories.map((inventory) => <Card key={inventory.tripLabel} size="sm" className="shadow-none"><CardContent className="p-4"><p className="font-bold">{inventory.tripLabel}</p><div className="mt-3 grid grid-cols-4 gap-2 text-center"><div><p className="text-lg font-extrabold text-primary-dark">{inventory.available}</p><p className="text-xs text-muted-foreground">Available</p></div><div><p className="text-lg font-extrabold text-foreground">{inventory.held}</p><p className="text-xs text-muted-foreground">Held</p></div><div><p className="text-lg font-extrabold">{inventory.booked}</p><p className="text-xs text-muted-foreground">Booked</p></div><div><p className="text-lg font-extrabold text-destructive">{inventory.blocked}</p><p className="text-xs text-muted-foreground">Blocked</p></div></div></CardContent></Card>)}</CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="border-b border-border pb-4"><div className="flex items-center justify-between"><div><CardTitle className="text-lg font-extrabold">Payments</CardTitle><p className="mt-1 text-sm text-muted-foreground">Provider, method, transaction, and settlement state.</p></div><CreditCard className="size-5 text-primary" /></div></CardHeader>
        <CardContent className="space-y-3 p-5">{data.payments.map((payment) => <Card key={payment.id} size="sm" className="shadow-none"><CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="font-mono text-sm font-extrabold">{payment.bookingCode}</p><p className="mt-1 text-xs text-muted-foreground capitalize">{payment.provider} · {payment.method.replaceAll("_", " ")} · {payment.transactionRef}</p></div><div className="sm:text-right"><p className="font-extrabold tabular-nums">{formatVND(payment.amount)}</p><div className="mt-1"><StatusBadge label={payment.status} tone={paymentTone(payment.status)} /></div></div></CardContent></Card>)}</CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="border-b border-border pb-4"><div className="flex items-center justify-between"><div><CardTitle className="text-lg font-extrabold">Promotion applications</CardTitle><p className="mt-1 text-sm text-muted-foreground">Discount snapshots attached to bookings.</p></div><Gift className="size-5 text-primary" /></div></CardHeader>
        <CardContent className="space-y-3 p-5">{data.bookingPromotions.map((application) => <Card key={`${application.bookingCode}-${application.promotionCode}`} size="sm" className="bg-primary-light/25 shadow-none"><CardContent className="flex items-center justify-between gap-4 p-4"><div><p className="font-mono text-sm font-extrabold">{application.bookingCode}</p><p className="mt-1 text-xs font-bold text-primary">{application.promotionCode}</p></div><p className="font-extrabold text-primary tabular-nums">−{formatVND(application.discountAmount)}</p></CardContent></Card>)}</CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="border-b border-border pb-4"><div className="flex items-center justify-between"><div><CardTitle className="text-lg font-extrabold">Notifications</CardTitle><p className="mt-1 text-sm text-muted-foreground">Booking and trip delivery attempts.</p></div><BellRing className="size-5 text-primary" /></div></CardHeader>
        <CardContent className="space-y-3 p-5">{data.notifications.map((notification) => <Card key={notification.id} size="sm" className="shadow-none"><CardContent className="grid gap-2 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="font-bold">{notification.title}</p><p className="mt-1 text-xs capitalize text-muted-foreground">{notification.type.replaceAll("_", " ")} · {notification.channel}</p></div><StatusBadge label={notification.status} tone={notification.status === "sent" ? "positive" : notification.status === "failed" ? "critical" : "warning"} /></CardContent></Card>)}</CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="border-b border-border pb-4"><div className="flex items-center justify-between"><div><CardTitle className="text-lg font-extrabold">Recent reviews</CardTitle><p className="mt-1 text-sm text-muted-foreground">Verified feedback tied to completed bookings.</p></div><MessageSquareText className="size-5 text-primary" /></div></CardHeader>
        <CardContent className="space-y-3 p-5">{data.reviews.map((review) => <Card key={review.bookingCode} size="sm" className="shadow-none"><CardContent className="p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{review.passengerName}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{review.bookingCode} · {review.createdAt}</p></div><StatusBadge label={`${review.rating}/5`} tone="positive" /></div><p className="mt-3 text-sm leading-6">{review.comment}</p></CardContent></Card>)}</CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="border-b border-border pb-4"><div className="flex items-center justify-between"><div><CardTitle className="text-lg font-extrabold">Audit log</CardTitle><p className="mt-1 text-sm text-muted-foreground">Actor, action, and affected entity.</p></div><ClipboardList className="size-5 text-primary" /></div></CardHeader>
        <CardContent className="space-y-3 p-5">{data.auditLogs.map((log) => <Card key={log.id} size="sm" className="bg-muted/35 shadow-none"><CardContent className="p-4"><div className="flex items-start justify-between gap-3"><p className="font-bold">{log.actorName}</p><span className="text-xs text-muted-foreground">{log.createdAt}</span></div><p className="mt-2 font-mono text-xs font-bold text-primary">{log.action}</p><p className="mt-1 text-xs text-muted-foreground">{log.entityType} · {log.entityId}</p></CardContent></Card>)}</CardContent>
      </Card>
    </div>
  );
}
