"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, redirect } from "next/navigation";
import { SeatMap } from "@/components/seats/SeatMap";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getTripDetail } from "@/lib/services/searchService";
import type { Trip } from "@/types";

export default function SeatSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const tripId = params.tripId as string;
  const [trip, setTrip] = useState<Trip | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    if (tripId) {
      getTripDetail(tripId).then((t) => {
        if (mounted) setTrip(t ?? null);
      });
    }
    return () => { mounted = false; };
  }, [tripId]);

  if (authLoading || !tripId || trip === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Guest users can browse seats freely; login is enforced at checkout.

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
