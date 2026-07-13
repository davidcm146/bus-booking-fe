import type { SeatLayout } from "@/types";

export const seatLayouts: SeatLayout[] = [
  {
    id: "standard-2-2",
    type: "standard",
    rows: 10,
    cols: [1, 2, 3, 4],
    aisleAfter: 2,
    totalSeats: 40,
  },
  {
    id: "premium-2-2",
    type: "premium",
    rows: 8,
    cols: [1, 2, 3, 4],
    aisleAfter: 2,
    totalSeats: 32,
  },
  {
    id: "double-decker-2-2",
    type: "double-decker",
    rows: 8,
    cols: [1, 2, 3, 4],
    aisleAfter: 2,
    deck: "lower",
    totalSeats: 64,
  },
];
