"use client";

import { cn } from "cnfast";
import { Button } from "@/components/ui/button";

interface PriceCalendarProps {
  readonly currentDate: string;
  readonly onDateChange: (date: string) => void;
}

export function PriceCalendar({
  currentDate,
  onDateChange,
}: PriceCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const iso = `${y}-${m}-${day}`;
    return {
      iso,
      dayName: d.toLocaleDateString("en-GB", { weekday: "short" }),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString("en-GB", { month: "short" }),
      isToday: i === 0,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    };
  });

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
      {days.map((day) => {
        const isSelected = day.iso === currentDate;
        return (
          <Button
            key={day.iso}
            variant="ghost"
            onClick={() => onDateChange(day.iso)}
            className={cn(
              "h-auto min-w-[72px] shrink-0 flex-col gap-0 rounded-xl border px-3 py-2.5 shadow-none",
              isSelected
                ? "border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground"
                : "border-border bg-card hover:border-primary/30 hover:bg-muted/50 dark:hover:bg-muted/50"
            )}
          >
            <span className={cn(
              "text-[10px] font-medium leading-tight",
              isSelected ? "text-primary-foreground/85" : "text-muted-foreground"
            )}>
              {day.dayName}
            </span>
            <span className="text-base font-bold leading-tight tabular-nums">
              {day.dayNum} <span className={cn(
                "text-[10px] font-normal",
                isSelected ? "text-primary-foreground/85" : "text-muted-foreground"
              )}>{day.monthName}</span>
            </span>
            {day.isToday && (
              <span className={cn(
                "mt-0.5 text-[9px] font-semibold leading-tight",
                isSelected ? "text-primary-foreground" : "text-primary"
              )}>
                Today
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
