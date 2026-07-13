"use client";

import { useParams, useRouter } from "next/navigation";
import { SeatMap } from "@/components/seats/SeatMap";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getTripById } from "@/lib/services/searchService";

export default function SeatSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const tripId = params.tripId as string;

  if (authLoading || !tripId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.replace(`/login?redirect=/trips/${tripId}/seats`);
    return null;
  }

  const trip = getTripById(tripId) ?? null;

  if (!trip) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold">Trip not found</p>
        <Button onClick={() => router.push("/")} variant="link">
          Back to search
        </Button>
      </div>
    );
  }

  return (
    <div className="py-2 sm:py-4">
      <SeatMap trip={trip} />
    </div>
  );
}
