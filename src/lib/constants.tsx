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
import type { Amenity, BusType, VehicleType } from "@/types";

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

export type TimeOfDay = "early-morning" | "morning" | "afternoon" | "evening";

export interface Filters {
  timeOfDay: TimeOfDay[];
  maxPrice: number | null;
  operators: string[];
  busTypes: BusType[];
  vehicleTypes: VehicleType[];
  amenities: Amenity[];
  onlyAvailable: boolean;
}

export const TIME_SLOTS: { value: TimeOfDay; label: string; labelVi: string; from: number; to: number }[] = [
  { value: "early-morning", label: "Early morning", labelVi: "Sáng sớm", from: 0, to: 6 },
  { value: "morning", label: "Morning", labelVi: "Buổi sáng", from: 6, to: 12 },
  { value: "afternoon", label: "Afternoon", labelVi: "Buổi chiều", from: 12, to: 18 },
  { value: "evening", label: "Evening", labelVi: "Buổi tối", from: 18, to: 24 },
];

export const TIME_SLOT_HOURS: Record<TimeOfDay, readonly [number, number]> = Object.fromEntries(
  TIME_SLOTS.map((s) => [s.value, [s.from, s.to] as const])
) as Record<TimeOfDay, readonly [number, number]>;

export const BUS_TYPE_OPTIONS: { value: BusType; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
  { value: "double-decker", label: "Double-decker" },
];

// ─── Vehicle types (backend & UI themes) ──────────────────────────────────

export interface VehicleTypeDetails {
  label: string;
  labelVi: string;
  color: string;
  bgLight: string;
  borderLight: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentGradient: string;
  glowColor: string;
  description: string;
}

export const VEHICLE_TYPE_META: Record<VehicleType, VehicleTypeDetails> = {
  limousine: {
    label: "Limousine",
    labelVi: "Xe Limousine VIP",
    color: "#d97706",
    bgLight: "bg-amber-500/10 dark:bg-amber-500/15",
    borderLight: "border-amber-500/30",
    badgeBg: "bg-amber-500/10 dark:bg-amber-500/20",
    badgeBorder: "border-amber-500/30 dark:border-amber-500/40",
    badgeText: "text-amber-700 dark:text-amber-300",
    accentGradient: "linear-gradient(135deg, #d97706, #b45309)",
    glowColor: "rgba(217, 119, 6, 0.25)",
    description: "Ghế da VIP chỉnh điện, TV giải trí, sạc riêng & không gian đẳng cấp",
  },
  sleeper: {
    label: "Sleeper",
    labelVi: "Xe Giường nằm",
    color: "#7c3aed",
    bgLight: "bg-violet-500/10 dark:bg-violet-500/15",
    borderLight: "border-violet-500/30",
    badgeBg: "bg-violet-500/10 dark:bg-violet-500/20",
    badgeBorder: "border-violet-500/30 dark:border-violet-500/40",
    badgeText: "text-violet-700 dark:text-violet-300",
    accentGradient: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    glowColor: "rgba(124, 58, 237, 0.25)",
    description: "Khoang giường nằm êm ái, rèm che riêng tư, chăn đắp & cổng sạc",
  },
  seat: {
    label: "Standard seat",
    labelVi: "Xe Ghế ngồi",
    color: "#059669",
    bgLight: "bg-emerald-500/10 dark:bg-emerald-500/15",
    borderLight: "border-emerald-500/30",
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    badgeBorder: "border-emerald-500/30 dark:border-emerald-500/40",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    accentGradient: "linear-gradient(135deg, #059669, #047857)",
    glowColor: "rgba(5, 150, 105, 0.25)",
    description: "Ghế đệm ngả lưng cao cấp, điều hòa mát mẻ, tiết kiệm chi phí",
  },
};

export const VEHICLE_TYPE_OPTIONS: { value: VehicleType; label: string; labelVi: string; color: string }[] = [
  { value: "limousine", label: "Limousine", labelVi: "Xe Limousine VIP", color: "#d97706" },
  { value: "sleeper", label: "Sleeper", labelVi: "Xe Giường nằm", color: "#7c3aed" },
  { value: "seat", label: "Standard seat", labelVi: "Xe Ghế ngồi", color: "#059669" },
];

export const EMPTY_FILTERS: Filters = {
  timeOfDay: [],
  maxPrice: null,
  operators: [],
  busTypes: [],
  vehicleTypes: [],
  amenities: [],
  onlyAvailable: false,
};

export const MIN_PRICE = 50_000;
export const MAX_PRICE = 650_000;
export const PRICE_STEP = 25_000;

export const PRICE_PRESETS = [
  { label: "Dưới 200k", max: 200_000 },
  { label: "200k - 350k", max: 350_000 },
  { label: "350k - 500k", max: 500_000 },
  { label: "Tất cả mức giá", max: null },
] as const;

// ─── Sort ────────────────────────────────────────────────────────────────

export type SortOption =
  | "departure-asc"
  | "departure-desc"
  | "price-asc"
  | "price-desc"
  | "duration-asc"
  | "rating-desc";

export const SORT_LABELS: Record<SortOption, string> = {
  "departure-asc": "Giờ đi: Sớm nhất",
  "departure-desc": "Giờ đi: Muộn nhất",
  "price-asc": "Giá: Thấp đến cao",
  "price-desc": "Giá: Cao đến thấp",
  "duration-asc": "Thời gian: Nhanh nhất",
  "rating-desc": "Đánh giá: Cao nhất",
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
