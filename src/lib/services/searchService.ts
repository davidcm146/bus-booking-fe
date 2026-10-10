import type { Trip, TripSearchQuery, TripSearchResult, City, Operator } from "@/types";
import { cities } from "@/lib/fixtures/cities";
import { operators } from "@/lib/fixtures/operators";
import { trips, getTripsByRoute } from "@/lib/fixtures/trips";
import { delay } from "@/lib/delay";
import { CITY_AREA_ID, fetchBeTrip, searchBeTrips } from "@/lib/api/tripApi";

// Backend trips by FE id (populates on search; lets the seats page resolve without refetch).
const beTripCache = new Map<string, Trip>();

function toAreaId(slug: string): number | undefined {
  return CITY_AREA_ID[slug];
}

async function searchLeg(originId: string, destinationId: string, departureDate: string): Promise<Trip[]> {
  try {
    const found = await searchBeTrips({
      originAreaId: toAreaId(originId),
      destinationAreaId: toAreaId(destinationId),
      departureDate,
    });
    // Empty usually means stale BE seed data (seeds cover ~14 days); fall back to demo fixtures.
    if (found.length > 0) {
      for (const t of found) beTripCache.set(t.id, t);
      return found;
    }
  } catch {
    // Backend unreachable — fall through to fixtures below.
  }
  return getTripsByRoute(originId, destinationId, departureDate);
}

export async function searchTrips(query: TripSearchQuery): Promise<TripSearchResult> {
  const outbound = await searchLeg(query.originId, query.destinationId, query.departureDate);

  let returnTrips: Trip[] | undefined;
  if (query.tripType === "round-trip" && query.returnDate) {
    returnTrips = await searchLeg(query.destinationId, query.originId, query.returnDate);
  }

  return { outbound, return: returnTrips };
}

export async function getCities(): Promise<City[]> {
  return cities;
}

export async function getOperators(): Promise<Operator[]> {
  return operators;
}

export function getOperator(id: string): Operator | undefined {
  return operators.find((op) => op.id === id);
}

export function getTripById(id: string): Trip | undefined {
  return beTripCache.get(id) ?? trips.find((t) => t.id === id);
}

// Async variant for direct loads (refresh/deep link): cache, fixtures, then backend detail.
export async function getTripDetail(id: string): Promise<Trip | undefined> {
  const cached = getTripById(id);
  if (cached) return cached;
  if (!id.startsWith("be-")) return undefined;
  const numId = Number(id.slice("be-".length));
  if (!Number.isInteger(numId)) return undefined;
  try {
    const trip = await fetchBeTrip(numId);
    beTripCache.set(trip.id, trip);
    return trip;
  } catch {
    return undefined;
  }
}
