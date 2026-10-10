"use client";

import { useRouter } from "next/navigation";
import { Clock, ArrowRight, Users, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AmenityList } from "@/components/common/AmenityIcons";
import { VehicleTypePill } from "@/components/common/VehicleTypePill";
import type { Trip, Operator, VehicleType } from "@/types";
import { formatVND, getCityName, formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

interface TripCardProps {
  readonly trip: Trip;
  readonly operator: Operator | undefined;
}

export function TripCard({ trip, operator }: TripCardProps) {
  const router = useRouter();
  const seatsLow = trip.availableSeats <= 5 && trip.availableSeats > 0;
  const hasStops = trip.stops.length > 2;

  const vehicleType: VehicleType =
    trip.vehicleType ??
    (trip.busType === "double-decker" ? "sleeper" : trip.busType === "premium" ? "limousine" : "seat");

  // Subtle border highlight on hover matching vehicle theme
  const hoverBorderClass =
    vehicleType === "limousine"
      ? "hover:border-amber-500/40 hover:shadow-amber-500/5"
      : vehicleType === "sleeper"
      ? "hover:border-violet-500/40 hover:shadow-violet-500/5"
      : "hover:border-emerald-500/40 hover:shadow-emerald-500/5";

  return (
    <Card
      role="article"
      data-testid="trip-card"
      className={cn(
        "group cursor-pointer rounded-2xl border p-4 sm:p-5 lg:p-6 transition-[box-shadow,border-color,transform] duration-200 ease-out active:scale-[0.985]",
        "border-border bg-card hover:shadow-card-hover",
        hoverBorderClass
      )}
      onClick={() => router.push(`/trips/${trip.id}/seats`)}
    >
      {/* Mobile Layout (< lg) */}
      <div className="flex flex-col gap-3 lg:hidden">
        {/* Header: Operator & Vehicle pill */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold shadow-2xs"
              style={{ backgroundColor: operator?.logoColor ?? "#64748b" }}
            >
              {operator?.name.charAt(0) ?? "B"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-foreground">
                {operator?.name ?? "Nhà xe"}
              </p>
              {operator && operator.totalReviews > 0 && (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold">
                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                  <span>{operator.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <VehicleTypePill type={vehicleType} />
          </div>
        </div>

        {/* Journey times box */}
        <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/40 px-3.5 py-2.5 border border-border/40">
          <div className="text-left">
            <p className="text-lg font-black tracking-tight tabular-nums text-foreground">{trip.departureTime}</p>
            <p className="text-[11px] font-semibold text-muted-foreground truncate max-w-[85px] sm:max-w-none">{getCityName(trip.originId)}</p>
          </div>

          <div className="flex flex-1 flex-col items-center px-2">
            <span className="text-[11px] font-medium text-muted-foreground">{formatDuration(trip.durationMinutes)}</span>
            <div className="relative my-1 w-full flex items-center justify-center">
              <div className="h-px w-full bg-border" />
              <span className="absolute size-1.5 rounded-full bg-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground/80">
              {hasStops ? `${trip.stops.length - 2} điểm dừng` : "Chạy thẳng"}
            </span>
          </div>

          <div className="text-right">
            <p className="text-lg font-black tracking-tight tabular-nums text-foreground">{trip.arrivalTime}</p>
            <p className="text-[11px] font-semibold text-muted-foreground truncate max-w-[85px] sm:max-w-none">{getCityName(trip.destinationId)}</p>
          </div>
        </div>

        {/* Footer: Price + CTA button */}
        <div className="flex items-center justify-between gap-3 pt-0.5">
          <div>
            <span className="text-lg font-black text-foreground tabular-nums tracking-tight">
              {formatVND(trip.price)}
            </span>
            <div className="mt-0.5 flex items-center gap-1.5">
              {seatsLow ? (
                <span className="text-[11px] font-semibold text-destructive">
                  Chỉ còn {trip.availableSeats} chỗ
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground font-medium">
                  Còn {trip.availableSeats} chỗ
                </span>
              )}
            </div>
          </div>

          <Button
            size="lg"
            className={cn(
              "h-9 px-4 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 shadow-xs shrink-0",
              vehicleType === "limousine" && "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20",
              vehicleType === "sleeper" && "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20",
              vehicleType === "seat" && "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
            )}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/trips/${trip.id}/seats`);
            }}
          >
            <span>Chọn ghế</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Desktop Layout (>= lg) */}
      <div className="hidden lg:flex lg:items-center lg:justify-between gap-4">
        {/* Left: Operator + times */}
        <div className="flex items-center gap-5">
          {/* Operator badge */}
          <div className="flex shrink-0 flex-col items-center gap-1.5">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-2xs"
              style={{ backgroundColor: operator?.logoColor ?? "#64748b" }}
            >
              <span className="text-lg font-bold">
                {operator?.name.charAt(0) ?? "B"}
              </span>
            </div>
            {operator && operator.totalReviews > 0 && (
              <div className="flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-semibold">{operator.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Times */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-extrabold tracking-tight tabular-nums">{trip.departureTime}</p>
              <p className="truncate text-xs font-semibold text-muted-foreground">{getCityName(trip.originId)}</p>
            </div>

            <div className="flex shrink-0 flex-col items-center">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDuration(trip.durationMinutes)}
              </div>
              <div className="relative mt-1 h-px w-20 bg-border">
                <div className="absolute -top-1 left-0 h-2 w-2 rounded-full border-2 border-border bg-background" />
                <div className="absolute -top-1 right-0 h-2 w-2 rounded-full border-2 border-primary bg-background" />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {hasStops ? `${trip.stops.length - 2} điểm dừng` : "Chạy thẳng"}
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-extrabold tracking-tight tabular-nums">{trip.arrivalTime}</p>
              <p className="truncate text-xs font-semibold text-muted-foreground">{getCityName(trip.destinationId)}</p>
            </div>
          </div>
        </div>

        {/* Middle: Amenities */}
        <div>
          <AmenityList amenities={trip.amenities} />
        </div>

        {/* Right: Price + CTA */}
        <div className="flex flex-col items-end gap-1.5">
          <VehicleTypePill type={vehicleType} />
          <span className="text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
            {formatVND(trip.price)}
          </span>
          <div className="flex items-center gap-1.5">
            {seatsLow && (
              <span className="text-xs font-semibold text-destructive">
                Chỉ còn {trip.availableSeats} chỗ
              </span>
            )}
            {!seatsLow && trip.availableSeats > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                Còn {trip.availableSeats} chỗ
              </span>
            )}
          </div>
          <Button
            size="lg"
            className={cn(
              "w-full h-9 rounded-xl font-bold transition-transform duration-150 ease-out active:scale-[0.97]",
              vehicleType === "limousine" && "bg-amber-600 hover:bg-amber-700 text-white shadow-xs shadow-amber-500/20",
              vehicleType === "sleeper" && "bg-violet-600 hover:bg-violet-700 text-white shadow-xs shadow-violet-500/20",
              vehicleType === "seat" && "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-500/20"
            )}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/trips/${trip.id}/seats`);
            }}
          >
            <span>Chọn ghế</span>
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
