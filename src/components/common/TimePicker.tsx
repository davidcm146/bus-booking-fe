"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "cnfast"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  className?: string
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hourStr, minuteStr] = value.split(":")
  const hour = parseInt(hourStr, 10) || 0
  const minute = parseInt(minuteStr, 10) || 0

  function setHour(h: number) {
    onChange(`${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`)
  }

  function setMinute(m: number) {
    onChange(`${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Select value={String(hour)} onValueChange={(v) => setHour(Number(v))}>
        <SelectTrigger className="w-[72px] justify-center text-center">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {HOURS.map((h) => (
            <SelectItem key={h} value={String(h)}>
              {String(h).padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-sm font-bold text-muted-foreground">:</span>
      <Select value={String(minute)} onValueChange={(v) => setMinute(Number(v))}>
        <SelectTrigger className="w-[72px] justify-center text-center">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MINUTES.map((m) => (
            <SelectItem key={m} value={String(m)}>
              {String(m).padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
