import { describe, it, expect, vi, afterEach } from "vitest";
import { mapBeTrip, searchBeTrips, pickText, type BeTripResponse } from "@/lib/api/tripApi";
import { getCityName } from "@/lib/format";

const BE_TRIP: BeTripResponse = {
  id: 42,
  departureTime: "2026-10-12T06:00:00+07:00",
  arrivalTime: "2026-10-12T12:30:00+07:00",
  basePrice: 250000,
  status: "scheduled",
  availableSeats: 30,
  operator: { id: 1, code: "phuong-trang", name: { vi: "Phương Trang", en: "Phuong Trang" } },
  origin: {
    locationId: 10,
    name: { vi: "Bến xe Miền Đông", en: "Mien Dong Station" },
    city: { id: 28, name: { vi: "Hồ Chí Minh", en: "Ho Chi Minh City" } },
  },
  destination: {
    locationId: 20,
    name: { vi: "Bến xe Đà Lạt", en: "Da Lat Station" },
    city: { id: 26, name: { vi: "Lâm Đồng", en: "Lam Dong" } },
  },
  route: { id: 5, name: { vi: "Sài Gòn - Đà Lạt", en: "Saigon - Dalat" }, distanceKm: 300, durationMinutes: 390, stopsCount: 2 },
  vehicle: {
    id: 3,
    type: "sleeper",
    totalSeats: 34,
    amenities: { wifi: true, air_conditioner: true, toilet: false, unknown_thing: true },
  },
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("pickText", () => {
  it("prefers vi, then en, then first value", () => {
    expect(pickText({ vi: "A", en: "B" })).toBe("A");
    expect(pickText({ en: "B" })).toBe("B");
    expect(pickText(undefined, "fb")).toBe("fb");
  });
});

describe("mapBeTrip", () => {
  it("maps backend shape to the FE Trip type in VN local time", () => {
    const trip = mapBeTrip(BE_TRIP);

    expect(trip.id).toBe("be-42");
    expect(trip.operatorId).toBe("phuong-trang");
    expect(trip.operatorName).toBe("Phương Trang");
    expect(trip.vehicleType).toBe("sleeper");
    expect(trip.busType).toBe("standard");
    expect(trip.departureTime).toBe("06:00");
    expect(trip.arrivalTime).toBe("12:30");
    expect(trip.date).toBe("2026-10-12");
    expect(trip.durationMinutes).toBe(390);
    expect(trip.price).toBe(250000);
    expect(trip.availableSeats).toBe(30);
    expect(trip.totalSeats).toBe(34);
    expect(trip.amenities).toEqual(["wifi", "ac"]);
    expect(trip.stops).toEqual([]);
  });

  it("maps limousine to premium and derives arrival when null", () => {
    const trip = mapBeTrip({
      ...BE_TRIP,
      arrivalTime: null,
      vehicle: { ...BE_TRIP.vehicle, type: "limousine" },
    });

    expect(trip.busType).toBe("premium");
    // 06:00 + 390min = 12:30
    expect(trip.arrivalTime).toBe("12:30");
  });

  it("registers city display names for getCityName", () => {
    const trip = mapBeTrip(BE_TRIP);

    expect(getCityName(trip.originId)).toBe("Hồ Chí Minh");
    expect(getCityName(trip.destinationId)).toBe("Lâm Đồng");
  });
});

describe("searchBeTrips", () => {
  it("queries /api/v1/trips with area ids and maps results", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: [BE_TRIP] }),
    } as Response);

    const { searchBeTrips: search } = await import("@/lib/api/tripApi");
    const trips = await search({ originAreaId: 28, destinationAreaId: 26, departureDate: "2026-10-12" });

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/api/v1/trips?");
    expect(url).toContain("originId=28");
    expect(url).toContain("destinationId=26");
    expect(url).toContain("departureDate=2026-10-12");
    expect(trips).toHaveLength(1);
    expect(trips[0].id).toBe("be-42");
  });

  it("throws on backend error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 422,
      json: () => Promise.resolve({ success: false, error: { message: "Validation failed" } }),
    } as Response);

    await expect(searchBeTrips({})).rejects.toThrow("Validation failed");
  });
});
