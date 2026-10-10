import type { Trip, SeatLayout, VehicleType } from "@/types";
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

// Geometry mirrors the backend seat_layout spec (BE 20261003233819_vehicles.sql):
// 5-wide grid, per-type {floors, seats per row, column map}; last 5 seats form the back row.
const VEHICLE_GEOMETRY: Record<VehicleType, { floors: number; perRow: number; colMap: number[] }> = {
  sleeper: { floors: 2, perRow: 3, colMap: [1, 3, 5] },
  limousine: { floors: 1, perRow: 2, colMap: [1, 5] },
  seat: { floors: 1, perRow: 4, colMap: [1, 2, 4, 5] },
};

export const SEAT_GRID_WIDTH = 5;

function generateBackendSeats(trip: Trip): { layout: SeatLayout; seats: SeatData[] } {
  const spec = VEHICLE_GEOMETRY[trip.vehicleType ?? "seat"];
  const perFloor = Math.floor(trip.totalSeats / spec.floors);
  const seats: SeatData[] = [];
  const isPremiumBus = trip.busType === "premium";
  let maxRow = 1;

  for (let floor = 1; floor <= spec.floors; floor++) {
    const deck = spec.floors > 1 ? (floor === 1 ? ("lower" as const) : ("upper" as const)) : undefined;
    const prefix = String.fromCharCode(64 + floor);
    const hasBackFive = perFloor > 5 && (perFloor - 5) % spec.perRow === 0;
    const numNormalRows = hasBackFive
      ? (perFloor - 5) / spec.perRow
      : Math.floor(perFloor / spec.perRow);
    const normalLimit = numNormalRows * spec.perRow;

    for (let g = 1; g <= perFloor; g++) {
      let row: number;
      let col: number;
      if (g <= normalLimit) {
        row = Math.floor((g - 1) / spec.perRow) + 1;
        col = spec.colMap[(g - 1) % spec.perRow];
      } else {
        row = numNormalRows + 1;
        const remainderIdx = g - normalLimit - 1;
        if (hasBackFive) {
          col = remainderIdx + 1;
        } else {
          col = spec.colMap[remainderIdx] ?? (remainderIdx + 1);
        }
      }
      maxRow = Math.max(maxRow, row);
      const rand = seededRandom(`${trip.id}-${floor}-${g}`);
      const isOccupied =
        !trip.id.startsWith("be-") && trip.availableSeats < trip.totalSeats
          ? rand() < Math.min(0.85, Math.max(0.1, 1 - trip.availableSeats / trip.totalSeats))
          : false;
      seats.push({
        row,
        col,
        label: `${prefix}${g}`,
        status: isOccupied ? "occupied" : "available",
        deck,
        isPremium: isPremiumBus && row <= 2,
      });
    }
  }

  const layout: SeatLayout = {
    id: `be-${trip.vehicleType ?? "seat"}`,
    type: trip.busType,
    rows: maxRow,
    cols: [1, 2, 3, 4, 5],
    aisleAfter: 0,
    totalSeats: seats.length,
  };
  return { layout, seats };
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
          const gridCol = colIdx + 1 + (colIdx >= layout.aisleAfter ? 1 : 0);
          const label = `${deck === "lower" ? "L" : "U"}${row}${colLetters[colIdx]}`;
          const isOccupied = rand() < 0.3;
          seats.push({
            row,
            col: gridCol,
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
        // Normalize onto the 5-wide grid, skipping the aisle column.
        const gridCol = colIdx + 1 + (colIdx >= layout.aisleAfter ? 1 : 0);
        const label = `${row}${colLetters[colIdx]}`;
        const isOccupied = rand() < 0.3;
        seats.push({
          row,
          col: gridCol,
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
  // Build the true vehicle geometry whenever vehicleType is known.
  if (trip.vehicleType) return generateBackendSeats(trip);

  const layout = getLayoutForTrip(trip);
  const seats = generateSeats(trip, layout);

  return { layout, seats };
}
