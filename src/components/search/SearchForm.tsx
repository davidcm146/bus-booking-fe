"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Search, CalendarDays, ArrowRight } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CityCombobox } from "./CityCombobox";
import { useCities } from "@/hooks/useCities";
import { todayISO } from "@/lib/format";
import type { TripType } from "@/types";

export function SearchForm() {
  const router = useRouter();
  const { cities, loading } = useCities();

  const [tripType, setTripType] = useState<TripType>("one-way");
  const [originId, setOriginId] = useState<string | null>(null);
  const [destinationId, setDestinationId] = useState<string | null>(null);
  const [departureDate, setDepartureDate] = useState(() => todayISO());
  const [returnDate, setReturnDate] = useState(() => todayISO());
  const [departOpen, setDepartOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const canSearch = Boolean(
    originId && destinationId && originId !== destinationId && departureDate
  );
  const sameCity = Boolean(originId && destinationId && originId === destinationId);

  function handleSwap() {
    setOriginId(destinationId);
    setDestinationId(originId);
  }

  function handleSearch() {
    if (!canSearch || !originId || !destinationId) return;
    const params = new URLSearchParams({
      origin: originId,
      destination: destinationId,
      date: departureDate,
      tripType,
    });
    if (tripType === "round-trip" && returnDate) {
      params.set("returnDate", returnDate);
    }
    router.push(`/results?${params.toString()}`);
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-surface p-4 shadow-float">
        <div className="h-12 animate-pulse rounded-lg bg-muted" />
        <div className="mt-2 grid h-20 animate-pulse grid-cols-3 gap-2 rounded-lg bg-muted" />
      </div>
    );
  }

  return (
    <div className="animate-slide-up rounded-3xl bg-surface p-3 shadow-float ring-1 ring-border/70 sm:p-4">
      <div className="flex flex-col gap-3 border-b border-border px-1 pb-3 sm:flex-row sm:items-center sm:justify-between sm:px-2">
        <div>
          <p className="text-sm font-extrabold tracking-tight">Where are you headed?</p>
          <p className="text-xs text-muted-foreground">Choose your route and travel date.</p>
        </div>
        <Tabs value={tripType} onValueChange={(v) => setTripType(v as TripType)}>
          <TabsList className="rounded-full">
            <TabsTrigger value="one-way" className="rounded-full">One-way</TabsTrigger>
            <TabsTrigger value="round-trip" className="rounded-full">Round-trip</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-3 grid gap-2 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_auto] lg:items-center">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="flex-1">
            <CityCombobox
              cities={cities}
              value={originId}
              onChange={setOriginId}
              placeholder="From"
              label="From"
              excludeId={destinationId ?? undefined}
            />
          </div>

          <div className="flex items-center justify-center sm:block">
            <Button
              type="button"
              onClick={handleSwap}
              variant="outline"
              size="icon"
              aria-label="Swap origin and destination"
              className="hover-rotate -my-2 border-border bg-card text-muted-foreground shadow-card hover:border-primary hover:text-primary sm:my-0"
            >
              <ArrowLeftRight />
            </Button>
          </div>

          <div className="flex-1">
            <CityCombobox
              cities={cities}
              value={destinationId}
              onChange={setDestinationId}
              placeholder="To"
              label="To"
              excludeId={originId ?? undefined}
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="flex h-14 flex-1 items-center gap-3 rounded-xl px-3 transition-colors hover:bg-muted/70 sm:h-16 relative">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
              <CalendarDays className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-muted-foreground">Depart</span>
              <Popover open={departOpen} onOpenChange={setDepartOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-0.5 h-auto w-full min-w-0 justify-start p-0 text-left text-sm font-bold text-foreground shadow-none hover:bg-transparent"
                  >
                    {(() => { const d = parseISO(departureDate); return isValid(d) ? format(d, "dd MMM yyyy") : "Pick a date"; })()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={(() => { const d = parseISO(departureDate); return isValid(d) ? d : undefined; })()}
                    onSelect={(date) => { if (date) { setDepartureDate(format(date, "yyyy-MM-dd")); setDepartOpen(false); } }}
                    disabled={{ before: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            </span>
          </div>

          {tripType === "round-trip" ? (
            <div className="flex h-14 flex-1 items-center gap-3 rounded-xl px-3 transition-colors hover:bg-muted/70 sm:h-16 relative">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                <CalendarDays className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-muted-foreground">Return</span>
                <Popover open={returnOpen} onOpenChange={setReturnOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-0.5 h-auto w-full min-w-0 justify-start p-0 text-left text-sm font-bold text-foreground shadow-none hover:bg-transparent"
                    >
                      {(() => { const d = parseISO(returnDate); return isValid(d) ? format(d, "dd MMM yyyy") : "Pick a date"; })()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={(() => { const d = parseISO(returnDate); return isValid(d) ? d : undefined; })()}
                      onSelect={(date) => { if (date) { setReturnDate(format(date, "yyyy-MM-dd")); setReturnOpen(false); } }}
                      disabled={{ before: parseISO(departureDate) }}
                    />
                  </PopoverContent>
                </Popover>
              </span>
            </div>
          ) : (
            <div className="hidden xl:block" aria-hidden="true" />
          )}
        </div>

        <Button
          onClick={handleSearch}
          disabled={!canSearch}
          aria-label="Search buses"
          size="lg"
          className="h-14 w-full rounded-2xl px-5 sm:h-16 lg:w-auto"
        >
          <Search className="h-4 w-4" />
          <span>Search buses</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {sameCity && (
        <p className="px-3 pb-1 pt-3 text-sm font-medium text-destructive" role="alert">
          Choose two different cities to search this route.
        </p>
      )}
    </div>
  );
}
