"use client";

import { useMemo } from "react";
import {
  SlidersHorizontal,
  Crown,
  BedSingle,
  Armchair,
  Check,
  Wifi,
  Snowflake,
  Plug,
  Toilet,
  Cookie,
  Sunrise,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { Operator, VehicleType, Amenity } from "@/types";
import { formatVND } from "@/lib/format";
import {
  type TimeOfDay,
  type Filters,
  TIME_SLOTS,
  VEHICLE_TYPE_OPTIONS,
  VEHICLE_TYPE_META,
  PRICE_PRESETS,
  EMPTY_FILTERS,
  MIN_PRICE,
  MAX_PRICE,
  PRICE_STEP,
} from "@/lib/constants";

export type { TimeOfDay, Filters } from "@/lib/constants";

interface FilterPanelProps {
  readonly operators: readonly Operator[];
  readonly filters: Filters;
  readonly onFiltersChange: (filters: Filters) => void;
  readonly resultCount: number;
}

const AMENITY_FILTER_ITEMS: { value: Amenity; label: string; icon: typeof Wifi }[] = [
  { value: "wifi", label: "WiFi miễn phí", icon: Wifi },
  { value: "ac", label: "Điều hòa (A/C)", icon: Snowflake },
  { value: "power", label: "Cổng sạc / Ổ điện", icon: Plug },
  { value: "toilet", label: "Toilet trên xe", icon: Toilet },
  { value: "snack", label: "Nước uống / Khăn", icon: Cookie },
];

const TIME_SLOT_ICONS: Record<TimeOfDay, typeof Sun> = {
  "early-morning": Sunrise,
  morning: Sun,
  afternoon: Sunset,
  evening: Moon,
};

export function FilterPanel({
  operators,
  filters,
  onFiltersChange,
  resultCount,
}: FilterPanelProps) {
  const selectedOperators = useMemo(() => new Set(filters.operators), [filters.operators]);
  const selectedVehicleTypes = useMemo(() => new Set(filters.vehicleTypes ?? []), [filters.vehicleTypes]);
  const selectedAmenities = useMemo(() => new Set(filters.amenities ?? []), [filters.amenities]);

  const hasActiveFilters =
    filters.timeOfDay.length > 0 ||
    filters.maxPrice !== null ||
    filters.operators.length > 0 ||
    (filters.vehicleTypes && filters.vehicleTypes.length > 0) ||
    (filters.amenities && filters.amenities.length > 0) ||
    Boolean(filters.onlyAvailable);

  function toggleVehicleType(type: VehicleType) {
    const current = filters.vehicleTypes ?? [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFiltersChange({ ...filters, vehicleTypes: updated });
  }

  function toggleTimeOfDay(slot: TimeOfDay) {
    const newTime = filters.timeOfDay.includes(slot)
      ? filters.timeOfDay.filter((t) => t !== slot)
      : [...filters.timeOfDay, slot];
    onFiltersChange({ ...filters, timeOfDay: newTime });
  }

  function toggleOperator(id: string) {
    const newOps = filters.operators.includes(id)
      ? filters.operators.filter((o) => o !== id)
      : [...filters.operators, id];
    onFiltersChange({ ...filters, operators: newOps });
  }

  function toggleAmenity(amenity: Amenity) {
    const current = filters.amenities ?? [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    onFiltersChange({ ...filters, amenities: updated });
  }

  return (
    <div className="rounded-2xl bg-card p-5 shadow-card ring-1 ring-border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-extrabold tracking-tight">Bộ lọc tìm kiếm</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltersChange(EMPTY_FILTERS)}
            className="h-7 text-xs text-muted-foreground transition-transform duration-150 ease-out hover:text-foreground active:scale-[0.97]"
          >
            Xóa bộ lọc
          </Button>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          <strong className="font-bold text-foreground">{resultCount}</strong> chuyến xe phù hợp
        </p>
      </div>

      <Separator className="my-4" />

      {/* 1. Loại xe (Vehicle Type) — Top criteria */}
      <div className="space-y-2.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Loại xe (Vehicle Type)
        </Label>
        <div className="space-y-2">
          {VEHICLE_TYPE_OPTIONS.map((opt) => {
            const isSelected = selectedVehicleTypes.has(opt.value);
            const meta = VEHICLE_TYPE_META[opt.value];
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleVehicleType(opt.value)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-2.5 text-left text-xs font-semibold transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-[0.97]",
                  isSelected
                    ? cn("border-primary bg-primary/5 shadow-2xs ring-1 ring-primary/40", meta.badgeBorder)
                    : "border-border bg-surface hover:bg-muted/60"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white shadow-2xs"
                    style={{ backgroundColor: meta.color }}
                  >
                    {opt.value === "limousine" ? (
                      <Crown className="h-3.5 w-3.5" />
                    ) : opt.value === "sleeper" ? (
                      <BedSingle className="h-3.5 w-3.5" />
                    ) : (
                      <Armchair className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <div>
                    <span className="block font-bold text-foreground">{opt.labelVi}</span>
                    <span className="text-[10px] text-muted-foreground">{opt.label}</span>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-md border transition-colors",
                    isSelected
                      ? cn(
                          "border-transparent text-white shadow-2xs",
                          opt.value === "limousine" && "bg-amber-600",
                          opt.value === "sleeper" && "bg-violet-600",
                          opt.value === "seat" && "bg-emerald-600"
                        )
                      : "border-muted-foreground/30 bg-background"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Separator className="my-4" />

      {/* 2. Khung giờ xuất phát (Departure Time) */}
      <div className="space-y-2.5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Giờ xuất phát (Departure)
        </p>
        <div className="space-y-2">
          {TIME_SLOTS.map((slot) => {
            const active = filters.timeOfDay.includes(slot.value);
            const TimeIcon = TIME_SLOT_ICONS[slot.value];
            return (
              <button
                key={slot.value}
                type="button"
                onClick={() => toggleTimeOfDay(slot.value)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-2.5 text-left text-xs font-semibold transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out active:scale-[0.97]",
                  active
                    ? "border-primary bg-primary/5 text-primary shadow-2xs ring-1 ring-primary/40"
                    : "border-border bg-surface text-foreground hover:bg-muted/60"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <TimeIcon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block font-bold leading-tight text-foreground">{slot.labelVi}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {String(slot.from).padStart(2, "0")}:00 - {String(slot.to).padStart(2, "0")}:00
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                      : "border-muted-foreground/30 bg-background"
                  )}
                >
                  {active && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Separator className="my-4" />

      {/* 3. Mức giá (Price Range) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="max-price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Giá vé tối đa
          </Label>
          <span className="text-xs font-extrabold text-primary">
            {formatVND(filters.maxPrice ?? MAX_PRICE)}
          </span>
        </div>

        <Slider
          id="max-price"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={PRICE_STEP}
          value={[filters.maxPrice ?? MAX_PRICE]}
          onValueChange={([val]) =>
            onFiltersChange({
              ...filters,
              maxPrice: val >= MAX_PRICE ? null : val,
            })
          }
        />

        <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground">
          <span>{formatVND(MIN_PRICE)}</span>
          <span>{formatVND(MAX_PRICE)}</span>
        </div>

        {/* Quick price presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PRICE_PRESETS.map((preset) => {
            const isPresetActive = filters.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onFiltersChange({ ...filters, maxPrice: preset.max })}
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-transform duration-150 ease-out active:scale-[0.97]",
                  isPresetActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <Separator className="my-4" />

      {/* 4. Nhà xe (Operators) */}
      <div className="space-y-2.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Nhà xe (Operators)
        </Label>
        <div className="space-y-2">
          {operators.map((op) => (
            <Label
              key={op.id}
              htmlFor={`operator-${op.id}`}
              className="flex min-h-8 cursor-pointer items-center justify-between rounded-lg px-1 py-0.5 text-xs font-normal transition-transform duration-150 ease-out active:scale-[0.98] hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`operator-${op.id}`}
                  checked={selectedOperators.has(op.id)}
                  onCheckedChange={() => toggleOperator(op.id)}
                />
                <span
                  className="h-2.5 w-2.5 rounded-full shadow-2xs"
                  style={{ backgroundColor: op.logoColor }}
                />
                <span className="font-semibold text-foreground">{op.name}</span>
              </div>
              {op.rating > 0 && (
                <span className="text-[10px] font-bold text-amber-500">★ {op.rating.toFixed(1)}</span>
              )}
            </Label>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* 5. Tiện ích trên xe (Amenities) */}
      <div className="space-y-2.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Tiện ích (Amenities)
        </Label>
        <div className="space-y-2">
          {AMENITY_FILTER_ITEMS.map((item) => {
            const Icon = item.icon;
            const checked = selectedAmenities.has(item.value);
            return (
              <Label
                key={item.value}
                htmlFor={`amenity-${item.value}`}
                className="flex min-h-8 cursor-pointer items-center gap-2.5 rounded-lg px-1 py-0.5 text-xs font-normal transition-transform duration-150 ease-out active:scale-[0.98] hover:bg-muted/50"
              >
                <Checkbox
                  id={`amenity-${item.value}`}
                  checked={checked}
                  onCheckedChange={() => toggleAmenity(item.value)}
                />
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground">{item.label}</span>
              </Label>
            );
          })}
        </div>
      </div>

      <Separator className="my-4" />

      {/* 6. Chỉ hiện xe còn chỗ (Only available) */}
      <div className="flex items-center justify-between pt-1">
        <div className="space-y-0.5">
          <Label htmlFor="only-available" className="text-xs font-bold text-foreground cursor-pointer">
            Chỉ hiện xe còn chỗ
          </Label>
          <p className="text-[10px] text-muted-foreground">Ẩn chuyến đã hết vé</p>
        </div>
        <Switch
          id="only-available"
          checked={Boolean(filters.onlyAvailable)}
          onCheckedChange={(checked) => onFiltersChange({ ...filters, onlyAvailable: checked })}
        />
      </div>
    </div>
  );
}
