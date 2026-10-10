import { ArrowRight, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatVND, getCityName, formatDuration } from "@/lib/format";
import { AMENITY_CONFIG, VEHICLE_TYPE_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Trip, Operator, VehicleType } from "@/types";
import type { SeatData, SelectedSeat } from "@/types/booking";

const cardClass = "rounded-[20px] border border-border bg-card p-4 shadow-sm sm:p-5";

export function OperatorCard({ operator, trip }: { operator: Operator | undefined; trip: Trip }) {
  const color = operator?.logoColor ?? "#087f5b";
  const name = operator?.name ?? trip.operatorName ?? "BusGo";
  const vehicleType: VehicleType =
    trip.vehicleType ??
    (trip.busType === "double-decker" ? "sleeper" : trip.busType === "premium" ? "limousine" : "seat");
  const meta = VEHICLE_TYPE_META[vehicleType];

  return (
    <div className={cardClass}>
      <div className="flex items-center gap-3.5">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-[18px] font-extrabold text-white shadow-2xs"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
        >
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-base font-bold text-foreground">{name}</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{operator?.rating.toFixed(1) ?? "4.8"}</span>
            <span>·</span>
            <span className="font-semibold" style={{ color: meta.color }}>
              {meta.labelVi}
            </span>
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
          <div className="text-lg font-extrabold text-foreground">{getCityName(trip.originId)}</div>
          <div className="text-xs font-semibold text-muted-foreground">{trip.departureTime}</div>
        </div>
        <div className="text-lg font-bold text-primary">→</div>
        <div className="text-center">
          <div className="text-lg font-extrabold text-foreground">{getCityName(trip.destinationId)}</div>
          <div className="text-xs font-semibold text-muted-foreground">{trip.arrivalTime}</div>
        </div>
      </div>
      <div className="mt-2 text-center text-[11px] font-medium text-muted-foreground">
        {trip.date} · {formatDuration(trip.durationMinutes)} · {intermediateStops > 0 ? `${intermediateStops} điểm dừng` : "Chạy thẳng"}
      </div>
    </div>
  );
}

export function AmenitiesCard({ trip }: { trip: Trip }) {
  return (
    <div className={cardClass}>
      <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Tiện ích chuyến xe</div>
      <div className="flex flex-col gap-2">
        {trip.amenities.map((amenity) => {
          const config = AMENITY_CONFIG[amenity];
          if (!config) return null;
          const { icon: Icon, long } = config;
          return (
            <div key={amenity} className="flex items-center gap-2.5 text-xs font-medium">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-foreground">{long}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function UnifiedTripSidebarCard({ operator, trip }: { operator: Operator | undefined; trip: Trip }) {
  const color = operator?.logoColor ?? "#087f5b";
  const name = operator?.name ?? trip.operatorName ?? "BusGo";
  const vehicleType: VehicleType =
    trip.vehicleType ??
    (trip.busType === "double-decker" ? "sleeper" : trip.busType === "premium" ? "limousine" : "seat");
  const meta = VEHICLE_TYPE_META[vehicleType];
  const intermediateStops = trip.stops.length - 2;

  return (
    <div className={cardClass}>
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-extrabold text-white shadow-2xs"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}
        >
          {name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-foreground">{name}</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{operator?.rating.toFixed(1) ?? "4.8"}</span>
            <span>·</span>
            <span className="font-semibold" style={{ color: meta.color }}>
              {meta.labelVi}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3.5 border-t border-border/70 pt-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="text-left">
            <div className="text-base font-extrabold text-foreground">{getCityName(trip.originId)}</div>
            <div className="text-xs font-semibold text-muted-foreground">{trip.departureTime}</div>
          </div>
          <div className="text-sm font-bold text-primary">→</div>
          <div className="text-right">
            <div className="text-base font-extrabold text-foreground">{getCityName(trip.destinationId)}</div>
            <div className="text-xs font-semibold text-muted-foreground">{trip.arrivalTime}</div>
          </div>
        </div>
        <div className="mt-2 text-center text-[11px] font-medium text-muted-foreground">
          {trip.date} · {formatDuration(trip.durationMinutes)} · {intermediateStops > 0 ? `${intermediateStops} điểm dừng` : "Chạy thẳng"}
        </div>
      </div>

      {trip.amenities.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border/70 pt-2.5">
          {trip.amenities.map((amenity) => {
            const config = AMENITY_CONFIG[amenity];
            if (!config) return null;
            const { icon: Icon, short } = config;
            return (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                <Icon className="h-3 w-3 text-primary" />
                {short}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface SelectionSummaryProps {
  readonly selectedSeats: SelectedSeat[];
  readonly seats: SeatData[];
  readonly total: number;
  readonly onRemove: (label: string) => void;
  readonly onContinue: () => void;
  readonly vehicleType?: VehicleType;
}

export function SelectionSummary({
  selectedSeats,
  seats,
  total,
  onRemove,
  onContinue,
  vehicleType = "seat",
}: SelectionSummaryProps) {
  const isLimousine = vehicleType === "limousine";
  const isSleeper = vehicleType === "sleeper";

  const btnThemedClass =
    isLimousine
      ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/25"
      : isSleeper
      ? "bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/25"
      : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/25";

  return (
    <>
      <div className={`min-h-[80px] ${cardClass}`}>
        <h4 className="mb-2.5 text-sm font-bold text-foreground">Ghế đã chọn ({selectedSeats.length})</h4>
        {selectedSeats.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">Nhấp vào ghế trống trên sơ đồ để chọn</p>
        ) : (
          <div className="space-y-1">
            {selectedSeats.map((s) => {
              const seatData = seats.find((sd) => sd.label === s.label);
              const isPremium = seatData?.isPremium;
              const deckLabel = s.deck === "lower" ? "Tầng 1 (Dưới)" : s.deck === "upper" ? "Tầng 2 (Trên)" : undefined;

              return (
                <div
                  key={s.label}
                  className="flex items-center justify-between border-b border-dashed border-border py-2 text-xs last:border-0"
                >
                  <div>
                    <span className="font-bold text-foreground">
                      Ghế {s.label}
                    </span>
                    {deckLabel && <span className="ml-1 text-[10px] text-muted-foreground">({deckLabel})</span>}
                    {isPremium && <span className="ml-1 rounded-sm bg-accent/20 px-1 py-0.2 text-[9px] font-bold text-accent">VIP</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold tabular-nums text-foreground">{formatVND(s.price)}</span>
                    <Button
                      onClick={() => onRemove(s.label)}
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground transition-transform duration-150 ease-out active:scale-[0.95] hover:text-destructive"
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
        <div className="mt-2.5 flex items-baseline justify-between border-t border-border pt-3">
          <span className="text-xs font-semibold text-muted-foreground">Tổng tiền vé:</span>
          <span className="text-2xl font-black text-foreground tabular-nums sm:text-[28px]">
            {formatVND(total)}
          </span>
        </div>
      </div>

      <Button
        disabled={selectedSeats.length === 0}
        onClick={onContinue}
        size="lg"
        className={cn(
          "w-full rounded-xl transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.97]",
          selectedSeats.length > 0
            ? btnThemedClass
            : "border border-border/60 bg-muted/80 text-muted-foreground shadow-none hover:bg-muted/80 opacity-90 cursor-not-allowed"
        )}
      >
        {selectedSeats.length > 0 ? (
          <>
            Tiếp tục đặt vé ({selectedSeats.length} ghế)
            <ArrowRight className="ml-1 h-4 w-4" />
          </>
        ) : (
          "Vui lòng chọn ghế để tiếp tục"
        )}
      </Button>
    </>
  );
}
