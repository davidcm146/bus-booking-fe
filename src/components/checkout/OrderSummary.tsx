import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Trip, Operator } from "@/types";
import type { SelectedSeat } from "@/types/booking";
import { formatVND, getCityName, formatDuration } from "@/lib/format";

interface OrderSummaryProps {
  readonly trip: Trip;
  readonly seats: readonly SelectedSeat[];
  readonly operator?: Operator;
  readonly total: number;
}


export function OrderSummary({ trip, seats, operator, total }: OrderSummaryProps) {
  const seatsLow = trip.availableSeats <= 5 && trip.availableSeats > 0;

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-extrabold tracking-tight">Order summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route */}
        <div>
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{getCityName(trip.originId)}</span>
            <span className="text-muted-foreground">&rarr;</span>
            <span>{getCityName(trip.destinationId)}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{trip.departureTime} - {trip.arrivalTime}</span>
            <span>({formatDuration(trip.durationMinutes)})</span>
          </div>
          {operator && (
            <p className="mt-1 text-xs text-muted-foreground">{operator.name}</p>
          )}
        </div>

        <Separator />

        {/* Seats */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {seats.length} {seats.length === 1 ? "seat" : "seats"}
          </p>
          {seats.map((seat) => (
            <div key={seat.label} className="flex items-center justify-between text-sm">
              <span>Seat {seat.label}</span>
              <span className="font-medium tabular-nums">{formatVND(seat.price)}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-extrabold tracking-tight text-primary tabular-nums">{formatVND(total)}</span>
        </div>

        {seatsLow && (
          <p className="rounded-lg bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive">
            Hurry - only {trip.availableSeats} seats left on this bus
          </p>
        )}
      </CardContent>
    </Card>
  );
}
