import { ArrowRight, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVND, getCityName, formatDuration } from "@/lib/format";
import { AMENITY_CONFIG } from "@/lib/constants";
import type { Trip, Operator } from "@/types";
import type { SeatData, SelectedSeat } from "@/types/booking";

const cardClass = "rounded-[16px] border border-border bg-surface p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] sm:rounded-[20px] sm:p-5";

function busTypeLabel(busType: Trip["busType"]): string {
  if (busType === "standard") return "Standard 2+2";
  if (busType === "premium") return "Premium 2+2";
  return "Double-decker";
}

export function OperatorCard({ operator, trip }: { operator: Operator | undefined; trip: Trip }) {
  const color = operator?.logoColor ?? "#087f5b";
  return (
    <div className={cardClass}>
      <div className="flex items-center gap-3.5">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-[10px] text-[18px] font-extrabold text-white"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
        >
          {operator?.name.charAt(0) ?? "B"}
        </div>
        <div>
          <div className="text-base font-bold">{operator?.name ?? "BusGo"}</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="font-semibold">{operator?.rating.toFixed(1) ?? "4.5"}</span>
            <span> · {busTypeLabel(trip.busType)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RouteCard({ trip }: { trip: Trip }) {
  const intermediateStops = trip.stops.length - 2;
  return (
    <div className={cardClass}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="text-center">
          <div className="text-lg font-extrabold">{getCityName(trip.originId)}</div>
          <div className="text-xs text-muted-foreground">{trip.departureTime}</div>
        </div>
        <div className="text-xl text-primary">→</div>
        <div className="text-center">
          <div className="text-lg font-extrabold">{getCityName(trip.destinationId)}</div>
          <div className="text-xs text-muted-foreground">{trip.arrivalTime}</div>
        </div>
      </div>
      <div className="mt-1.5 text-center text-[11px] text-text-subtle">
        {trip.date} · {formatDuration(trip.durationMinutes)} · {intermediateStops > 0 ? `${intermediateStops} stops` : "Direct"}
      </div>
    </div>
  );
}

export function AmenitiesCard({ trip }: { trip: Trip }) {
  return (
    <div className={cardClass}>
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">Amenities</div>
      <div className="flex flex-col gap-2">
        {trip.amenities.map((amenity) => {
          const { icon: Icon, long } = AMENITY_CONFIG[amenity];
          return (
            <div key={amenity} className="flex items-center gap-2.5 text-sm">
              <Icon className="h-[18px] w-[18px] text-primary" />
              <span className="text-muted-foreground">{long}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface SelectionSummaryProps {
  readonly selectedSeats: SelectedSeat[];
  readonly seats: SeatData[];
  readonly total: number;
  readonly onRemove: (label: string) => void;
  readonly onContinue: () => void;
}

export function SelectionSummary({ selectedSeats, seats, total, onRemove, onContinue }: SelectionSummaryProps) {
  return (
    <>
      <div className={`min-h-[80px] ${cardClass}`}>
        <h4 className="mb-2.5 text-sm font-bold">Your selection</h4>
        {selectedSeats.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-subtle">Tap a seat to select</p>
        ) : (
          <div>
            {selectedSeats.map((s) => {
              const seatData = seats.find((sd) => sd.label === s.label);
              const isPremium = seatData?.isPremium;
              return (
                <div
                  key={s.label}
                  className="flex items-center justify-between border-b border-dashed border-border py-2 text-sm last:border-0"
                >
                  <span className={isPremium ? "font-bold text-accent" : "font-bold text-primary"}>
                    {s.label}{isPremium ? " · Premium" : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums">{formatVND(s.price)}</span>
                    <Button
                      onClick={() => onRemove(s.label)}
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Remove seat ${s.label}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-2 flex items-baseline justify-between border-t-2 border-border pt-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-2xl font-extrabold text-primary tabular-nums sm:text-[30px]">
            {formatVND(total)}
          </span>
        </div>
      </div>

      <Button
        disabled={selectedSeats.length === 0}
        onClick={onContinue}
        className="w-full"
      >
        {selectedSeats.length > 0 ? (
          <>
            Continue with {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""}
            <ArrowRight className="ml-1 h-4 w-4" />
          </>
        ) : (
          "Select a seat to continue"
        )}
      </Button>
    </>
  );
}
