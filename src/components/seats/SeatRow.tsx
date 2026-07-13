import { Seat } from "./Seat";
import type { SeatData } from "@/types/booking";
import type { SeatLayout } from "@/types";

interface SeatRowProps {
  readonly rowNumber: number;
  readonly rowSeats: SeatData[];
  readonly layout: SeatLayout;
  readonly selectedLabels: ReadonlySet<string>;
  readonly maxReached: boolean;
  readonly isWindowSeat: (seat: SeatData) => boolean;
  readonly onToggle: (seat: SeatData) => void;
  readonly basePrice: number;
  readonly deck?: "lower" | "upper";
}

export function SeatRow({
  rowNumber,
  rowSeats,
  layout,
  selectedLabels,
  maxReached,
  isWindowSeat,
  onToggle,
  basePrice,
  deck,
}: SeatRowProps) {
  const leftSeats = rowSeats.slice(0, layout.aisleAfter);
  const rightSeats = rowSeats.slice(layout.aisleAfter);
  const leftCols = leftSeats.map(() => "1fr").join(" ");
  const rightCols = rightSeats.map(() => "1fr").join(" ");
  const gridTemplate = `24px ${leftCols} 36px ${rightCols}`;

  const renderSeat = (seat: SeatData) => (
    <Seat
      key={seat.label}
      seat={seat}
      selected={selectedLabels.has(seat.label)}
      onToggle={onToggle}
      isWindow={isWindowSeat(seat)}
      disabled={maxReached && !selectedLabels.has(seat.label)}
      basePrice={basePrice}
    />
  );

  return (
    <div
      key={`${deck ?? ""}-${rowNumber}`}
      className="grid items-center gap-2.5"
      style={{ gridTemplateColumns: gridTemplate }}
    >
      <span className="text-center font-mono text-[11px] font-semibold text-text-subtle">{rowNumber}</span>
      {leftSeats.map(renderSeat)}
      <span className="text-center text-[9px] text-text-subtle">·</span>
      {rightSeats.map(renderSeat)}
    </div>
  );
}
