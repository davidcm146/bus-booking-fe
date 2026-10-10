"use client";

import { useState } from "react";
import { MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { City } from "@/types";

interface CityComboboxProps {
  readonly cities: readonly City[];
  value: string | null;
  onChange: (cityId: string) => void;
  placeholder: string;
  label: string;
  excludeId?: string;
  compact?: boolean;
  className?: string;
  rightElement?: React.ReactNode;
}

const REGIONS = ["Miền Bắc", "Miền Trung", "Miền Nam"] as const;

export function CityCombobox({
  cities,
  value,
  onChange,
  placeholder,
  label,
  excludeId,
  compact = false,
  className,
  rightElement,
}: CityComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedCity = cities.find((c) => c.id === value);
  const filteredCities = excludeId
    ? cities.filter((c) => c.id !== excludeId)
    : cities;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "group relative flex h-[60px] w-full items-center gap-2 rounded-2xl border border-border/80 bg-background px-2.5 text-left transition-[border-color,background-color,transform] duration-150 ease-out hover:border-primary/50 hover:bg-muted/30 active:scale-[0.98] sm:h-[68px] lg:px-2.5 lg:gap-2 2xl:px-3.5 2xl:gap-3",
            compact && "h-11 px-2.5 sm:h-11 rounded-xl sm:px-2.5 sm:gap-2",
            className
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary shadow-2xs sm:h-9 sm:w-9">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold text-muted-foreground sm:text-xs">{label}</span>
            <span className={cn("mt-0.5 block truncate font-bold text-foreground text-xs sm:text-xs xl:text-[13px] 2xl:text-sm", compact && "text-xs")}>
              {selectedCity ? selectedCity.name : placeholder}
            </span>
          </span>
          {rightElement}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(340px,var(--radix-popover-trigger-width))] rounded-2xl border border-border/80 bg-card p-1 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
        align="start"
      >
        <Command value={selectedCity?.name ?? ""}>
          <CommandInput placeholder="Tìm tỉnh, thành phố..." />
          <CommandList className="max-h-72 scroll-py-1">
            <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
              Không tìm thấy tỉnh hoặc thành phố phù hợp.
            </CommandEmpty>
            {REGIONS.map((region) => {
              const regionCities = filteredCities.filter((c) => c.region === region);
              if (regionCities.length === 0) return null;
              return (
                <CommandGroup key={region} heading={region} className="px-1 py-1">
                  {regionCities.map((city) => {
                    const isSelected = selectedCity?.id === city.id;
                    return (
                      <CommandItem
                        key={city.id}
                        value={city.name}
                        keywords={[city.region]}
                        onSelect={() => {
                          onChange(city.id);
                          setOpen(false);
                        }}
                        className={cn(
                          isSelected && "bg-primary/10 text-primary font-bold data-[selected=true]:bg-primary/20"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <MapPin
                            className={cn(
                              "h-3.5 w-3.5 shrink-0",
                              isSelected ? "text-primary" : "text-muted-foreground/60"
                            )}
                          />
                          <span className="truncate">{city.name}</span>
                        </div>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-primary shrink-0 stroke-[2.5]" />
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
