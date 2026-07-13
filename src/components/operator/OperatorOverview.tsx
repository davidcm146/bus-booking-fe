import { ArrowUpRight, BusFront, CreditCard, Star, TicketCheck, TriangleAlert, UsersRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/operator/StatusBadge";
import type { OperatorDashboardData, OperatorMetric } from "@/types/operator";

interface OperatorOverviewProps {
  readonly data: OperatorDashboardData;
  readonly onOpenTrips: () => void;
  readonly onOpenBookings: () => void;
}

const METRIC_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Trips today": BusFront,
  "Seat occupancy": UsersRound,
  "Revenue today": CreditCard,
};

function MetricIcon({ label }: Pick<OperatorMetric, "label">) {
  const Icon = METRIC_ICONS[label] ?? TriangleAlert;
  return <Icon />;
}

export function OperatorOverview({ data, onOpenTrips, onOpenBookings }: OperatorOverviewProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <Card key={metric.label} className="gap-4 py-5 shadow-card">
            <CardContent className="flex items-start justify-between px-5">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{metric.label}</p>
                <p className="mt-2 text-3xl font-extrabold tracking-[-0.04em] tabular-nums">{metric.value}</p>
                <p className={metric.tone === "warning" ? "mt-1.5 text-xs font-semibold text-foreground" : "mt-1.5 text-xs text-muted-foreground"}>
                  {metric.detail}
                </p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-light text-primary [&_svg]:size-4">
                <MetricIcon label={metric.label} />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr] xl:items-start">
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between border-b border-border pb-4">
            <div>
              <CardTitle className="text-lg font-extrabold">Today&apos;s departures</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Live capacity across the next service window.</p>
            </div>
            <Button type="button" variant="ghost" onClick={onOpenTrips} className="text-primary hover:text-primary-dark">
              All trips <ArrowUpRight className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="divide-y divide-border px-5">
            {data.trips.slice(0, 3).map((trip) => {
              const occupancy = Math.round((trip.bookedSeats / trip.totalSeats) * 100);
              return (
                <div key={trip.id} className="grid gap-3 py-4 sm:grid-cols-[5rem_1fr_auto] sm:items-center">
                  <div>
                    <p className="text-xl font-extrabold tabular-nums">{trip.departureTime}</p>
                    <p className="text-xs text-muted-foreground">{trip.vehiclePlate}</p>
                  </div>
                  <div>
                    <p className="font-bold">{trip.routeName}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${occupancy}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{trip.bookedSeats}/{trip.totalSeats} seats · {occupancy}% occupied</p>
                  </div>
                  <StatusBadge label={trip.status} tone={trip.status === "running" ? "positive" : "neutral"} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="shadow-card">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-lg font-extrabold">Action center</CardTitle>
              <p className="text-sm text-muted-foreground">Operational items that need a decision today.</p>
            </CardHeader>
            <CardContent className="divide-y divide-border px-5">
              {data.alerts.map((alert) => (
                <div key={alert.id} className="flex gap-3 py-4">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/12 text-warning"><TriangleAlert className="size-3.5" /></span>
                  <div><p className="text-sm font-bold">{alert.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{alert.detail}</p></div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-card text-card-foreground shadow-card-hover">
            <CardHeader>
              <p className="text-xs font-bold text-primary">BOARDING DESK</p>
              <CardTitle className="text-xl font-extrabold">Ready for the next passenger</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">Search a booking code, verify payment, and check in every seat from one queue.</p>
              <Button type="button" onClick={onOpenBookings} className="mt-5 w-full">
                <TicketCheck className="size-4" /> Open check-in desk
              </Button>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-warning/12 text-warning"><Star className="size-5 fill-current" /></span>
              <div>
                <p className="text-2xl font-extrabold tabular-nums">{data.averageRating}</p>
                <p className="text-xs text-muted-foreground">from {data.reviewCount.toLocaleString("en-US")} verified reviews</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
