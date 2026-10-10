import type { Amenity, BusType, Trip, VehicleType } from "@/types";
import { apiGet } from "./client";

// --- Backend shapes (internal/dto/response/trip_response.go) ---

export type LocalizedText = Record<string, string>;

interface BeEndpoint {
  locationId: number;
  name: LocalizedText;
  city: { id: number; name: LocalizedText };
}

export interface BeTripResponse {
  id: number;
  departureTime: string;
  arrivalTime: string | null;
  basePrice: number;
  status: string;
  availableSeats: number;
  operator: { id: number; code: string; name: LocalizedText };
  origin: BeEndpoint;
  destination: BeEndpoint;
  route: { id: number; name: LocalizedText; distanceKm: number; durationMinutes: number; stopsCount: number };
  vehicle: { id: number; type: string; totalSeats: number; amenities: Record<string, boolean> };
}

// FE city slug -> BE administrative area id (post-2025 merge provinces).
// ponytail: ids are seed-insert order in BE administrative_areas; re-verify if BE reseeds.
export const CITY_AREA_ID: Record<string, number> = {
  "ha-noi": 1,
  "hai-phong": 13,
  "ninh-binh": 15,
  "hue": 20,
  "da-nang": 21,
  "hoi-an": 21,
  "quy-nhon": 23,
  "nha-trang": 24,
  "da-lat": 26,
  "ho-chi-minh": 28,
  "vung-tau": 28,
  "phu-quoc": 32,
  "long-xuyen": 32,
  "can-tho": 33,
  "sapa": 7,
};

const VN_TZ = "Asia/Ho_Chi_Minh";
const timeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: VN_TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const dateFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: VN_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function pickText(t: LocalizedText | undefined, fallback = ""): string {
  if (!t) return fallback;
  return t.vi ?? t.en ?? Object.values(t)[0] ?? fallback;
}

function formatHcmTime(iso: string): string {
  return timeFmt.format(new Date(iso));
}

function formatHcmDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

function mapVehicleType(t: string): BusType {
  if (t === "limousine") return "premium";
  return "standard";
}

function asVehicleType(t: string): VehicleType | undefined {
  return t === "sleeper" || t === "limousine" || t === "seat" ? t : undefined;
}

const AMENITY_MAP: Record<string, Amenity> = {
  wifi: "wifi",
  air_conditioner: "ac",
  toilet: "toilet",
  usb_charger: "usb",
  tv: "entertainment",
};

function mapAmenities(raw: Record<string, boolean> | undefined): Amenity[] {
  if (!raw) return [];
  const out: Amenity[] = [];
  for (const [k, v] of Object.entries(raw)) {
    const mapped = AMENITY_MAP[k];
    if (v && mapped && !out.includes(mapped)) out.push(mapped);
  }
  return out;
}

// Display names for BE-sourced ids, consulted by getCityName().
const beCityNames = new Map<string, string>();

export function beCityName(id: string): string | undefined {
  return beCityNames.get(id);
}

export function mapBeTrip(t: BeTripResponse): Trip {
  const originId = `be-area-${t.origin.locationId}`;
  const destinationId = `be-area-${t.destination.locationId}`;
  beCityNames.set(originId, pickText(t.origin.city.name, pickText(t.origin.name, originId)));
  beCityNames.set(destinationId, pickText(t.destination.city.name, pickText(t.destination.name, destinationId)));

  const departure = new Date(t.departureTime);
  const arrival = t.arrivalTime
    ? new Date(t.arrivalTime)
    : new Date(departure.getTime() + t.route.durationMinutes * 60_000);

  return {
    // Operator code matches fixture operator ids (e.g. "phuong-trang"),
    // so badges/filters keep working; unknown codes fall back to gray.
    id: `be-${t.id}`,
    originId,
    destinationId,
    operatorId: t.operator.code,
    operatorName: pickText(t.operator.name, t.operator.code),
    vehicleType: asVehicleType(t.vehicle.type),
    busId: `be-vehicle-${t.vehicle.id}`,
    busType: mapVehicleType(t.vehicle.type),
    departureTime: formatHcmTime(t.departureTime),
    arrivalTime: formatHcmTime(arrival.toISOString()),
    durationMinutes: t.route.durationMinutes,
    price: Number(t.basePrice),
    availableSeats: t.availableSeats,
    totalSeats: t.vehicle.totalSeats,
    date: formatHcmDate(t.departureTime),
    amenities: mapAmenities(t.vehicle.amenities),
    stops: [],
  };
}

export interface BeTripSearch {
  originAreaId?: number;
  destinationAreaId?: number;
  departureDate?: string;
  limit?: number;
}

export async function searchBeTrips(q: BeTripSearch): Promise<Trip[]> {
  const params = new URLSearchParams();
  if (q.originAreaId) params.set("originId", String(q.originAreaId));
  if (q.destinationAreaId) params.set("destinationId", String(q.destinationAreaId));
  if (q.departureDate) params.set("departureDate", q.departureDate);
  params.set("limit", String(q.limit ?? 50));
  const data = await apiGet<BeTripResponse[]>(`/api/v1/trips?${params.toString()}`);
  return (Array.isArray(data) ? data : []).map(mapBeTrip);
}

export async function fetchBeTrip(id: number): Promise<Trip> {
  const data = await apiGet<BeTripResponse>(`/api/v1/trips/${id}`);
  return mapBeTrip(data);
}
