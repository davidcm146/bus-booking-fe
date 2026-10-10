"use client";

import { useState } from "react";
import { Disc, LogIn, Layers, BedSingle, Armchair, Crown } from "lucide-react";
import { SeatRow } from "./SeatRow";
import { Button } from "@/components/ui/button";
import { VEHICLE_TYPE_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SeatData } from "@/types/booking";
import type { SeatLayout, Trip, VehicleType } from "@/types";

interface SeatCabinProps {
  readonly trip: Trip;
  readonly layout: SeatLayout;
  readonly seats: SeatData[];
  readonly selectedLabels: ReadonlySet<string>;
  readonly maxReached: boolean;
  readonly isWindowSeat: (seat: SeatData) => boolean;
  readonly onToggle: (seat: SeatData) => void;
}

export function SeatCabin({
  trip,
  layout,
  seats,
  selectedLabels,
  maxReached,
  isWindowSeat,
  onToggle,
}: SeatCabinProps) {
  const hasDecks = seats.some((s) => s.deck);
  const [activeDeck, setActiveDeck] = useState<"lower" | "upper">("lower");
  const [viewBothDecks, setViewBothDecks] = useState(false);

  const vehicleType: VehicleType =
    trip.vehicleType ??
    (trip.busType === "double-decker" ? "sleeper" : trip.busType === "premium" ? "limousine" : "seat");
  const meta = VEHICLE_TYPE_META[vehicleType];

  const lowerSeats = seats.filter((s) => s.deck === "lower");
  const upperSeats = seats.filter((s) => s.deck === "upper");
  const lowerAvailable = lowerSeats.filter((s) => s.status === "available").length;
  const upperAvailable = upperSeats.filter((s) => s.status === "available").length;

  function renderRows(deck?: "lower" | "upper") {
    const elements: React.ReactNode[] = [];
    // Ensure all rows up to layout.rows or max row in data are rendered
    const maxRowNumber = Math.max(
      layout.rows,
      ...seats.map((s) => s.row)
    );

    for (let row = 1; row <= maxRowNumber; row++) {
      const rowSeats = seats
        .filter((s) => s.row === row && (deck ? s.deck === deck : !s.deck))
        .sort((a, b) => a.col - b.col);
      if (rowSeats.length === 0) continue;

      elements.push(
        <SeatRow
          key={`${deck ?? "single"}-${row}`}
          rowNumber={row}
          rowSeats={rowSeats}
          selectedLabels={selectedLabels}
          maxReached={maxReached}
          isWindowSeat={isWindowSeat}
          onToggle={onToggle}
          basePrice={trip.price}
          deck={deck}
          vehicleType={vehicleType}
        />
      );
    }
    return elements;
  }

  function renderDeckCabin(deck?: "lower" | "upper", title?: string) {
    return (
      <div className="relative rounded-[22px] border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        {/* Front of bus windshield */}
        <div className="relative -mx-4 -mt-4 mb-4 overflow-hidden rounded-t-[20px] border-b border-border/60 bg-muted/60 px-4 py-3 sm:-mx-5 sm:-mt-5">
          <div className="flex items-center justify-between">
            {/* Driver section */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background shadow-xs">
                <Disc className="h-4 w-4 text-foreground/70" />
              </span>
              <span>Tài xế (Driver)</span>
            </div>

            {/* Deck title badge */}
            {title && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-bold text-foreground shadow-xs">
                {title}
              </span>
            )}

            {/* Entrance door */}
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
              <span>Cửa lên</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background shadow-xs">
                <LogIn className="h-3.5 w-3.5 text-primary" />
              </span>
            </div>
          </div>

          {/* Windshield dash decorative line */}
          <div className="mt-2.5 h-1 w-full rounded-full bg-border/50" />
        </div>

        {/* Column layout guide header */}
        <div className="mb-3 grid grid-cols-[24px_repeat(5,1fr)] items-center gap-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75">
          <span />
          <span>{vehicleType === "limousine" ? "VIP Trái" : "Cửa sổ"}</span>
          <span>{vehicleType === "sleeper" ? "Lối đi" : vehicleType === "seat" ? "Ghế trong" : "Lối đi"}</span>
          <span>{vehicleType === "sleeper" ? "Dãy giữa" : vehicleType === "limousine" ? "Lối đi VIP" : "Lối đi"}</span>
          <span>{vehicleType === "sleeper" ? "Lối đi" : vehicleType === "seat" ? "Ghế trong" : "Lối đi"}</span>
          <span>{vehicleType === "limousine" ? "VIP Phải" : "Cửa sổ"}</span>
        </div>

        {/* Rows container */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {renderRows(deck)}
        </div>

        {/* Rear of bus */}
        <div className="mt-5 flex items-center justify-center border-t border-dashed border-border/70 pt-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <span>Cuối xe · Rear of bus</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Vehicle Type Banner */}
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl border p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4",
          meta.badgeBg,
          meta.badgeBorder
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
            style={{ backgroundColor: meta.color }}
          >
            {vehicleType === "limousine" ? (
              <Crown className="h-5 w-5" />
            ) : vehicleType === "sleeper" ? (
              <BedSingle className="h-5 w-5" />
            ) : (
              <Armchair className="h-5 w-5" />
            )}
          </span>
          <div>
            <h4 className={cn("text-sm font-bold sm:text-base", meta.badgeText)}>
              {meta.labelVi} ({meta.label})
            </h4>
            <p className="text-xs text-muted-foreground">{meta.description}</p>
          </div>
        </div>

        {hasDecks && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setViewBothDecks(!viewBothDecks)}
              className="hidden h-7 gap-1.5 text-xs font-semibold sm:inline-flex"
            >
              <Layers className="h-3 w-3" />
              {viewBothDecks ? "Xem từng tầng" : "Xem cả 2 tầng"}
            </Button>
          </div>
        )}
      </div>

      {/* Double-decker tab switcher (when not viewing both side-by-side) */}
      {hasDecks && !viewBothDecks && (
        <div className="flex rounded-xl bg-muted/80 p-1">
          <button
            type="button"
            onClick={() => setActiveDeck("lower")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-transform duration-150 ease-out active:scale-[0.97]",
              activeDeck === "lower"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>Tầng 1 (Dưới)</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                activeDeck === "lower"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {lowerAvailable} chỗ trống
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDeck("upper")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-transform duration-150 ease-out active:scale-[0.97]",
              activeDeck === "upper"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>Tầng 2 (Trên)</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
                activeDeck === "upper"
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {upperAvailable} chỗ trống
            </span>
          </button>
        </div>
      )}

      {/* Cabin Layout Rendering */}
      {hasDecks ? (
        viewBothDecks ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div>{renderDeckCabin("lower", `Tầng 1 (Dưới) · ${lowerAvailable} chỗ`)}</div>
            <div>{renderDeckCabin("upper", `Tầng 2 (Trên) · ${upperAvailable} chỗ`)}</div>
          </div>
        ) : (
          <div>
            {activeDeck === "lower"
              ? renderDeckCabin("lower", `Tầng 1 (Dưới) · ${lowerAvailable} chỗ trống`)
              : renderDeckCabin("upper", `Tầng 2 (Trên) · ${upperAvailable} chỗ trống`)}
          </div>
        )
      ) : (
        renderDeckCabin(undefined, `${meta.labelVi} · ${seats.filter((s) => s.status === "available").length} chỗ trống`)
      )}
    </div>
  );
}
