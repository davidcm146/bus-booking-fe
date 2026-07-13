import type { Trip, TripSearchQuery, TripSearchResult, City, Operator } from "@/types";
import { cities } from "@/lib/fixtures/cities";
import { operators } from "@/lib/fixtures/operators";
import { trips, getTripsByRoute } from "@/lib/fixtures/trips";
import { delay } from "@/lib/delay";

export async function searchTrips(query: TripSearchQuery): Promise<TripSearchResult> {
  await delay(200);

  const outbound = getTripsByRoute(query.originId, query.destinationId, query.departureDate);

  let returnTrips: Trip[] | undefined;
  if (query.tripType === "round-trip" && query.returnDate) {
    returnTrips = getTripsByRoute(query.destinationId, query.originId, query.returnDate);
  }

  return { outbound, return: returnTrips };
}

export async function getCities(): Promise<City[]> {
  await delay(100);
  return cities;
}

export async function getOperators(): Promise<Operator[]> {
  await delay(100);
  return operators;
}

export function getOperator(id: string): Operator | undefined {
  return operators.find((op) => op.id === id);
}

export function getTripById(id: string): Trip | undefined {
  return trips.find((t) => t.id === id);
}
