"use client";

import { useRouter } from "next/navigation";
import { Clock, ArrowRight, Users, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AmenityList } from "@/components/common/AmenityIcons";
import type { Trip, Operator } from "@/types";
import { formatVND, getCityName, formatDuration } from "@/lib/format";

interface TripCardProps {
  readonly trip: Trip;
  readonly operator: Operator | undefined;
}


export function TripCard({ trip, operator }: TripCardProps) {
  const router = useRouter();
  const seatsLow = trip.availableSeats <= 5 && trip.availableSeats > 0;
  const hasStops = trip.stops.length > 2;

  return (
    <Card
      className="group hover-lift-sm cursor-pointer p-5 transition-[box-shadow,border-color] duration-200 ease-out hover:border-primary/30 hover:shadow-card-hover active:scale-[0.98] sm:p-6"
      onClick={() => router.push(`/trips/${trip.id}/seats`)}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Operator + times */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Operator badge */}
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-card sm:h-12 sm:w-12"
              style={{ backgroundColor: operator?.logoColor ?? "#64748b" }}
            >
              <span className="text-base font-bold sm:text-lg">
                {operator?.name.charAt(0) ?? "B"}
              </span>
            </div>
            {operator && (
              <div className="flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-semibold">{operator.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Times */}
          <div className="flex flex-1 items-center gap-2 sm:gap-4">
            <div className="text-center">
              <p className="text-xl font-extrabold tracking-tight tabular-nums sm:text-2xl">{trip.departureTime}</p>
              <p className="truncate text-xs text-muted-foreground">{getCityName(trip.originId)}</p>
            </div>

            <div className="flex shrink-0 flex-col items-center">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDuration(trip.durationMinutes)}
              </div>
              <div className="relative mt-1 h-px w-12 bg-border sm:w-20">
                <div className="absolute -top-1 left-0 h-2 w-2 rounded-full border-2 border-border bg-background" />
                <div className="absolute -top-1 right-0 h-2 w-2 rounded-full border-2 border-primary bg-background" />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {hasStops ? `${trip.stops.length - 2} stops` : "Direct"}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xl font-extrabold tracking-tight tabular-nums sm:text-2xl">{trip.arrivalTime}</p>
              <p className="truncate text-xs text-muted-foreground">{getCityName(trip.destinationId)}</p>
            </div>
          </div>
        </div>

        {/* Middle: Amenities */}
        <div className="hidden lg:block">
          <AmenityList amenities={trip.amenities} />
        </div>

        {/* Right: Price + CTA */}
        <div className="flex items-center justify-between gap-4 border-t border-border pt-3 lg:flex-col lg:items-end lg:gap-1.5 lg:border-0 lg:pt-0">
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-primary tabular-nums sm:text-2xl">
              {formatVND(trip.price)}
            </span>
            <div className="flex items-center gap-1.5">
              {seatsLow && (
                <span className="text-xs font-medium text-destructive">
                  Only {trip.availableSeats} left
                </span>
              )}
              {!seatsLow && trip.availableSeats > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {trip.availableSeats} seats
                </span>
              )}
            </div>
          </div>
          <Button
            size="sm"
            className="lg:w-full"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/trips/${trip.id}/seats`);
            }}
          >
            Choose seats
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Mobile amenities */}
      <div className="mt-3 border-t border-border pt-3 lg:hidden">
        <AmenityList amenities={trip.amenities} />
      </div>
    </Card>
  );
}
