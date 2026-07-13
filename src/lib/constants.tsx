import {
  Wifi,
  Plug,
  Snowflake,
  Toilet,
  Usb,
  Cookie,
  Maximize,
  Tv,
  TicketCheck,
  MapPinned,
  BadgeCheck,
  LayoutDashboard,
  BusFront,
  CarFront,
  Route,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import type { Amenity, BusType } from "@/types";

// ─── Navigation ──────────────────────────────────────────────────────────

export const NAVIGATION = [
  { href: "/", label: "Find a bus", audience: "public" },
  { href: "/bookings", label: "My bookings", audience: "public" },
  { href: "/operator", label: "Operator desk", audience: "operator" },
] as const;

// ─── Auth ────────────────────────────────────────────────────────────────

export const BENEFITS = [
  { icon: TicketCheck, label: "Keep every ticket in one place" },
  { icon: MapPinned, label: "Return to saved trip details anytime" },
  { icon: BadgeCheck, label: "Use the same secure checkout" },
] as const;

// ─── Amenities ───────────────────────────────────────────────────────────

export const AMENITY_CONFIG: Record<Amenity, { icon: typeof Wifi; short: string; long: string }> = {
  wifi: { icon: Wifi, short: "WiFi", long: "Free WiFi" },
  power: { icon: Plug, short: "Power", long: "Power outlets" },
  ac: { icon: Snowflake, short: "A/C", long: "Air conditioning" },
  toilet: { icon: Toilet, short: "Restroom", long: "Onboard restroom" },
  usb: { icon: Usb, short: "USB", long: "USB ports" },
  snack: { icon: Cookie, short: "Snacks", long: "Snacks" },
  legroom: { icon: Maximize, short: "Legroom", long: "Extra legroom" },
  entertainment: { icon: Tv, short: "Entertainment", long: "Entertainment" },
};

// ─── Filters ─────────────────────────────────────────────────────────────

export type TimeOfDay = "morning" | "midday" | "afternoon" | "evening";

export interface Filters {
  timeOfDay: TimeOfDay[];
  maxPrice: number | null;
  operators: string[];
  busTypes: BusType[];
}

export const TIME_SLOTS: { value: TimeOfDay; label: string; from: number; to: number }[] = [
  { value: "morning", label: "Morning", from: 6, to: 11 },
  { value: "midday", label: "Midday", from: 11, to: 14 },
  { value: "afternoon", label: "Afternoon", from: 14, to: 18 },
  { value: "evening", label: "Evening", from: 18, to: 23 },
];

export const TIME_SLOT_HOURS: Record<TimeOfDay, readonly [number, number]> = Object.fromEntries(
  TIME_SLOTS.map((s) => [s.value, [s.from, s.to] as const])
) as Record<TimeOfDay, readonly [number, number]>;

export const BUS_TYPE_OPTIONS: { value: BusType; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
  { value: "double-decker", label: "Double-decker" },
];

export const EMPTY_FILTERS: Filters = {
  timeOfDay: [],
  maxPrice: null,
  operators: [],
  busTypes: [],
};

export const MIN_PRICE = 150_000;
export const MAX_PRICE = 650_000;
export const PRICE_STEP = 50_000;

// ─── Sort ────────────────────────────────────────────────────────────────

export type SortOption = "price-asc" | "departure-asc" | "duration-asc";

export const SORT_LABELS: Record<SortOption, string> = {
  "price-asc": "Price (low to high)",
  "departure-asc": "Departure time (earliest)",
  "duration-asc": "Duration (shortest)",
};

// ─── Popular routes ──────────────────────────────────────────────────────

export interface PopularRoute {
  readonly from: string;
  readonly to: string;
  readonly fromId: string;
  readonly toId: string;
  readonly fromPrice: number;
  readonly duration: string;
  readonly direct: boolean;
  readonly code: string;
}

export const POPULAR_ROUTES: readonly PopularRoute[] = [
  { from: "Hà Nội", to: "Đà Nẵng", fromId: "ha-noi", toId: "da-nang", fromPrice: 350000, duration: "13h", direct: true, code: "HAN · DAD" },
  { from: "Hồ Chí Minh", to: "Đà Lạt", fromId: "ho-chi-minh", toId: "da-lat", fromPrice: 250000, duration: "7h", direct: true, code: "SGN · DLI" },
  { from: "Hà Nội", to: "Sapa", fromId: "ha-noi", toId: "sapa", fromPrice: 300000, duration: "6h", direct: true, code: "HAN · SAP" },
  { from: "Hồ Chí Minh", to: "Vũng Tàu", fromId: "ho-chi-minh", toId: "vung-tau", fromPrice: 120000, duration: "2h", direct: true, code: "SGN · VTG" },
  { from: "Đà Nẵng", to: "Hội An", fromId: "da-nang", toId: "hoi-an", fromPrice: 50000, duration: "45m", direct: true, code: "DAD · HAI" },
  { from: "Hồ Chí Minh", to: "Cần Thơ", fromId: "ho-chi-minh", toId: "can-tho", fromPrice: 150000, duration: "4h", direct: true, code: "SGN · VCA" },
] as const;

// ─── Checkout ────────────────────────────────────────────────────────────

export const STEPS = ["Review", "Passengers", "Payment"] as const;

// ─── Operator sections ───────────────────────────────────────────────────

export const OPERATOR_SECTIONS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "trips", label: "Trips", icon: BusFront },
  { id: "bookings", label: "Bookings", icon: TicketCheck },
  { id: "fleet", label: "Fleet & offers", icon: CarFront },
  { id: "network", label: "Network", icon: Route },
  { id: "team", label: "People & access", icon: ShieldCheck },
  { id: "finance", label: "Finance & messages", icon: WalletCards },
] as const;

export type OperatorSectionId = (typeof OPERATOR_SECTIONS)[number]["id"];
