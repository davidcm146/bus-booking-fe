import { describe, it, expect } from "vitest";
import { getSeatAvailability } from "@/lib/services/seatService";
import { getTripsByRoute, trips } from "@/lib/fixtures/trips";
import type { Trip, VehicleType } from "@/types";

function beTrip(overrides: Partial<Trip> & { vehicleType: VehicleType; totalSeats: number }): Trip {
  return {
    id: "be-1",
    originId: "be-area-1",
    destinationId: "be-area-2",
    operatorId: "phuong-trang",
    busId: "be-vehicle-1",
    busType: "standard",
    departureTime: "06:00",
    arrivalTime: "12:00",
    durationMinutes: 360,
    price: 250000,
    availableSeats: overrides.totalSeats,
    date: "2026-10-12",
    amenities: [],
    stops: [],
    ...overrides,
  };
}

describe("backend seat geometry", () => {
  it("builds a 2-floor sleeper (40 seats, cols 1/3/5, A/B labels)", async () => {
    const { layout, seats } = await getSeatAvailability(
      beTrip({ vehicleType: "sleeper", totalSeats: 40 }),
    );

    expect(seats).toHaveLength(40);
    expect(layout.rows).toBe(6);
    const lower = seats.filter((s) => s.deck === "lower");
    const upper = seats.filter((s) => s.deck === "upper");
    expect(lower).toHaveLength(20);
    expect(upper).toHaveLength(20);
    expect(lower[0].label).toBe("A1");
    expect(upper[0].label).toBe("B1");

    // First row: 3 seats at cols 1,3,5 (aisles between).
    const row1 = lower.filter((s) => s.row === 1).sort((a, b) => a.col - b.col);
    expect(row1.map((s) => s.col)).toEqual([1, 3, 5]);
    // Back row holds the last 5 seats across all columns.
    const backRow = lower.filter((s) => s.row === 6).sort((a, b) => a.col - b.col);
    expect(backRow.map((s) => s.col)).toEqual([1, 2, 3, 4, 5]);
    // Positions are unique within a deck.
    const keys = new Set(lower.map((s) => `${s.row}:${s.col}`));
    expect(keys.size).toBe(20);
    // No booking API yet: everything bookable.
    expect(seats.every((s) => s.status === "available")).toBe(true);
  });

  it("builds a single-floor limousine (33 seats, 2 per row)", async () => {
    const { layout, seats } = await getSeatAvailability(
      beTrip({ vehicleType: "limousine", totalSeats: 33, busType: "premium" }),
    );

    expect(seats).toHaveLength(33);
    expect(layout.rows).toBe(15);
    expect(seats.some((s) => s.deck)).toBe(false);
    const row1 = seats.filter((s) => s.row === 1).sort((a, b) => a.col - b.col);
    expect(row1.map((s) => s.col)).toEqual([1, 5]);
    expect(seats[0].label).toBe("A1");
  });

  it("builds a single-floor standard seat bus (45 seats, 4 per row)", async () => {
    const { seats } = await getSeatAvailability(
      beTrip({ vehicleType: "seat", totalSeats: 45 }),
    );

    expect(seats).toHaveLength(45);
    const row1 = seats.filter((s) => s.row === 1).sort((a, b) => a.col - b.col);
    expect(row1.map((s) => s.col)).toEqual([1, 2, 4, 5]);
  });
});

describe("fixture seat geometry", () => {
  it("keeps standard seat fixture trips on the 5-wide grid with an aisle gap at column 3", async () => {
    const trip = trips.find((t) => t.vehicleType === "seat");
    expect(trip).toBeDefined();

    const { seats, layout } = await getSeatAvailability(trip!);

    expect(seats.length).toBeGreaterThan(0);
    for (const s of seats) {
      expect(s.col).toBeGreaterThanOrEqual(1);
      expect(s.col).toBeLessThanOrEqual(5);
    }
    // Aisle column 3 stays empty for standard 2+2 rows before the 5-seater back row.
    const normalRows = seats.filter((s) => s.row < layout.rows);
    expect(normalRows.some((s) => s.col === 3)).toBe(false);
    // Back row spans all 5 columns
    const backRow = seats.filter((s) => s.row === layout.rows);
    expect(backRow.map((s) => s.col)).toEqual([1, 2, 3, 4, 5]);
  });

  it("keeps limousine fixture trips with wide central aisle (cols 2, 3, 4 empty except back row)", async () => {
    const trip = trips.find((t) => t.vehicleType === "limousine");
    expect(trip).toBeDefined();

    const { seats, layout } = await getSeatAvailability(trip!);
    expect(seats.length).toBeGreaterThan(0);

    const normalRows = seats.filter((s) => s.row < layout.rows);
    expect(normalRows.some((s) => [2, 3, 4].includes(s.col))).toBe(false);
  });

  it("keeps sleeper fixture trips with aisles at cols 2 and 4", async () => {
    const trip = trips.find((t) => t.vehicleType === "sleeper");
    expect(trip).toBeDefined();

    const { seats, layout } = await getSeatAvailability(trip!);
    expect(seats.length).toBeGreaterThan(0);

    const normalRows = seats.filter((s) => s.row < layout.rows);
    expect(normalRows.some((s) => [2, 4].includes(s.col))).toBe(false);
  });
});
