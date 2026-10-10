import { Seat } from "./Seat";
import type { SeatData } from "@/types/booking";
import { SEAT_GRID_WIDTH } from "@/lib/services/seatService";

import type { VehicleType } from "@/types";

interface SeatRowProps {
  readonly rowNumber: number;
  readonly rowSeats: SeatData[];
  readonly selectedLabels: ReadonlySet<string>;
  readonly maxReached: boolean;
  readonly isWindowSeat: (seat: SeatData) => boolean;
  readonly onToggle: (seat: SeatData) => void;
  readonly basePrice: number;
  readonly deck?: "lower" | "upper";
  readonly vehicleType?: VehicleType;
}

export function SeatRow({
  rowNumber,
  rowSeats,
  selectedLabels,
  maxReached,
  isWindowSeat,
  onToggle,
  basePrice,
  deck,
  vehicleType,
}: SeatRowProps) {
  const byCol = new Map(rowSeats.map((s) => [s.col, s]));

  const renderSeat = (seat: SeatData) => (
    <Seat
      key={seat.label}
      seat={seat}
      selected={selectedLabels.has(seat.label)}
      onToggle={onToggle}
      isWindow={isWindowSeat(seat)}
      disabled={maxReached && !selectedLabels.has(seat.label)}
      basePrice={basePrice}
      vehicleType={vehicleType}
    />
  );

  return (
    <div
      key={`${deck ?? ""}-${rowNumber}`}
      className="grid items-center gap-2.5"
      style={{ gridTemplateColumns: `24px repeat(${SEAT_GRID_WIDTH}, 1fr)` }}
    >
      <span className="text-center font-mono text-[11px] font-semibold text-text-subtle">{rowNumber}</span>
      {Array.from({ length: SEAT_GRID_WIDTH }, (_, i) => {
        const seat = byCol.get(i + 1);
        return seat ? renderSeat(seat) : <span key={`gap-${i}`} />;
      })}
    </div>
  );
}
