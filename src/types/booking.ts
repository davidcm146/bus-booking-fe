import type { Trip } from "@/types";

export type SeatStatus = "available" | "occupied";

export interface SeatPosition {
  row: number;
  col: number;
  label: string;
}

export interface SeatData extends SeatPosition {
  status: SeatStatus;
  deck?: "lower" | "upper";
  isPremium?: boolean;
}

export interface SelectedSeat {
  label: string;
  row: number;
  col: number;
  price: number;
  deck?: "lower" | "upper";
}

export interface Passenger {
  seatLabel: string;
  name: string;
  email?: string;
}

export interface Booking {
  id: string;
  bookingRef: string;
  tripId: string;
  trip: Trip;
  seats: SelectedSeat[];
  passengers: Passenger[];
  totalPaid: number;
  status: "confirmed";
  createdAt: string;
}
