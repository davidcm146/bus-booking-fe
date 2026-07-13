import { cities } from "@/lib/fixtures/cities";

const VND_FORMATTER = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

/** Format a number as Vietnamese Dong (VND) */
export function formatVND(amount: number): string {
  return VND_FORMATTER.format(amount);
}

/** Get the price for a seat given the base trip price and premium status */
export function getSeatPrice(basePrice: number, isPremium?: boolean): number {
  return isPremium ? Math.round((basePrice * 1.5) / 1000) * 1000 : basePrice;
}

/** Look up a city display name from its ID using the cities fixture */
export function getCityName(cityId: string): string {
  return cities.find((c) => c.id === cityId)?.name ?? cityId;
}

/** Format minutes as "Xh Ym" */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

/** Today's date as YYYY-MM-DD */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}
