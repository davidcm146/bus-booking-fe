"use client";

import { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "cnfast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Operator, BusType } from "@/types";
import { formatVND } from "@/lib/format";
import {
  type TimeOfDay,
  type Filters,
  TIME_SLOTS,
  BUS_TYPE_OPTIONS,
  EMPTY_FILTERS,
  MIN_PRICE,
  MAX_PRICE,
  PRICE_STEP,
} from "@/lib/constants";

import { Slider } from "@/components/ui/slider";

export type { TimeOfDay, Filters } from "@/lib/constants";

interface FilterPanelProps {
  readonly operators: readonly Operator[];
  readonly filters: Filters;
  readonly onFiltersChange: (filters: Filters) => void;
  readonly resultCount: number;
}

export function FilterPanel({
  operators,
  filters,
  onFiltersChange,
  resultCount,
}: FilterPanelProps) {
  const selectedOperators = useMemo(() => new Set(filters.operators), [filters.operators]);
  const selectedBusTypes = useMemo(() => new Set(filters.busTypes), [filters.busTypes]);
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

  function toggleBusType(type: BusType) {
    const newTypes = filters.busTypes.includes(type)
      ? filters.busTypes.filter((t) => t !== type)
      : [...filters.busTypes, type];
    onFiltersChange({ ...filters, busTypes: newTypes });
  }

  return (
    <div className="rounded-2xl bg-card p-5 shadow-card ring-1 ring-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-extrabold tracking-tight">Narrow the list</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFiltersChange(EMPTY_FILTERS)}
          className="h-7 text-xs"
        >
          Clear all
        </Button>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">{resultCount} coaches match</p>

      <Separator className="my-4" />

      {/* Time of day */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Departure time
        </p>
        <div className="flex flex-wrap gap-2">
          {TIME_SLOTS.map((slot) => {
            const active = filters.timeOfDay.includes(slot.value);
            return (
              <Button
                key={slot.value}
                onClick={() => toggleTimeOfDay(slot.value)}
                variant="ghost"
                size="xs"
                className={cn(
                  "gap-1 rounded-full border",
                  active
                    ? "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground"
                    : "border-border hover:bg-muted"
                )}
              >
                {slot.label}
                <span className="opacity-60">{slot.from}-{slot.to}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="max-price" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Max price: {formatVND(filters.maxPrice ?? MAX_PRICE)}
        </Label>
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
      </div>

      <Separator className="my-4" />

      {/* Operators */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Operators
        </Label>
        <div className="space-y-2.5">
          {operators.map((op) => (
            <Label
              key={op.id}
              htmlFor={`operator-${op.id}`}
              className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm font-normal transition-transform active:scale-[0.97]"
            >
              <Checkbox
                id={`operator-${op.id}`}
                checked={selectedOperators.has(op.id)}
                onCheckedChange={() => toggleOperator(op.id)}
              />
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: op.logoColor }}
              />
              {op.name}
            </Label>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Bus type */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Bus type
        </Label>
        <div className="space-y-2.5">
          {BUS_TYPE_OPTIONS.map((opt) => (
            <Label
              key={opt.value}
              htmlFor={`bus-type-${opt.value}`}
              className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm font-normal transition-transform active:scale-[0.97]"
            >
              <Checkbox
                id={`bus-type-${opt.value}`}
                checked={selectedBusTypes.has(opt.value)}
                onCheckedChange={() => toggleBusType(opt.value)}
              />
              {opt.label}
            </Label>
          ))}
        </div>
      </div>
    </div>
  );
}
