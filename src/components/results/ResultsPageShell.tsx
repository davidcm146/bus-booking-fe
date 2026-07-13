"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, ArrowLeft, MapPin, Check, ArrowRight } from "lucide-react";
import { cn } from "cnfast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCities } from "@/hooks/useCities";
import { getOperators, searchTrips } from "@/lib/services/searchService";
import { ResultsList, TripSkeleton } from "./ResultsList";
import { FilterPanel, type Filters } from "./FilterPanel";
import { PriceCalendar } from "./PriceCalendar";
import type { TripSearchQuery, Trip, Operator } from "@/types";
import { formatVND, getCityName, formatDuration } from "@/lib/format";
import { type SortOption, SORT_LABELS, EMPTY_FILTERS, TIME_SLOT_HOURS } from "@/lib/constants";

interface ResultsPageShellProps {
  readonly query: TripSearchQuery;
}

type TripPhase = "outbound" | "return";


export function ResultsPageShell({ query }: ResultsPageShellProps) {
  const router = useRouter();
  const isRoundTrip = query.tripType === "round-trip";
  const [outbound, setOutbound] = useState<Trip[]>([]);
  const [returnTrips, setReturnTrips] = useState<Trip[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cities } = useCities();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortOption>("departure-asc");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Round-trip selection state
  const [selectedOutbound, setSelectedOutbound] = useState<Trip | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<Trip | null>(null);
  const [phase, setPhase] = useState<TripPhase>("outbound");

  useEffect(() => {
    getOperators().then(setOperators);
  }, []);

  useEffect(() => {
    let mounted = true;
    searchTrips(query)
      .then((result) => {
        if (mounted) {
          setOutbound(result.outbound);
          setReturnTrips(result.return);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to search trips");
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [query]);

  function handleDateChange(date: string) {
    if (date === query.departureDate || phase !== "outbound") return;
    setLoading(true);
    const params = new URLSearchParams({
      origin: query.originId,
      destination: query.destinationId,
      date,
      tripType: query.tripType,
    });
    if (query.returnDate) params.set("returnDate", query.returnDate);
    router.replace(`/results?${params.toString()}`);
  }

  const originCity = cities.find((c) => c.id === query.originId);
  const destinationCity = cities.find((c) => c.id === query.destinationId);

  const filteredTrips = useMemo(() => {
    const activeTrips = phase === "outbound" ? outbound : (returnTrips ?? []);
    const selectedOperators = new Set(filters.operators);
    const selectedBusTypes = new Set(filters.busTypes);
    let result = [...activeTrips];

    if (filters.timeOfDay.length > 0) {
      result = result.filter((trip) => {
        const hour = parseInt(trip.departureTime.split(":")[0]);
        return filters.timeOfDay.some((slot) => {
          const [start, end] = TIME_SLOT_HOURS[slot];
          return hour >= start && hour < end;
        });
      });
    }

    if (filters.maxPrice !== null) {
      const maxPrice = filters.maxPrice;
      result = result.filter((trip) => trip.price <= maxPrice);
    }

    if (filters.operators.length > 0) {
      result = result.filter((trip) => selectedOperators.has(trip.operatorId));
    }

    if (filters.busTypes.length > 0) {
      result = result.filter((trip) => selectedBusTypes.has(trip.busType));
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "departure-asc":
        result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
      case "duration-asc":
        result.sort((a, b) => a.durationMinutes - b.durationMinutes);
        break;
    }

    return result;
  }, [filters, outbound, phase, returnTrips, sort]);

  const filterPanel = (
    <FilterPanel
      operators={operators}
      filters={filters}
      onFiltersChange={setFilters}
      resultCount={filteredTrips.length}
    />
  );

  function handleTripSelect(trip: Trip) {
    if (phase === "outbound") {
      setSelectedOutbound(trip);
      if (isRoundTrip) {
        setPhase("return");
      } else {
        router.push(`/trips/${trip.id}/seats`);
      }
    } else {
      setSelectedReturn(trip);
    }
  }

  function handleContinueToSeats() {
    if (selectedOutbound) {
      const params = new URLSearchParams();
      params.set("outboundTripId", selectedOutbound.id);
      if (isRoundTrip && selectedReturn) {
        params.set("returnTripId", selectedReturn.id);
      }
      router.push(`/trips/${selectedOutbound.id}/seats?${params.toString()}`);
    }
  }

  const canContinue = isRoundTrip ? (selectedOutbound && selectedReturn) : selectedOutbound;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Route header */}
      <div className="mb-6 rounded-3xl bg-muted/65 p-5 ring-1 ring-border sm:p-6">
        <Link
          href="/"
          className="mb-4 inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          New search
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
                <MapPin className="h-5 w-5" />
              </span>
              {phase === "outbound" ? (
                <>
                  {originCity?.name ?? query.originId}
                  <span className="text-muted-foreground">{isRoundTrip ? "⇄" : "→"}</span>
                  {destinationCity?.name ?? query.destinationId}
                </>
              ) : (
                <>
                  {destinationCity?.name ?? query.destinationId}
                  <span className="text-muted-foreground">←</span>
                  {originCity?.name ?? query.originId}
                </>
              )}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isRoundTrip ? "Round trip" : "One way"} · {filteredTrips.length} {filteredTrips.length === 1 ? "coach" : "coaches"} found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="mr-1 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4">{filterPanel}</div>
              </SheetContent>
            </Sheet>
            <Select value={sort} onValueChange={(val) => setSort(val as SortOption)}>
              <SelectTrigger variant="outline" className="h-9 w-fit gap-1 text-[0.8125rem]">
                <span className="text-muted-foreground mr-1">Sort by:</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <SelectItem key={option} value={option}>
                    {SORT_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Round-trip step indicator */}
      {isRoundTrip && (
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-card ring-1 ring-border sm:flex-row sm:items-center">
          {/* Step 1: Outbound */}
          <div className="flex flex-1 items-center gap-3">
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-200",
              selectedOutbound
                ? "bg-primary text-primary-foreground"
                : phase === "outbound"
                ? "border-2 border-primary text-primary"
                : "border-2 border-border text-muted-foreground"
            )}>
              {selectedOutbound ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wide text-text-subtle">
                Outbound · {originCity?.name ?? query.originId} → {destinationCity?.name ?? query.destinationId}
              </p>
              {selectedOutbound ? (
                <p className="truncate text-sm font-semibold">
                  {selectedOutbound.departureTime} · {formatVND(selectedOutbound.price)}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {phase === "outbound" ? "Select your outbound bus" : "Pending"}
                </p>
              )}
            </div>
            {selectedOutbound && phase === "return" && (
              <Button
                onClick={() => setPhase("outbound")}
                variant="link"
                size="sm"
                className="shrink-0 text-xs"
              >
                Change
              </Button>
            )}
          </div>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-border sm:block" />

          {/* Step 2: Return */}
          <div className="flex flex-1 items-center gap-3">
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-200",
              selectedReturn
                ? "bg-primary text-primary-foreground"
                : phase === "return"
                ? "border-2 border-primary text-primary"
                : "border-2 border-border text-muted-foreground"
            )}>
              {selectedReturn ? <Check className="h-4 w-4" /> : "2"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-wide text-text-subtle">
                Return · {destinationCity?.name ?? query.destinationId} → {originCity?.name ?? query.originId}
              </p>
              {selectedReturn ? (
                <p className="truncate text-sm font-semibold">
                  {selectedReturn.departureTime} · {formatVND(selectedReturn.price)}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {phase === "return" ? "Select your return bus" : "After outbound"}
                </p>
              )}
            </div>
          </div>

          {/* Continue button */}
          {canContinue && (
            <Button onClick={handleContinueToSeats} className="shrink-0">
              Continue
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Price calendar — only in outbound phase */}
      {phase === "outbound" && (
        <div className="mb-6">
          <PriceCalendar
            currentDate={query.departureDate}
            onDateChange={handleDateChange}
          />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40 p-12 text-center" role="alert">
          <p className="text-sm text-muted-foreground">
            Something went wrong loading results. Try your search again.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <TripSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">{filterPanel}</div>
          </aside>
          <div>
            {isRoundTrip ? (
              <div key={phase} className="space-y-3 animate-slide-up">
                {filteredTrips.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-16 text-center">
                    <p className="text-lg font-semibold">No {phase} buses found</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {phase === "return"
                        ? "Try changing your return date or pick a different outbound trip."
                        : "Try a different date using the calendar above."}
                    </p>
                    {phase === "return" && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setPhase("outbound")}
                      >
                        Back to outbound
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredTrips.map((trip) => {
                    const isSelected = (phase === "outbound" ? selectedOutbound : selectedReturn)?.id === trip.id;
                    return (
                      <SelectableTripCard
                        key={trip.id}
                        trip={trip}
                        operator={operators.find((op) => op.id === trip.operatorId)}
                        selected={isSelected}
                        onSelect={() => handleTripSelect(trip)}
                      />
                    );
                  })
                )}
              </div>
            ) : (
              <div className="animate-slide-up">
                <ResultsList trips={filteredTrips} operators={operators} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Trip card with select button for round-trip flow */
function SelectableTripCard({
  trip,
  operator,
  selected,
  onSelect,
}: {
  trip: Trip;
  operator: Operator | undefined;
  selected: boolean;
  onSelect: () => void;
}) {
  const seatsLow = trip.availableSeats <= 5 && trip.availableSeats > 0;
  const hasStops = trip.stops.length > 2;

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Select ${getCityName(trip.originId)} to ${getCityName(trip.destinationId)} at ${trip.departureTime}`}
      className={cn(
        "rounded-xl border-2 p-5 transition-[border-color,box-shadow,background-color,transform] duration-150 ease-out cursor-pointer active:scale-[0.98] ring-0",
        selected
          ? "border-primary bg-primary/5 shadow-card-hover"
          : "border-border bg-surface hover:border-primary/30 hover:shadow-card-hover"
      )}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Operator + times */}
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm"
              style={{ backgroundColor: operator?.logoColor ?? "#64748b" }}
            >
              <span className="text-lg font-bold">{operator?.name.charAt(0) ?? "B"}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums">{trip.departureTime}</p>
              <p className="text-xs text-muted-foreground">{getCityName(trip.originId)}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {formatDuration(trip.durationMinutes)}
              </div>
              <div className="relative mt-1 h-px w-20 bg-border">
                <div className="absolute -top-1 left-0 h-2 w-2 rounded-full border-2 border-border bg-background" />
                <div className="absolute -top-1 right-0 h-2 w-2 rounded-full border-2 border-primary bg-background" />
              </div>
              <p className="mt-1 text-muted-foreground text-[11px]">
                {hasStops ? `${trip.stops.length - 2} stops` : "Direct"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold tabular-nums">{trip.arrivalTime}</p>
              <p className="text-xs text-muted-foreground">{getCityName(trip.destinationId)}</p>
            </div>
          </div>
        </div>

        {/* Right: Price + select button */}
        <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end lg:gap-1.5">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary tabular-nums">
              {formatVND(trip.price)}
            </span>
            {seatsLow && (
              <span className="text-xs font-medium text-destructive">
                Only {trip.availableSeats} left
              </span>
            )}
          </div>
          <Button
            size="sm"
            variant={selected ? "default" : "outline"}
            className="lg:w-full"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {selected ? (
              <>
                <Check className="mr-1 h-3.5 w-3.5" />
                Selected
              </>
            ) : (
              "Select"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
