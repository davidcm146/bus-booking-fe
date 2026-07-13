"use client";

import { Armchair } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SeatData } from "@/types/booking";
import { formatVND, getSeatPrice } from "@/lib/format";

interface SeatProps {
  readonly seat: SeatData;
  readonly selected: boolean;
  readonly onToggle: (seat: SeatData) => void;
  readonly isWindow?: boolean;
  readonly disabled?: boolean;
  readonly basePrice: number;
}

type SeatState = "occupied" | "blocked" | "selected" | "premium" | "standard";

const SEAT_STYLES: Record<SeatState, string> = {
  occupied: "cursor-not-allowed border-dashed border-border-strong bg-muted text-muted-foreground",
  blocked: "cursor-not-allowed border-border bg-muted/50 text-muted-foreground/50 opacity-50",
  selected: "border-primary bg-primary text-primary-foreground shadow-card-hover hover:bg-primary-dark hover:text-primary-foreground dark:hover:bg-primary-dark dark:hover:text-primary-foreground",
  premium: "border-accent bg-surface text-accent shadow-[0_2px_5px_rgba(0,0,0,0.06)] hover:border-accent hover:bg-accent/15 dark:hover:border-accent dark:hover:bg-accent/25",
  standard: "border-primary bg-surface text-primary shadow-[0_2px_5px_rgba(0,0,0,0.06)] hover:border-primary hover:bg-primary/15 dark:hover:border-primary-dark dark:hover:bg-primary/25",
};

const WINDOW_STYLES: Record<SeatState, string> = {
  occupied: "text-muted-foreground/40",
  blocked: "text-muted-foreground/30",
  selected: "text-primary-foreground/80",
  premium: "text-accent/60",
  standard: "text-primary/60",
};

const ICON_FILL: Record<SeatState, string> = {
  occupied: "color-mix(in oklch, var(--color-foreground) 4%, transparent)",
  blocked: "color-mix(in oklch, var(--color-foreground) 4%, transparent)",
  selected: "color-mix(in oklch, var(--color-primary-foreground) 20%, transparent)",
  premium: "color-mix(in oklch, var(--color-accent) 8%, transparent)",
  standard: "color-mix(in oklch, var(--color-primary) 8%, transparent)",
};

const ICON_STROKE: Record<SeatState, string> = {
  occupied: "var(--color-border-strong)",
  blocked: "var(--color-border)",
  selected: "var(--color-primary-foreground)",
  premium: "var(--color-accent)",
  standard: "var(--color-primary)",
};

export function Seat({
  seat,
  selected,
  onToggle,
  isWindow,
  disabled,
  basePrice,
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

  const button = (
    <Button
      type="button"
      variant="ghost"
      onClick={() => !isDisabled && onToggle(seat)}
      disabled={isDisabled}
      aria-label={`Seat ${seat.label} — ${seat.status}${isWindow ? " (window)" : ""}${isPremium ? " (premium)" : ""}`}
      className={cn(
        "seat seat-pop relative flex h-12 flex-col items-center justify-center rounded-t-[10px] rounded-b-[8px] border-[1.5px] px-0.5 pb-0.5 pt-1 transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-[0.96] sm:h-16 sm:rounded-t-[14px] sm:rounded-b-[10px]",
        SEAT_STYLES[seatState],
      )}
    >
      {isWindow && (
        <span
          className={cn(
            "absolute right-1.5 top-1 h-1.5 w-2.5 rounded-sm border",
            WINDOW_STYLES[seatState],
          )}
          aria-hidden="true"
        />
      )}

      <Armchair
        className={cn(
          "mb-0.5 h-[16px] w-[22px] sm:h-[22px] sm:w-[28px]",
          isOccupied && "opacity-30",
        )}
        style={{ fill: ICON_FILL[seatState], stroke: ICON_STROKE[seatState] }}
      />

      <span
        className={cn(
          "text-[10px] font-bold leading-none sm:text-[11px]",
          isOccupied && "opacity-50",
        )}
      >
        {seat.label}
      </span>
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={6} className="max-w-xs">
        {isOccupied ? (
          <span>
            Seat <strong>{seat.label}</strong> — Occupied
          </span>
        ) : (
          <span>
            <strong className="text-primary-light">Seat {seat.label}</strong>
            {" — "}
            {isWindow ? "Window" : "Aisle"},{" "}
            {isPremium ? "Premium · Extra legroom" : "Standard"} ·{" "}
            <span className="font-bold text-accent">{formatVND(price)}</span>
          </span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
