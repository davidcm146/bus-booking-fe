export interface City {
  id: string;
  name: string;
  region: string;
}

export interface Operator {
  id: string;
  name: string;
  logoColor: string;
  rating: number;
  totalReviews: number;
}

export type BusType = "standard" | "premium" | "double-decker";

export type Amenity = "wifi" | "power" | "ac" | "toilet" | "usb" | "snack" | "legroom" | "entertainment";

export interface SeatLayout {
  id: string;
  type: BusType;
  rows: number;
  cols: number[];
  aisleAfter: number;
  deck?: "lower" | "upper";
  totalSeats: number;
}

export interface Bus {
  id: string;
  operatorId: string;
  layoutId: string;
  plateNumber: string;
}

export interface RouteStop {
  cityId: string;
  cityName: string;
  time: string;
  minutesFromStart: number;
}

export interface Trip {
  id: string;
  originId: string;
  destinationId: string;
  operatorId: string;
  busId: string;
  busType: BusType;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  price: number;
  availableSeats: number;
  totalSeats: number;
  date: string;
  amenities: Amenity[];
  stops: RouteStop[];
}

export interface TripSearchQuery {
  originId: string;
  destinationId: string;
  departureDate: string;
  returnDate?: string;
  tripType: TripType;
}

export const TRIP_TYPES = ["one-way", "round-trip"] as const;
export type TripType = (typeof TRIP_TYPES)[number];

export interface TripSearchResult {
  outbound: Trip[];
  return?: Trip[];
}
