import { SeatRow } from "./SeatRow";
import type { SeatData } from "@/types/booking";
import type { SeatLayout, Trip } from "@/types";

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
  const isDoubleDecker = trip.busType === "double-decker";

  function renderRows(rows: number, deck?: "lower" | "upper") {
    const elements: React.ReactNode[] = [];
    for (let row = 1; row <= rows; row++) {
      const rowSeats = seats
        .filter((s) => s.row === row && (deck ? s.deck === deck : !s.deck))
        .sort((a, b) => a.col - b.col);
      if (rowSeats.length === 0) continue;

      elements.push(
        <SeatRow
          key={`${deck ?? ""}-${row}`}
          rowNumber={row}
          rowSeats={rowSeats}
          layout={layout}
          selectedLabels={selectedLabels}
          maxReached={maxReached}
          isWindowSeat={isWindowSeat}
          onToggle={onToggle}
          basePrice={trip.price}
          deck={deck}
        />
      );
    }
    return elements;
  }

  return (
    <div
      className="relative rounded-[20px] border border-border p-4 sm:p-6"
      style={{
        background: "linear-gradient(180deg, color-mix(in oklch, var(--color-muted) 60%, var(--color-surface)) 0%, var(--color-muted) 100%)",
      }}
    >
      <div
        className="-mx-4 -mt-4 mb-5 flex h-[50px] items-center justify-center rounded-xl text-[11px] font-semibold tracking-[0.1em] text-white/80 sm:-mx-6 sm:-mt-6"
        style={{ background: "linear-gradient(180deg, var(--color-primary-dark), var(--color-primary))" }}
      >
        FRONT OF BUS
      </div>

      <div className="flex flex-col gap-3">
        {isDoubleDecker ? (
          <>
            <div className="mb-1 flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Lower deck
            </div>
            {renderRows(layout.rows, "lower")}
            <div className="my-3 flex items-center gap-2">
              <div className="h-px w-20 bg-border" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">— stairs —</span>
              <div className="h-px w-20 bg-border" />
            </div>
            <div className="mb-1 flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Upper deck
            </div>
            {renderRows(layout.rows, "upper")}
          </>
        ) : (
          renderRows(layout.rows)
        )}
      </div>
    </div>
  );
}
