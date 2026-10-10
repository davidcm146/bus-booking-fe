import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResultsPageShell } from "@/components/results/ResultsPageShell";
import { getOperators, searchTrips } from "@/lib/services/searchService";
import type { TripSearchQuery, TripType } from "@/types";

export const metadata: Metadata = {
  title: "Bus search results",
  description:
    "Compare bus trips across Vietnam — filter by operator, departure time, price, and amenities. Book sleeper coaches from Hà Nội to Sài Gòn.",
  alternates: {
    canonical: "/results",
  },
};

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const origin = typeof params.origin === "string" ? params.origin : "";
  const destination = typeof params.destination === "string" ? params.destination : "";
  const date = typeof params.date === "string" ? params.date : "";

  if (!origin || !destination || !date) {
    redirect("/");
  }

  const query: TripSearchQuery = {
    originId: origin,
    destinationId: destination,
    departureDate: date,
    tripType: (params.tripType === "round-trip" ? "round-trip" : "one-way") as TripType,
    returnDate: typeof params.returnDate === "string" ? params.returnDate : undefined,
  };

  const [initialTrips, initialOperators] = await Promise.all([
    searchTrips(query),
    getOperators(),
  ]);

  return (
    <ResultsPageShell
      query={query}
      initialTrips={initialTrips}
      initialOperators={initialOperators}
    />
  );
}
