"use client";

import { useState } from "react";
import { MapPin, Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "cnfast";
import { Button } from "@/components/ui/button";
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
}

export function CityCombobox({
  cities,
  value,
  onChange,
  placeholder,
  label,
  excludeId,
  compact = false,
}: CityComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedCity = cities.find((c) => c.id === value);
  const filteredCities = excludeId
    ? cities.filter((c) => c.id !== excludeId)
    : cities;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          role="combobox"
          aria-expanded={open}
          variant="ghost"
          className={cn(
            "group h-14 w-full justify-start gap-3 rounded-xl px-3 text-left shadow-none hover:bg-muted/70 sm:h-16",
            compact && "h-11 px-2.5 sm:h-11"
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            <MapPin className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-muted-foreground">{label}</span>
            <span className={cn("mt-0.5 block truncate font-bold text-foreground", compact ? "text-sm" : "text-base")}>
              {selectedCity ? selectedCity.name : placeholder}
            </span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-opacity group-hover:opacity-100 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {filteredCities.map((city) => (
                <CommandItem
                  key={city.id}
                  value={city.name}
                  onSelect={() => {
                    onChange(city.id);
                    setOpen(false);
                  }}
                >
                  <Search className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  {city.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {city.region}
                  </span>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value === city.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
