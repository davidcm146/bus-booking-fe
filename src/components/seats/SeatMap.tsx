"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BusFront, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeatCabin } from "./SeatCabin";
import { SeatLegend } from "./SeatLegend";
import { VehicleTypePill } from "@/components/common/VehicleTypePill";
import { UnifiedTripSidebarCard, SelectionSummary } from "./SeatSidebar";
import { getSeatAvailability } from "@/lib/services/seatService";
import { getOperator } from "@/lib/services/searchService";
import { useBooking } from "@/hooks/useBooking";
import type { Trip, SeatLayout } from "@/types";
import type { SeatData, SelectedSeat } from "@/types/booking";
import { getSeatPrice } from "@/lib/format";

interface SeatMapProps {
  readonly trip: Trip;
}

export function SeatMap({ trip }: SeatMapProps) {
  const router = useRouter();
  const { selectedSeats, addSeat, removeSeat, setTrip, getTotal } = useBooking();
  const [layout, setLayout] = useState<SeatLayout | null>(null);
  const [seats, setSeats] = useState<SeatData[]>([]);
  const [loading, setLoading] = useState(true);
  const operator = getOperator(trip.operatorId);

  useEffect(() => {
    setTrip(trip);
    let mounted = true;
    getSeatAvailability(trip).then((data) => {
      if (mounted) {
        setLayout(data.layout);
        setSeats(data.seats);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [trip, setTrip]);

  const maxReached = selectedSeats.length >= 5;
  const selectedLabels = new Set(selectedSeats.map((s) => s.label));

  function handleToggle(seat: SeatData) {
    if (selectedLabels.has(seat.label)) {
      removeSeat(seat.label);
    } else {
      if (maxReached) return;
      const selected: SelectedSeat = {
        label: seat.label,
        row: seat.row,
        col: seat.col,
        price: getSeatPrice(trip.price, seat.isPremium),
        deck: seat.deck,
      };
      addSeat(selected);
    }
  }

  function isWindowSeat(seat: SeatData): boolean {
    const rowSeats = seats
      .filter((s) => s.row === seat.row && (seat.deck ? s.deck === seat.deck : !s.deck))
      .sort((a, b) => a.col - b.col);
    if (rowSeats.length === 0) return false;
    return seat.col === rowSeats[0].col || seat.col === rowSeats[rowSeats.length - 1].col;
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const resolvedVehicleType =
    trip.vehicleType ??
    (trip.busType === "double-decker" ? "sleeper" : trip.busType === "premium" ? "limousine" : "seat");

  if (!layout) return null;

  return (
    <div
      className="relative"
      style={{
        background: "radial-gradient(ellipse at top, color-mix(in oklch, var(--color-primary) 8%, var(--color-background)) 0%, var(--color-background) 60%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-center gap-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="icon"
            aria-label="Back to results"
            className="text-muted-foreground hover:border-primary hover:text-primary transition-transform active:scale-[0.97]"
          >
            <ArrowLeft />
          </Button>
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-primary">
              <BusFront className="h-4 w-4" />
              Chọn chỗ ngồi · Seat selection
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Chọn vị trí ngồi của bạn</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sơ đồ ghế tự động cập nhật theo thời gian thực.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* Seat map */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-surface p-4 shadow-card sm:p-7">
              <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="flex items-center gap-2 text-base font-bold sm:text-lg">
                  Sơ đồ xe
                  <VehicleTypePill type={resolvedVehicleType} />
                </h3>
                <SeatLegend vehicleType={resolvedVehicleType} />
              </div>
              <SeatCabin
                trip={trip}
                layout={layout}
                seats={seats}
                selectedLabels={selectedLabels}
                maxReached={maxReached}
                isWindowSeat={isWindowSeat}
                onToggle={handleToggle}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-20 lg:gap-4">
            <UnifiedTripSidebarCard operator={operator} trip={trip} />
            <SelectionSummary
              selectedSeats={selectedSeats}
              seats={seats}
              total={getTotal()}
              onRemove={removeSeat}
              onContinue={() => router.push("/checkout")}
              vehicleType={resolvedVehicleType}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
