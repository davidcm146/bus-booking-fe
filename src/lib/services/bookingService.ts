import type { Trip } from "@/types";
import type { Booking, SelectedSeat, Passenger } from "@/types/booking";
import { delay } from "@/lib/delay";

const BOOKINGS_KEY = "bus-booking:bookings";

function generateBookingRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "";
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BB-${ref}`;
}

function getBookingsArray(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings: Booking[]) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export async function createBooking(
  trip: Trip,
  seats: SelectedSeat[],
  passengers: Passenger[]
): Promise<Booking> {
  await delay(1500);

  const totalPaid = seats.reduce((sum, s) => sum + s.price, 0);
  const booking: Booking = {
    id: `booking-${Date.now()}`,
    bookingRef: generateBookingRef(),
    tripId: trip.id,
    trip,
    seats,
    passengers,
    totalPaid,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  const bookings = getBookingsArray();
  bookings.push(booking);
  saveBookings(bookings);

  return booking;
}

export function getBookings(): Booking[] {
  return getBookingsArray();
}

export function getBookingById(id: string): Booking | undefined {
  return getBookingsArray().find((b) => b.id === id);
}
