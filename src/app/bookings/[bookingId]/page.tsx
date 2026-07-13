"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoardingPass } from "@/components/confirmation/BoardingPass";
import { useAuth } from "@/hooks/useAuth";
import { getBookingById } from "@/lib/services/bookingService";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const bookingIdParam = params.bookingId;
  const bookingId = Array.isArray(bookingIdParam) ? bookingIdParam[0] : bookingIdParam;

  if (loading || !bookingId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.replace(`/login?redirect=/bookings/${bookingId}`);
    return null;
  }

  const booking = getBookingById(bookingId) ?? null;

  if (!booking) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold">Booking not found</p>
        <Button asChild>
          <Link href="/bookings">Back to bookings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div>
        <Button variant="ghost" size="icon" asChild aria-label="Back to bookings">
          <Link href="/bookings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div>
        <p className="text-sm font-bold text-primary">Saved ticket</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">Booking details</h1>
      </div>
      <BoardingPass booking={booking} />
    </div>
  );
}
