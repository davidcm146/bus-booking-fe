"use client";

import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Ticket, ArrowRight, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getBookings } from "@/lib/services/bookingService";
import { formatVND, getCityName } from "@/lib/format";

export default function BookingsPage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) redirect("/login?redirect=/bookings");

  const bookings = [...getBookings()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 rounded-3xl bg-muted/65 p-6 ring-1 ring-border sm:flex sm:items-end sm:justify-between sm:p-8">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-primary">
            <Route className="h-4 w-4" />
            Your travel library
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Bookings and tickets</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Open an upcoming trip to see the full boarding pass and seat details.</p>
        </div>
        <Button asChild variant="outline" className="mt-5 bg-surface sm:mt-0">
          <Link href="/">Find another bus</Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/35 p-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
            <Ticket className="h-7 w-7" />
          </span>
          <h3 className="mt-5 text-xl font-extrabold tracking-tight">No bookings yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Search for buses and book your first trip.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Search for buses</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className="hover-lift-sm cursor-pointer transition-[box-shadow,border-color] duration-200 ease-out hover:border-primary/30 hover:shadow-card-hover active:scale-[0.98]"
            >
              <Link href={`/bookings/${booking.id}`} className="block">
                <CardContent className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold tracking-tight sm:text-lg">
                        {getCityName(booking.trip.originId)} &rarr; {getCityName(booking.trip.destinationId)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {booking.trip.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {booking.trip.departureTime}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {booking.bookingRef}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-border pt-4 sm:border-0 sm:pt-0 sm:text-right">
                    <div>
                    <p className="text-lg font-extrabold text-primary tabular-nums">
                      {formatVND(booking.totalPaid)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.seats.length} {booking.seats.length === 1 ? "seat" : "seats"}
                    </p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
