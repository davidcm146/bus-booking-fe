"use client";

import { useMemo, useState } from "react";
import { Check, CreditCard, Search, TicketCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/operator/StatusBadge";
import { formatVND } from "@/lib/format";
import { checkInOperatorBooking } from "@/lib/services/operatorService";
import type { OperatorBooking, OperatorCheckInResult, PaymentStatus } from "@/types/operator";

interface BookingDeskProps {
  readonly bookings: readonly OperatorBooking[];
  readonly checkedInIds: ReadonlySet<string>;
  readonly onCheckedIn: (bookingId: string) => void;
}

function paymentTone(status: PaymentStatus): "positive" | "warning" | "critical" | "neutral" {
  if (status === "paid") return "positive";
  if (status === "pending" || status === "unpaid") return "warning";
  if (status === "failed") return "critical";
  return "neutral";
}

export function BookingDesk({ bookings, checkedInIds, onCheckedIn }: BookingDeskProps) {
  const [query, setQuery] = useState("");
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [checkInError, setCheckInError] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleBookings = useMemo(() => {
    if (!normalizedQuery) return bookings;
    return bookings.filter((booking) => [booking.bookingCode, booking.passengerName, booking.passengerPhone, ...booking.seats]
      .some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [bookings, normalizedQuery]);

  function applyCheckInResult(result: OperatorCheckInResult) {
    switch (result.kind) {
      case "success":
        onCheckedIn(result.bookingId);
        setCheckInError(null);
        return;
      case "not_found":
      case "not_eligible":
        setCheckInError(result.message);
        return;
      default: {
        const unreachable: never = result;
        return unreachable;
      }
    }
  }

  async function checkIn(bookingId: string) {
    setCheckingInId(bookingId);
    setCheckInError(null);
    try {
      const result = await checkInOperatorBooking(bookingId);
      applyCheckInResult(result);
    } catch {
      setCheckInError("Check-in could not be completed. Please try again.");
    } finally {
      setCheckingInId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold tracking-[-0.03em]">Bookings & check-in</h2>
        <p className="mt-1 text-sm text-muted-foreground">Verify payment and board passengers by code, phone, name, or seat.</p>
      </div>

      <Card className="border-primary/20 bg-card text-card-foreground shadow-card-hover">
        <CardContent className="p-5 sm:p-6">
          <Label htmlFor="booking-search" className="text-sm font-bold text-card-foreground">Find a passenger</Label>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="booking-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Booking code, phone, passenger, or seat" className="h-12 bg-surface pl-11" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Try BB-6Q2X8P, Mai Anh, or A03</p>
        </CardContent>
      </Card>

      {checkInError && <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">{checkInError}</p>}

      {visibleBookings.length === 0 ? (
        <Card className="border-dashed bg-muted/35 shadow-none"><CardContent className="p-10 text-center"><Search className="mx-auto size-6 text-muted-foreground" /><p className="mt-4 font-extrabold">No matching booking</p><p className="mt-1 text-sm text-muted-foreground">Check the booking code or search by phone number.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {visibleBookings.map((booking) => {
            const checkedIn = checkedInIds.has(booking.id);
            const canCheckIn = booking.paymentStatus === "paid" && booking.status === "confirmed";
            return (
              <Card key={booking.id} className={checkedIn ? "border-primary/30 bg-primary-light/20 shadow-card" : "shadow-card"}>
                <CardContent className="grid gap-5 p-5 lg:grid-cols-[1.2fr_1fr_0.75fr_auto] lg:items-center lg:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><p className="font-mono text-sm font-extrabold">{booking.bookingCode}</p><StatusBadge label={booking.status} tone={booking.status === "confirmed" ? "positive" : "warning"} /></div>
                    <p className="mt-2 flex items-center gap-2 font-extrabold"><UserRound className="size-4 text-primary" /> {booking.passengerName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{booking.passengerPhone}</p>
                  </div>
                  <div><p className="font-bold">{booking.routeName}</p><p className="mt-1 text-xs text-muted-foreground">Departs {booking.departureTime} · Seats {booking.seats.join(", ")}</p></div>
                  <div><p className="text-base font-extrabold tabular-nums">{formatVND(booking.totalAmount)}</p><div className="mt-1 flex items-center gap-1.5"><CreditCard className="size-3 text-muted-foreground" /><StatusBadge label={booking.paymentStatus} tone={paymentTone(booking.paymentStatus)} /></div></div>
                  {checkedIn ? (
                    <span role="status" className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-light px-4 text-sm font-bold text-primary-dark"><Check className="size-4" /> Checked in</span>
                  ) : (
                    <Button onClick={async () => { await checkIn(booking.id); }} disabled={!canCheckIn || checkingInId !== null} aria-busy={checkingInId === booking.id}><TicketCheck className="size-4" /> {checkingInId === booking.id ? "Checking in…" : "Check in"}</Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
