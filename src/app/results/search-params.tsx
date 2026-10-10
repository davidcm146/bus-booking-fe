"use client";

import { useSearchParams, redirect } from "next/navigation";
import { ResultsPageShell } from "@/components/results/ResultsPageShell";
import type { TripSearchQuery, TripType } from "@/types";

export function SearchParams() {
  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");

  if (!origin || !destination || !date) redirect("/");

  const query: TripSearchQuery = {
    originId: origin,
    destinationId: destination,
    departureDate: date,
    tripType: (searchParams.get("tripType") === "round-trip" ? "round-trip" : "one-way") as TripType,
    returnDate: searchParams.get("returnDate") || undefined,
  };

  return <ResultsPageShell query={query} />;
}
