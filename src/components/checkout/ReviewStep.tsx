"use client";

import { Clock, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AmenityList } from "@/components/common/AmenityIcons";
import type { Trip, Operator } from "@/types";
import type { SelectedSeat } from "@/types/booking";
import { formatVND, getCityName, formatDuration } from "@/lib/format";

interface ReviewStepProps {
  trip: Trip;
  seats: SelectedSeat[];
  operator: Operator | undefined;
  onContinue: () => void;
}


export function ReviewStep({ trip, seats, operator, onContinue }: ReviewStepProps) {
  const total = seats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Trip summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Operator */}
          {operator && (
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: operator.logoColor }}
              >
                <span className="font-bold">{operator.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-semibold">{operator.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold">{operator.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({operator.totalReviews.toLocaleString()})</span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Route */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-xl font-bold tabular-nums">{trip.departureTime}</p>
              <p className="text-xs text-muted-foreground">{getCityName(trip.originId)}</p>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDuration(trip.durationMinutes)}
              </div>
              <div className="relative mt-1 h-px w-full bg-border">
                <div className="absolute -top-1 left-0 h-2 w-2 rounded-full border-2 border-border bg-background" />
                <div className="absolute -top-1 right-0 h-2 w-2 rounded-full border-2 border-primary bg-background" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold tabular-nums">{trip.arrivalTime}</p>
              <p className="text-xs text-muted-foreground">{getCityName(trip.destinationId)}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{trip.date}</p>

          <Separator />

          {/* Amenities */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Amenities
            </p>
            <AmenityList amenities={trip.amenities} showLabels />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Selected seats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {seats.map((seat) => (
            <div key={seat.label} className="flex items-center justify-between text-sm">
              <span>Seat {seat.label}</span>
              <span className="font-medium tabular-nums">{formatVND(seat.price)}</span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold text-primary tabular-nums">{formatVND(total)}</span>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onContinue} size="lg" className="w-full">
        Continue to passenger details
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}
