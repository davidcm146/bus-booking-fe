"use client";

import { Armchair, BedSingle, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SeatData } from "@/types/booking";
import type { VehicleType } from "@/types";
import { formatVND, getSeatPrice } from "@/lib/format";

interface SeatProps {
  readonly seat: SeatData;
  readonly selected: boolean;
  readonly onToggle: (seat: SeatData) => void;
  readonly isWindow?: boolean;
  readonly disabled?: boolean;
  readonly basePrice: number;
  readonly vehicleType?: VehicleType;
}

type SeatState = "occupied" | "blocked" | "selected" | "premium" | "standard";

export function Seat({
  seat,
  selected,
  onToggle,
  isWindow,
  disabled,
  basePrice,
  vehicleType = "seat",
}: SeatProps) {
  const isOccupied = seat.status === "occupied";
  const isPremium = seat.isPremium;

  const seatState: SeatState = isOccupied
    ? "occupied"
    : disabled
      ? "blocked"
      : selected
        ? "selected"
        : isPremium
          ? "premium"
          : "standard";

  const isDisabled = seatState === "occupied" || seatState === "blocked";
  const price = getSeatPrice(basePrice, isPremium);

  // Distinct color palettes per vehicle type (limousine = amber, sleeper = violet, seat = emerald)
  const isLimousine = vehicleType === "limousine";
  const isSleeper = vehicleType === "sleeper";

  function getSeatStyle(): string {
    if (seatState === "occupied") {
      return "cursor-not-allowed border-dashed border-border-strong bg-muted/70 text-muted-foreground/50";
    }
    if (seatState === "blocked") {
      return "cursor-not-allowed border-border bg-muted/40 text-muted-foreground/30 opacity-50";
    }
    if (seatState === "selected") {
      if (isLimousine) {
        return "border-amber-600 bg-amber-600 text-white shadow-md shadow-amber-500/35 ring-2 ring-amber-400/50 hover:bg-amber-700";
      }
      if (isSleeper) {
        return "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-500/35 ring-2 ring-violet-400/50 hover:bg-violet-700";
      }
      return "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-500/35 ring-2 ring-emerald-400/50 hover:bg-emerald-700";
    }
    if (seatState === "premium") {
      if (isLimousine) {
        return "border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-200 ring-1 ring-amber-500/50 hover:bg-amber-500/25";
      }
      if (isSleeper) {
        return "border-violet-500 bg-violet-500/15 text-violet-800 dark:text-violet-200 ring-1 ring-violet-500/50 hover:bg-violet-500/25";
      }
      return "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-500/50 hover:bg-emerald-500/25";
    }
    // standard state
    if (isLimousine) {
      return "border-amber-500/40 bg-surface text-amber-800 dark:text-amber-200 shadow-sm hover:border-amber-500 hover:bg-amber-500/10";
    }
    if (isSleeper) {
      return "border-violet-500/40 bg-surface text-violet-800 dark:text-violet-200 shadow-sm hover:border-violet-500 hover:bg-violet-500/10";
    }
    return "border-emerald-500/40 bg-surface text-emerald-800 dark:text-emerald-200 shadow-sm hover:border-emerald-500 hover:bg-emerald-500/10";
  }

  function getWindowBadgeColor(): string {
    if (seatState === "selected") return "border-white/60 text-white";
    if (isLimousine) return "border-amber-500/40 text-amber-600/70";
    if (isSleeper) return "border-violet-500/40 text-violet-600/70";
    return "border-emerald-500/40 text-emerald-600/70";
  }

  const button = (
    <Button
      type="button"
      variant="ghost"
      onClick={() => !isDisabled && onToggle(seat)}
      disabled={isDisabled}
      aria-label={`Seat ${seat.label} — ${seat.status}${isWindow ? " (window)" : ""}${isPremium ? " (premium)" : ""}`}
      data-status={seat.status}
      data-seat-label={seat.label}
      data-testid="seat-button"
      className={cn(
        "seat seat-pop relative flex h-12 flex-col items-center justify-center rounded-t-[10px] rounded-b-[8px] border-[1.5px] px-0.5 pb-0.5 pt-1 transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-[0.96] sm:h-16 sm:rounded-t-[14px] sm:rounded-b-[10px]",
        getSeatStyle(),
      )}
    >
      {isWindow && (
        <span
          className={cn(
            "absolute right-1.5 top-1 h-1.5 w-2.5 rounded-sm border",
            getWindowBadgeColor(),
          )}
          aria-hidden="true"
        />
      )}

      {isSleeper ? (
        <BedSingle
          className={cn(
            "mb-0.5 h-[16px] w-[20px] sm:h-[20px] sm:w-[26px]",
            isOccupied && "opacity-35",
            selected && "text-white",
          )}
        />
      ) : isLimousine && isPremium ? (
        <Crown
          className={cn(
            "mb-0.5 h-[16px] w-[18px] sm:h-[20px] sm:w-[24px]",
            isOccupied && "opacity-35",
            selected && "text-white",
          )}
        />
      ) : (
        <Armchair
          className={cn(
            "mb-0.5 h-[16px] w-[20px] sm:h-[20px] sm:w-[26px]",
            isOccupied && "opacity-35",
            selected && "text-white",
          )}
        />
      )}

      <span
        className={cn(
          "text-[10px] font-bold leading-none sm:text-[11px]",
          isOccupied && "opacity-50",
          selected && "text-white font-extrabold",
        )}
      >
        {seat.label}
      </span>
    </Button>
  );

  const vehicleTypeName = isLimousine ? "Limousine VIP" : isSleeper ? "Giường nằm" : "Ghế ngồi";

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="max-w-xs text-xs">
        {isOccupied ? (
          <span>
            {vehicleTypeName} <strong>{seat.label}</strong> — Đã có người đặt
          </span>
        ) : (
          <span>
            <strong className="text-foreground">{seat.label}</strong>
            {" · "}
            {seat.deck ? (seat.deck === "lower" ? "Tầng dưới" : "Tầng trên") : "Tầng 1"}
            {" · "}
            {isWindow ? "Cửa sổ" : "Lối đi"}
            {isPremium ? " · VIP" : ""} ·{" "}
            <span className="font-bold text-accent">{formatVND(price)}</span>
          </span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
