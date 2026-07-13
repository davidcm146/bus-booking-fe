"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BoardingPass } from "@/components/confirmation/BoardingPass";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { getBookingById } from "@/lib/services/bookingService";

export default function ConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { clearAll } = useBooking();
  const bookingIdParam = params.bookingId;
  const bookingId = Array.isArray(bookingIdParam) ? bookingIdParam[0] : bookingIdParam;

  const booking = (!loading && user && bookingId) ? (getBookingById(bookingId) ?? null) : null;

  useEffect(() => {
    if (!booking) return;
    const timer = window.setTimeout(clearAll, 0);
    return () => window.clearTimeout(timer);
  }, [booking, clearAll]);

  if (loading || !bookingId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.replace(`/login?redirect=/confirmation/${bookingId}`);
    return null;
  }

  if (!booking) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold">Booking not found</p>
        <Button asChild>
          <Link href="/">Back to search</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-8 text-center animate-scale-in">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <p className="mt-4 text-sm font-bold text-primary">Payment confirmed</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Your seat is booked</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Keep this boarding pass ready when you meet your coach.</p>
      </div>
      <BoardingPass booking={booking} />
    </div>
  );
}
