import { operatorDashboardFixture } from "@/lib/fixtures/operator-dashboard";
import type { OperatorCheckInResult, OperatorDashboardData } from "@/types/operator";

export function getOperatorDashboard(): OperatorDashboardData {
  return operatorDashboardFixture;
}

export async function checkInOperatorBooking(bookingId: string): Promise<OperatorCheckInResult> {
  const booking = operatorDashboardFixture.bookings.find((candidate) => candidate.id === bookingId);
  if (!booking) return { kind: "not_found", message: "Booking not found. Check the code and try again." };
  if (booking.paymentStatus !== "paid" || booking.status !== "confirmed") {
    return { kind: "not_eligible", message: "Only confirmed, paid bookings can be checked in." };
  }
  return { kind: "success", bookingId };
}
