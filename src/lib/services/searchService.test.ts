import { describe, it, expect, vi, afterEach } from "vitest";
import { getTripById, getTripDetail, searchTrips } from "@/lib/services/searchService";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("searchTrips backend fallback", () => {
  it("returns fixture trips when the backend is unreachable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("fetch failed"));

    const result = await searchTrips({
      originId: "ha-noi",
      destinationId: "hai-phong",
      departureDate: "2026-10-12",
      tripType: "one-way",
    });

    expect(result.outbound.length).toBeGreaterThan(0);
    expect(result.outbound[0].originId).toBe("ha-noi");
  });

  it("returns fixture trips when the backend returns empty (stale seeds)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: [] }),
    } as Response);

    const result = await searchTrips({
      originId: "ha-noi",
      destinationId: "hai-phong",
      departureDate: "2026-10-12",
      tripType: "one-way",
    });

    expect(result.outbound.length).toBeGreaterThan(0);
  });

  it("resolves cached backend trips via getTripById/getTripDetail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        data: [
          {
            id: 7,
            departureTime: "2026-10-12T06:00:00+07:00",
            arrivalTime: null,
            basePrice: 200000,
            status: "scheduled",
            availableSeats: 20,
            operator: { id: 1, code: "phuong-trang", name: { vi: "Phương Trang" } },
            origin: { locationId: 1, name: { vi: "Bx Giáp Bát" }, city: { id: 1, name: { vi: "Hà Nội" } } },
            destination: { locationId: 2, name: { vi: "Bx Hải Phòng" }, city: { id: 13, name: { vi: "Hải Phòng" } } },
            route: { id: 1, name: { vi: "HN-HP" }, distanceKm: 120, durationMinutes: 120, stopsCount: 0 },
            vehicle: { id: 1, type: "seat", totalSeats: 29, amenities: {} },
          },
        ],
      }),
    } as Response);

    const result = await searchTrips({
      originId: "ha-noi",
      destinationId: "hai-phong",
      departureDate: "2026-10-12",
      tripType: "one-way",
    });

    expect(result.outbound[0].id).toBe("be-7");
    expect(getTripById("be-7")?.originId).toBe("be-area-1");
    await expect(getTripDetail("be-7")).resolves.toMatchObject({ id: "be-7" });
  });
});
