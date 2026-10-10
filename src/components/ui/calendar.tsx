"use client"

import * as React from "react"
import {
  DayPicker,
  type DayButton,
  type Locale,
} from "react-day-picker"
import { vi } from "date-fns/locale"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: string
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  locale = vi,
  formatters,
  components,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      captionLayout={captionLayout}
      formatters={{
        formatCaption: (date) => `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`,
        formatWeekdayName: (date) => ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()],
        ...formatters,
      }}
      className={cn(
        "group/calendar select-none p-3.5 bg-card text-card-foreground rounded-2xl",
        className
      )}
      classNames={{
        root: cn("w-fit", classNames?.root),
        months: cn("relative flex flex-col gap-4 sm:flex-row", classNames?.months),
        month: cn("flex flex-col gap-3", classNames?.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between pointer-events-none px-0.5 z-10",
          classNames?.nav
        ),
        button_previous: cn(
          "pointer-events-auto flex size-8 items-center justify-center rounded-xl border border-border/70 bg-background/90 text-muted-foreground shadow-2xs transition-all duration-150 hover:border-primary/50 hover:bg-muted hover:text-foreground active:scale-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer",
          classNames?.button_previous
        ),
        button_next: cn(
          "pointer-events-auto flex size-8 items-center justify-center rounded-xl border border-border/70 bg-background/90 text-muted-foreground shadow-2xs transition-all duration-150 hover:border-primary/50 hover:bg-muted hover:text-foreground active:scale-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer",
          classNames?.button_next
        ),
        month_caption: cn("flex h-8 items-center justify-center px-8", classNames?.month_caption),
        caption_label: cn("text-sm font-bold text-foreground select-none tracking-tight", classNames?.caption_label),
        month_grid: cn("w-full border-collapse", classNames?.month_grid),
        weekdays: cn("flex gap-1 mb-1.5", classNames?.weekdays),
        weekday: cn("size-9 flex items-center justify-center text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider select-none", classNames?.weekday),
        weeks: cn("flex flex-col gap-1", classNames?.weeks),
        week: cn("flex gap-1", classNames?.week),
        day: cn("p-0 text-center relative", classNames?.day),
        outside: cn("opacity-25 pointer-events-none", classNames?.outside),
        disabled: cn("text-muted-foreground/30 pointer-events-none", classNames?.disabled),
        hidden: cn("invisible", classNames?.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeft className={cn("size-4", className)} {...props} />
          }
          if (orientation === "right") {
            return <ChevronRight className={cn("size-4", className)} {...props} />
          }
          return <ChevronDown className={cn("size-4", className)} {...props} />
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isSelected = modifiers.selected
  const isDisabled = modifiers.disabled
  const isToday = modifiers.today
  const isOutside = modifiers.outside
  const isRangeStart = modifiers.range_start
  const isRangeEnd = modifiers.range_end
  const isRangeMiddle = modifiers.range_middle

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toISOString().slice(0, 10)}
      data-selected={isSelected ? "true" : undefined}
      data-disabled={isDisabled ? "true" : undefined}
      data-today={isToday ? "true" : undefined}
      className={cn(
        "relative flex size-9 items-center justify-center rounded-xl text-xs font-semibold select-none outline-none transition-[background-color,color,transform,box-shadow] duration-150",
        // Interactive unselected state
        !isSelected && !isDisabled && !isRangeMiddle && "text-foreground hover:bg-primary/10 hover:text-primary active:scale-90 cursor-pointer",
        // Today indicator when not selected
        isToday && !isSelected && "border border-primary/50 text-primary font-bold hover:bg-primary/10",
        // Single selected state
        isSelected && !isRangeMiddle && "bg-primary text-primary-foreground font-bold shadow-xs active:scale-95",
        // Range states
        isRangeStart && "rounded-r-none bg-primary text-primary-foreground font-bold",
        isRangeEnd && "rounded-l-none bg-primary text-primary-foreground font-bold",
        isRangeMiddle && "rounded-none bg-primary/15 text-primary font-semibold hover:bg-primary/20",
        // Disabled state (e.g. past dates)
        isDisabled && "text-muted-foreground/30 cursor-not-allowed pointer-events-none select-none",
        // Outside days
        isOutside && "opacity-25 pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
