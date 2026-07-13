import type { Trip, SeatLayout } from "@/types";
import type { SeatData } from "@/types/booking";
import { seatLayouts } from "@/lib/fixtures/seat-layouts";
import { buses } from "@/lib/fixtures/buses";
import { delay } from "@/lib/delay";

// Deterministic pseudo-random based on string seed
function seededRandom(seed: string): () => number {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = (s * 31 + seed.charCodeAt(i)) % 233280;
  }
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function getLayoutForTrip(trip: Trip): SeatLayout {
  const bus = buses.find((b) => b.id === trip.busId);
  const layoutId = bus?.layoutId ?? "standard-2-2";
  return seatLayouts.find((l) => l.id === layoutId) ?? seatLayouts[0];
}

function generateSeats(trip: Trip, layout: SeatLayout): SeatData[] {
  const rand = seededRandom(trip.id);
  const seats: SeatData[] = [];
  const colLetters = ["A", "B", "C", "D", "E", "F"];

  // Premium rows = first 2 rows (only on standard/premium buses, not double-decker)
  const isPremiumBus = trip.busType === "premium" || trip.busType === "standard";

  if (trip.busType === "double-decker" && layout.deck) {
    // Double-decker: two decks
    for (const deck of ["lower", "upper"] as const) {
      for (let row = 1; row <= layout.rows; row++) {
        for (let colIdx = 0; colIdx < layout.cols.length; colIdx++) {
          const col = layout.cols[colIdx];
          const label = `${deck === "lower" ? "L" : "U"}${row}${colLetters[colIdx]}`;
          const isOccupied = rand() < 0.3;
          seats.push({
            row,
            col,
            label,
            status: isOccupied ? "occupied" : "available",
            deck,
            isPremium: false,
          });
        }
      }
    }
  } else {
    for (let row = 1; row <= layout.rows; row++) {
      for (let colIdx = 0; colIdx < layout.cols.length; colIdx++) {
        const col = layout.cols[colIdx];
        const label = `${row}${colLetters[colIdx]}`;
        const isOccupied = rand() < 0.3;
        seats.push({
          row,
          col,
          label,
          status: isOccupied ? "occupied" : "available",
          isPremium: isPremiumBus && row <= 2,
        });
      }
    }
  }

  return seats;
}

export async function getSeatAvailability(
  trip: Trip
): Promise<{ layout: SeatLayout; seats: SeatData[] }> {
  await delay(200);

  const layout = getLayoutForTrip(trip);
  const seats = generateSeats(trip, layout);

  return { layout, seats };
}
