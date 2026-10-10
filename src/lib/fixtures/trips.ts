import type { Trip, BusType, Amenity, RouteStop, VehicleType } from "@/types";
import { cities } from "./cities";

// Route pairs with approximate duration in minutes and intermediate stops
const ROUTE_PAIRS: {
  origin: string;
  destination: string;
  duration: number;
  stops?: { cityId: string; minutesFromStart: number }[];
}[] = [
  { origin: "ha-noi", destination: "ho-chi-minh", duration: 2100, stops: [{ cityId: "da-nang", minutesFromStart: 960 }, { cityId: "nha-trang", minutesFromStart: 1380 }] },
  { origin: "ho-chi-minh", destination: "ha-noi", duration: 2100, stops: [{ cityId: "nha-trang", minutesFromStart: 720 }, { cityId: "da-nang", minutesFromStart: 1140 }] },
  { origin: "ho-chi-minh", destination: "da-lat", duration: 420, stops: [{ cityId: "vung-tau", minutesFromStart: 120 }] },
  { origin: "da-lat", destination: "ho-chi-minh", duration: 420, stops: [{ cityId: "vung-tau", minutesFromStart: 300 }] },
  { origin: "ho-chi-minh", destination: "vung-tau", duration: 120 },
  { origin: "vung-tau", destination: "ho-chi-minh", duration: 120 },
  { origin: "ho-chi-minh", destination: "can-tho", duration: 240 },
  { origin: "can-tho", destination: "ho-chi-minh", duration: 240 },
  { origin: "ho-chi-minh", destination: "nha-trang", duration: 540, stops: [{ cityId: "quy-nhon", minutesFromStart: 360 }] },
  { origin: "nha-trang", destination: "ho-chi-minh", duration: 540, stops: [{ cityId: "quy-nhon", minutesFromStart: 180 }] },
  { origin: "ha-noi", destination: "hai-phong", duration: 120 },
  { origin: "hai-phong", destination: "ha-noi", duration: 120 },
  { origin: "ha-noi", destination: "ninh-binh", duration: 90 },
  { origin: "ninh-binh", destination: "ha-noi", duration: 90 },
  { origin: "ha-noi", destination: "sapa", duration: 360, stops: [{ cityId: "ninh-binh", minutesFromStart: 90 }] },
  { origin: "sapa", destination: "ha-noi", duration: 360, stops: [{ cityId: "ninh-binh", minutesFromStart: 270 }] },
  { origin: "da-nang", destination: "hue", duration: 90 },
  { origin: "hue", destination: "da-nang", duration: 90 },
  { origin: "da-nang", destination: "hoi-an", duration: 45 },
  { origin: "hoi-an", destination: "da-nang", duration: 45 },
  { origin: "da-nang", destination: "quy-nhon", duration: 240 },
  { origin: "quy-nhon", destination: "da-nang", duration: 240 },
  { origin: "nha-trang", destination: "da-lat", duration: 240 },
  { origin: "da-lat", destination: "nha-trang", duration: 240 },
  { origin: "ho-chi-minh", destination: "long-xuyen", duration: 240 },
  { origin: "long-xuyen", destination: "ho-chi-minh", duration: 240 },
  { origin: "ho-chi-minh", destination: "phu-quoc", duration: 360 },
  { origin: "phu-quoc", destination: "ho-chi-minh", duration: 360 },
  { origin: "ha-noi", destination: "da-nang", duration: 780, stops: [{ cityId: "ninh-binh", minutesFromStart: 90 }] },
  { origin: "da-nang", destination: "ha-noi", duration: 780, stops: [{ cityId: "ninh-binh", minutesFromStart: 690 }] },
];

const OPERATOR_IDS = [
  "phuong-trang",
  "hoang-yen",
  "mai-linh",
  "kumho",
  "sapa-express",
];

const BUS_TYPE_PRICES: Record<BusType, number> = {
  standard: 1.0,
  premium: 1.4,
  "double-decker": 0.85,
};

const BUS_LAYOUT_MAP: Record<string, BusType> = {
  "standard-2-2": "standard",
  "premium-2-2": "premium",
  "double-decker-2-2": "double-decker",
};

const BUS_IDS = [
  "bus-001", "bus-002", "bus-003", "bus-004", "bus-005",
  "bus-006", "bus-007", "bus-008", "bus-009", "bus-010",
];

const BUS_INFO = BUS_IDS.map((id) => {
  const num = parseInt(id.split("-")[1]);
  const layoutId =
    num <= 1 ? "standard-2-2" :
    num === 2 ? "premium-2-2" :
    num === 3 ? "standard-2-2" :
    num === 4 ? "double-decker-2-2" :
    num === 5 ? "standard-2-2" :
    num === 6 ? "premium-2-2" :
    num === 7 ? "double-decker-2-2" :
    num === 8 ? "standard-2-2" :
    num === 9 ? "standard-2-2" :
    "double-decker-2-2";
  return { id, layoutId, busType: BUS_LAYOUT_MAP[layoutId] };
});

