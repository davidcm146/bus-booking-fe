"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Search, CalendarDays, ArrowRight } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CityCombobox } from "./CityCombobox";
import { useCities } from "@/hooks/useCities";
import { todayISO } from "@/lib/format";
import type { TripType } from "@/types";

export function SearchForm() {
  const router = useRouter();
  const { cities } = useCities();

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

  const swapButton = (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        handleSwap();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          handleSwap();
        }
      }}
      title="Đổi chiều điểm đi và điểm đến"
      aria-label="Đổi chiều điểm đi và điểm đến"
      className="hover-rotate flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/60 text-muted-foreground transition-all duration-200 ease-out hover:border-primary/50 hover:bg-primary/10 hover:text-primary active:scale-90 sm:h-7.5 sm:w-7.5 sm:rounded-xl"
    >
      <ArrowLeftRight className="h-3.5 w-3.5" />
    </span>
  );

  return (
    <div className="animate-slide-up rounded-3xl bg-surface p-4 shadow-float ring-1 ring-border/70 sm:p-5">
      {/* Header with Title and High-contrast Mode Switcher */}
      <div className="flex flex-col gap-3.5 border-b border-border/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-extrabold tracking-tight sm:text-lg">Bạn muốn đi đâu?</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Chọn điểm đi, điểm đến và thời gian khởi hành phù hợp.</p>
        </div>

        {/* High-contrast, tactile switcher - full width on mobile, compact on desktop */}
        <div className="grid w-full grid-cols-2 items-center rounded-xl border border-border/70 bg-muted/90 p-1 shadow-2xs sm:w-fit sm:flex">
          <button
            type="button"
            onClick={() => setTripType("one-way")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all duration-150 ease-out active:scale-[0.97] sm:px-4",
              tripType === "one-way"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Một chiều
          </button>
          <button
            type="button"
            onClick={() => setTripType("round-trip")}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all duration-150 ease-out active:scale-[0.97] sm:px-4",
              tripType === "round-trip"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Khứ hồi
          </button>
        </div>
      </div>

      {/* Search Grid */}
      {tripType === "one-way" ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
          {/* Origin */}
          <div>
            <CityCombobox
              cities={cities}
              value={originId}
              onChange={setOriginId}
              placeholder="Chọn điểm đi"
              label="Điểm xuất phát"
              excludeId={destinationId ?? undefined}
              rightElement={swapButton}
            />
          </div>

          {/* Destination */}
          <div>
            <CityCombobox
              cities={cities}
              value={destinationId}
              onChange={setDestinationId}
              placeholder="Chọn điểm đến"
              label="Điểm đến"
              excludeId={originId ?? undefined}
            />
          </div>

          {/* Departure Date */}
          <div>
            <Popover open={departOpen} onOpenChange={setDepartOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="group relative flex h-[60px] w-full items-center gap-2 rounded-2xl border border-border/80 bg-background px-2.5 text-left transition-[border-color,background-color,transform] duration-150 ease-out hover:border-primary/50 hover:bg-muted/30 active:scale-[0.98] sm:h-[68px] lg:px-2.5 lg:gap-2 2xl:px-3.5 2xl:gap-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary shadow-2xs sm:h-9 sm:w-9">
                    <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold text-muted-foreground sm:text-xs">Ngày đi</span>
                    <span className="mt-0.5 block truncate text-xs font-bold text-foreground tabular-nums sm:text-xs xl:text-[13px] 2xl:text-sm">
                      {(() => {
                        const d = parseISO(departureDate);
                        return isValid(d) ? format(d, "dd/MM/yyyy") : "Chọn ngày";
                      })()}
                    </span>
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border border-border shadow-xl ring-1 ring-black/5 dark:ring-white/10" align="start">
                <Calendar
                  mode="single"
                  selected={(() => {
                    const d = parseISO(departureDate);
                    return isValid(d) ? d : undefined;
                  })()}
                  onSelect={(date) => {
                    if (date) {
                      setDepartureDate(format(date, "yyyy-MM-dd"));
                      setDepartOpen(false);
                    }
                  }}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={!canSearch}
              aria-label="Tìm chuyến xe"
              className={cn(
                "flex h-[60px] w-full items-center justify-center gap-2 rounded-2xl border border-transparent px-4 text-sm font-bold transition-[transform,background-color,box-shadow,opacity] duration-150 ease-out active:scale-[0.98] sm:h-[68px] sm:text-base",
                canSearch
                  ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 cursor-pointer"
                  : "border-border/60 bg-muted/70 text-muted-foreground shadow-none opacity-80 cursor-not-allowed"
              )}
            >
              <Search className="h-4 w-4" />
              <span>Tìm chuyến xe</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-center">
          {/* Origin */}
          <div className="sm:col-span-1 lg:col-span-1">
            <CityCombobox
              cities={cities}
              value={originId}
              onChange={setOriginId}
              placeholder="Chọn điểm đi"
              label="Điểm xuất phát"
              excludeId={destinationId ?? undefined}
              rightElement={swapButton}
            />
          </div>

          {/* Destination */}
          <div className="sm:col-span-1 lg:col-span-1">
            <CityCombobox
              cities={cities}
              value={destinationId}
              onChange={setDestinationId}
              placeholder="Chọn điểm đến"
              label="Điểm đến"
              excludeId={originId ?? undefined}
            />
          </div>

          {/* Departure Date */}
          <div className="sm:col-span-1 lg:col-span-1">
            <Popover open={departOpen} onOpenChange={setDepartOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="group relative flex h-[60px] w-full items-center gap-2 rounded-2xl border border-border/80 bg-background px-2.5 text-left transition-[border-color,background-color,transform] duration-150 ease-out hover:border-primary/50 hover:bg-muted/30 active:scale-[0.98] sm:h-[68px] lg:px-2.5 lg:gap-2 2xl:px-3.5 2xl:gap-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary shadow-2xs sm:h-9 sm:w-9">
                    <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold text-muted-foreground sm:text-xs">Ngày đi</span>
                    <span className="mt-0.5 block truncate text-xs font-bold text-foreground tabular-nums sm:text-xs xl:text-[13px] 2xl:text-sm">
                      {(() => {
                        const d = parseISO(departureDate);
                        return isValid(d) ? format(d, "dd/MM/yyyy") : "Chọn ngày";
                      })()}
                    </span>
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border border-border shadow-xl ring-1 ring-black/5 dark:ring-white/10" align="start">
                <Calendar
                  mode="single"
                  selected={(() => {
                    const d = parseISO(departureDate);
                    return isValid(d) ? d : undefined;
                  })()}
                  onSelect={(date) => {
                    if (date) {
                      setDepartureDate(format(date, "yyyy-MM-dd"));
                      setDepartOpen(false);
                    }
                  }}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date */}
          <div className="sm:col-span-1 lg:col-span-1">
            <Popover open={returnOpen} onOpenChange={setReturnOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="group relative flex h-[60px] w-full items-center gap-2 rounded-2xl border border-border/80 bg-background px-2.5 text-left transition-[border-color,background-color,transform] duration-150 ease-out hover:border-primary/50 hover:bg-muted/30 active:scale-[0.98] sm:h-[68px] lg:px-2.5 lg:gap-2 2xl:px-3.5 2xl:gap-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary shadow-2xs sm:h-9 sm:w-9">
                    <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold text-muted-foreground sm:text-xs">Ngày về</span>
                    <span className="mt-0.5 block truncate text-xs font-bold text-foreground tabular-nums sm:text-xs xl:text-[13px] 2xl:text-sm">
                      {(() => {
                        const d = parseISO(returnDate);
                        return isValid(d) ? format(d, "dd/MM/yyyy") : "Chọn ngày";
                      })()}
                    </span>
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border border-border shadow-xl ring-1 ring-black/5 dark:ring-white/10" align="start">
                <Calendar
                  mode="single"
                  selected={(() => {
                    const d = parseISO(returnDate);
                    return isValid(d) ? d : undefined;
                  })()}
                  onSelect={(date) => {
                    if (date) {
                      setReturnDate(format(date, "yyyy-MM-dd"));
                      setReturnOpen(false);
                    }
                  }}
                  disabled={{ before: parseISO(departureDate) }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-1">
            <button
              type="button"
              onClick={handleSearch}
              disabled={!canSearch}
              aria-label="Tìm chuyến xe"
              className={cn(
                "flex h-[60px] w-full items-center justify-center gap-2 rounded-2xl border border-transparent px-4 text-sm font-bold transition-[transform,background-color,box-shadow,opacity] duration-150 ease-out active:scale-[0.98] sm:h-[68px] sm:text-base",
                canSearch
                  ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 cursor-pointer"
                  : "border-border/60 bg-muted/70 text-muted-foreground shadow-none opacity-80 cursor-not-allowed"
              )}
            >
              <Search className="h-4 w-4" />
              <span>Tìm chuyến xe</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {sameCity && (
        <p className="px-3 pb-1 pt-3 text-sm font-medium text-destructive" role="alert">
          Vui lòng chọn 2 điểm đi và điểm đến khác nhau.
        </p>
      )}
    </div>
  );
}