// Amenity sets by bus type
const BUS_TYPE_AMENITIES: Record<BusType, Amenity[]> = {
  standard: ["wifi", "ac", "power"],
  premium: ["wifi", "ac", "power", "usb", "snack", "legroom"],
  "double-decker": ["wifi", "ac", "toilet", "power", "entertainment"],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

function buildStops(
  originId: string,
  destinationId: string,
  departureTime: string,
  duration: number,
  intermediateStops?: { cityId: string; minutesFromStart: number }[]
): RouteStop[] {
  const stops: RouteStop[] = [];
  const originCity = cities.find((c) => c.id === originId);
  const destCity = cities.find((c) => c.id === destinationId);

  stops.push({
    cityId: originId,
    cityName: originCity?.name ?? originId,
    time: departureTime,
    minutesFromStart: 0,
  });

  if (intermediateStops) {
    for (const s of intermediateStops) {
      const city = cities.find((c) => c.id === s.cityId);
      stops.push({
        cityId: s.cityId,
        cityName: city?.name ?? s.cityId,
        time: addMinutes(departureTime, s.minutesFromStart),
        minutesFromStart: s.minutesFromStart,
      });
    }
  }

  stops.push({
    cityId: destinationId,
    cityName: destCity?.name ?? destinationId,
    time: addMinutes(departureTime, duration),
    minutesFromStart: duration,
  });

  return stops;
}

function generateTrips(): Trip[] {
  const trips: Trip[] = [];
  const rand = seededRandom(42);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const tripDate = new Date(today);
    tripDate.setDate(today.getDate() + dayOffset);
    const dateStr = tripDate.toISOString().split("T")[0];

    for (const route of ROUTE_PAIRS) {
      const numTrips = 6 + Math.floor(rand() * 5);
      const usedTimes = new Set<string>();

      for (let i = 0; i < numTrips; i++) {
        const timeSlot = i % 4;
        let departureHour: number;
        switch (timeSlot) {
          case 0: departureHour = 6 + Math.floor(rand() * 3); break;
          case 1: departureHour = 11 + Math.floor(rand() * 3); break;
          case 2: departureHour = 14 + Math.floor(rand() * 4); break;
          case 3: departureHour = 18 + Math.floor(rand() * 5); break;
          default: departureHour = 8;
        }
        const departureMin = Math.floor(rand() * 12) * 5;
        const departureTime = `${String(departureHour).padStart(2, "0")}:${String(departureMin).padStart(2, "0")}`;

        if (usedTimes.has(departureTime)) continue;
        usedTimes.add(departureTime);

        const arrivalTime = addMinutes(departureTime, route.duration);
        const busIdx = Math.floor(rand() * BUS_INFO.length);
        const bus = BUS_INFO[busIdx];
        const operatorId = OPERATOR_IDS[busIdx % OPERATOR_IDS.length];
        // VND pricing: base 80,000 + duration-based, rounded to nearest 10,000
        const basePrice = Math.round((80000 + route.duration * 500) * BUS_TYPE_PRICES[bus.busType]);
        const price = Math.round((basePrice + Math.floor(rand() * 50000)) / 10000) * 10000;
        const totalSeats = bus.busType === "double-decker" ? 40 : bus.busType === "premium" ? 33 : 45;
        const availableSeats = Math.floor(rand() * (totalSeats + 1));
        const stops = buildStops(route.origin, route.destination, departureTime, route.duration, route.stops);

        // Randomly drop 1-2 amenities for variety
        const allAmenities = [...BUS_TYPE_AMENITIES[bus.busType]];
        const dropCount = Math.floor(rand() * 2);
        for (let d = 0; d < dropCount && allAmenities.length > 2; d++) {
          const idx = Math.floor(rand() * allAmenities.length);
          allAmenities.splice(idx, 1);
        }

        const vehicleType: VehicleType =
          bus.busType === "double-decker" ? "sleeper" :
          bus.busType === "premium" ? "limousine" :
          "seat";

        trips.push({
          id: `trip-${route.origin}-${route.destination}-${dateStr}-${departureTime.replace(":", "")}`,
          originId: route.origin,
          destinationId: route.destination,
          operatorId,
          busId: bus.id,
          busType: bus.busType,
          vehicleType,
          departureTime,
          arrivalTime,
          durationMinutes: route.duration,
          price,
          availableSeats,
          totalSeats,
          date: dateStr,
          amenities: allAmenities,
          stops,
        });
      }
    }

  }

  return trips;
}

export const trips: Trip[] = generateTrips();

export function getTripsByRoute(originId: string, destinationId: string, date: string): Trip[] {
  return trips.filter(
    (t) => t.originId === originId && t.destinationId === destinationId && t.date === date
  );
}
