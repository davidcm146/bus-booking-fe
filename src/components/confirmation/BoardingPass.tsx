"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Plus, Share2, RotateCw, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cnfast";
import type { Booking } from "@/types/booking";
import type { Amenity } from "@/types";
import { getOperator } from "@/lib/services/searchService";
import { getCityName, formatVND, formatDuration } from "@/lib/format";
import { AMENITY_CONFIG } from "@/lib/constants";


function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

export function BoardingPass({ booking }: { booking: Booking }) {
  const router = useRouter();
  const { trip, seats, passengers, bookingRef } = booking;
  const [flipped, setFlipped] = useState(false);

  const operator = getOperator(trip.operatorId);

  const opName = operator?.name ?? "BusGo";
  const opInitial = opName.charAt(0);
  const opColor = operator?.logoColor ?? "#087f5b";

  // Timeline stops
  const timeline: { city: string; time: string; isOrigin: boolean; isDest: boolean }[] = [
    { city: getCityName(trip.originId), time: trip.departureTime, isOrigin: true, isDest: false },
    ...trip.stops.slice(1, -1).map((stop) => ({
      city: getCityName(stop.cityId),
      time: stop.time,
      isOrigin: false,
      isDest: false,
    })),
    { city: getCityName(trip.destinationId), time: trip.arrivalTime, isOrigin: false, isDest: true },
  ];

  const stopCount = timeline.length;
  const progressPercent = 100 / stopCount;

  return (
    <>
      {/* ===== Desktop: horizontal boarding pass (hidden on mobile) ===== */}
      <div className="hidden w-full max-w-3xl mx-auto sm:block">
        <div className="mx-auto w-full max-w-3xl">
          {/* Boarding pass — classic tear-off ticket */}
          <div
            className="relative overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_12px_32px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.06)]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, color-mix(in oklch, var(--primary) 3%, transparent), transparent 40%),
                radial-gradient(circle at 80% 70%, rgba(245,158,11,0.03), transparent 40%),
                repeating-linear-gradient(45deg, rgba(0,0,0,0.012) 0 2px, transparent 2px 6px)
              `,
            }}
          >
            <div className="relative grid grid-cols-[1.55fr_1fr]">
              {/* LEFT STUB */}
              <div className="relative z-10 p-[26px_28px]">
                <div className="mb-[18px] flex items-center gap-2.5">
                  <div
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-[15px] font-extrabold text-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
                    style={{ background: `linear-gradient(135deg, ${opColor}, ${opColor}dd)` }}
                  >
                    {opInitial}
                  </div>
                  <div>
                    <div className="text-[15px] font-bold leading-tight">{opName}</div>
                    <div className="text-[11px] text-text-subtle">Express · InterCity</div>
                  </div>
                </div>

                <div className="mb-[18px] mt-1.5 flex items-center gap-3.5">
                  <div>
                    <div className="text-[24px] font-extrabold leading-none tracking-[-0.02em]">
                      {getCityName(trip.originId)}
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.04em] text-muted-foreground">
                      Depart {trip.departureTime}
                    </div>
                  </div>
                  <div className="relative h-0.5 flex-1 bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_6px,transparent_6px_11px)]">
                    <div
                      className="absolute -top-[5px] right-[-2px] h-0 w-0"
                      style={{
                        borderLeft: "8px solid var(--color-border-strong)",
                        borderTop: "6px solid transparent",
                        borderBottom: "6px solid transparent",
                      }}
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-1/2 top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 bg-background p-0.5 text-primary">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-[24px] font-extrabold leading-none tracking-[-0.02em]">
                      {getCityName(trip.destinationId)}
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.04em] text-muted-foreground">
                      Arrive {trip.arrivalTime}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3.5 border-t border-border pt-4">
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-[0.08em] text-text-subtle">Passenger</div>
                    <div className="text-[15px] font-bold">{passengers[0]?.name ?? "Guest"}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-[0.08em] text-text-subtle">Date</div>
                    <div className="text-[15px] font-bold">{formatDate(trip.date)}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-[0.08em] text-text-subtle">Duration</div>
                    <div className="text-[15px] font-bold">{formatDuration(trip.durationMinutes)}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-[0.08em] text-text-subtle">Seats</div>
                    <div className="font-mono text-[15px] font-bold">{seats.map((s) => s.label).join(" · ")}</div>
                  </div>
                </div>
              </div>

              {/* RIGHT STUB (perforated) */}
              <div className="relative z-10 flex flex-col items-center border-l-2 border-dashed border-border-strong p-[26px_28px] text-center">
                <div className="absolute -left-[11px] -top-2.5 h-5 w-5 rounded-full bg-background shadow-[inset_0_0_0_1px_var(--color-border)]" />
                <div className="absolute -left-[11px] -bottom-2.5 h-5 w-5 rounded-full bg-background shadow-[inset_0_0_0_1px_var(--color-border)]" />
                <div className="relative my-1.5 h-[160px] w-[160px]">
                  <QRPattern />
                </div>
                <div className="rounded-full bg-primary-light px-3.5 py-1.5 font-mono text-[18px] font-bold tracking-[0.04em] text-foreground">
                  {bookingRef}
                </div>
                <div className="mt-2.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Show at boarding
                </div>
              </div>
            </div>
          </div>

          {/* Trip timeline */}
          <div className="mt-[26px] rounded-[14px] border border-border bg-surface p-[22px_24px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-text-subtle">
              Trip timeline
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="relative grid gap-2" style={{ gridTemplateColumns: `repeat(${stopCount}, 1fr)` }}>
              <div
                className="absolute top-[7px] h-0.5"
                style={{
                  left: `${100 / (stopCount * 2)}%`,
                  right: `${100 / (stopCount * 2)}%`,
                  background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${progressPercent}%, var(--color-border-strong) ${progressPercent}%)`,
                }}
              />
              {timeline.map((stop) => (
                <div key={`${stop.city}-${stop.time}`} className="relative text-center">
                  <div
                    className={cn(
                      "relative z-10 mx-auto mb-2.5 h-4 w-4 rounded-full border-[3px]",
                      stop.isOrigin || stop.isDest
                        ? "border-primary bg-primary"
                        : "border-border-strong bg-surface",
                      stop.isDest && "shadow-[0_0_0_4px_var(--color-primary-light)]"
                    )}
                  />
                  <div className="text-sm font-bold">{stop.city}</div>
                  <div className="font-mono text-xs text-muted-foreground">{stop.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="mt-[26px] rounded-[14px] border border-border bg-surface p-[22px_24px] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
            <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-text-subtle">
              Onboard amenities
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-wrap gap-3">
              {trip.amenities.map((amenity) => {
                const { icon: Icon, short } = AMENITY_CONFIG[amenity];
                return (
                  <span key={amenity} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-[13px] font-semibold text-foreground">
                    <Icon className="h-4 w-4 text-primary" />
                    {short}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-[26px] flex flex-wrap gap-3">
            <Button onClick={() => window.print()} size="lg" className="hover-lift hover-lift-sm min-w-[140px] flex-1 shadow-card-hover">
              <Download />
              Download PDF
            </Button>
            <Button onClick={() => router.push("/bookings")} variant="outline" size="lg" className="min-w-[140px] flex-1 hover:border-primary hover:text-primary">
              <Share2 />
              My bookings
            </Button>
            <Button onClick={() => router.push("/")} variant="outline" size="lg" className="min-w-[140px] flex-1 hover:border-primary hover:text-primary">
              <Plus />
              Book another
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Mobile: vertical flip card (hidden on desktop) ===== */}
      <div className="mx-auto w-full max-w-md sm:hidden">
        <div
          className={cn("flip-card transition-transform active:scale-[0.98]", flipped && "is-flipped")}
          onClick={() => setFlipped((f) => !f)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setFlipped((value) => !value);
            }
          }}
          aria-label="Flip card for details"
        >
          <div className="flip-card__inner relative">
            {/* FRONT */}
            <div className="flip-card__face relative overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_12px_32px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col items-center px-6 pb-5 pt-8 text-center">
                <svg viewBox="0 0 80 80" className="mb-3 h-16 w-16">
                  <circle className="check-circle" cx="40" cy="40" r="35" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" />
                  <path className="check-tick" d="M24 41l11 11 22-22" fill="none" stroke="var(--color-primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-xl font-extrabold">You&apos;re all set</div>
                <div className="mt-1 font-mono text-sm text-muted-foreground">{bookingRef}</div>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Confirmed
                </div>
              </div>

              <div className="space-y-5 px-6 pb-6">
                {/* Vertical timeline */}
                <div>
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-subtle">Route progress</div>
                  <div className="relative pl-6">
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
                    <div className="absolute left-[7px] top-2 w-0.5 bg-primary" style={{ height: "12%" }} />
                    {timeline.map((stop) => (
                      <div key={`${stop.city}-${stop.time}`} className="relative pb-5 last:pb-0">
                        <div className={cn(
                          "absolute -left-6 top-0.5 h-4 w-4 rounded-full border-2",
                          stop.isOrigin ? "border-primary bg-primary"
                          : stop.isDest ? "border-primary bg-primary shadow-[0_0_0_4px_var(--color-primary-light)]"
                          : "border-border-strong bg-surface"
                        )} />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">{stop.city}</span>
                          <span className="font-mono text-sm text-muted-foreground">{stop.time}</span>
                        </div>
                        <div className="mt-0.5 text-[11px] text-text-subtle">
                          {stop.isOrigin ? "Departure" : stop.isDest ? "Destination" : "Stop"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QR */}
                <div className="flex flex-col items-center rounded-2xl border border-border bg-muted/30 py-5">
                  <div className="h-[140px] w-[140px]"><QRPattern /></div>
                  <div className="mt-3 rounded-full bg-primary-light px-4 py-1.5 font-mono text-base font-bold tracking-wider text-foreground">{bookingRef}</div>
                  <div className="mt-1.5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Show at boarding</div>
                </div>

                {/* Seats */}
                <div>
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-subtle">Your seats</div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {seats.map((seat, i) => (
                      <div key={seat.label} className="rounded-xl border border-border bg-background p-3">
                        <div className="font-mono text-lg font-bold text-primary">{seat.label}</div>
                        <div className="truncate text-xs text-muted-foreground">{passengers[i]?.name || "Passenger"}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operator */}
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold text-white" style={{ background: `linear-gradient(135deg, ${opColor}, ${opColor}dd)` }}>
                    {opInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold">{opName}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <span className="font-semibold">{operator?.rating.toFixed(1) ?? "4.5"}</span>
                      <span>· {formatDuration(trip.durationMinutes)}</span>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2">
                  {trip.amenities.map((amenity) => {
                    const { icon: Icon, short } = AMENITY_CONFIG[amenity];
                    return (
                      <span key={amenity} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        {short}
                      </span>
                    );
                  })}
                </div>

                <Button onClick={(e) => { e.stopPropagation(); setFlipped(true); }} variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary">
                  <RotateCw className="h-3 w-3" />
                  Tap card for trip details
                </Button>
              </div>
            </div>

            {/* BACK */}
            <div className="flip-card__face flip-card__face--back absolute inset-0 overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_12px_32px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between px-6 pb-4 pt-6">
                <Button onClick={(e) => { e.stopPropagation(); setFlipped(false); }} variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <ArrowLeft />
                  Back
                </Button>
                <span className="font-mono text-xs text-text-subtle">{bookingRef}</span>
              </div>

              <div className="space-y-5 px-6 pb-6">
                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-extrabold">{getCityName(trip.originId)}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{trip.departureTime}</div>
                    </div>
                    <div className="flex-1 px-3">
                      <div className="relative h-0.5 bg-[repeating-linear-gradient(to_right,var(--color-border-strong)_0_4px,transparent_4px_8px)]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 bg-surface p-0.5 text-primary">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-extrabold">{getCityName(trip.destinationId)}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{trip.arrivalTime}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-background p-3.5">
                    <div className="mb-1 text-[10px] uppercase tracking-wider text-text-subtle">Date</div>
                    <div className="text-sm font-bold">{formatDate(trip.date)}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3.5">
                    <div className="mb-1 text-[10px] uppercase tracking-wider text-text-subtle">Duration</div>
                    <div className="text-sm font-bold">{formatDuration(trip.durationMinutes)}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3.5">
                    <div className="mb-1 text-[10px] uppercase tracking-wider text-text-subtle">Bus type</div>
                    <div className="text-sm font-bold capitalize">{trip.busType}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3.5">
                    <div className="mb-1 text-[10px] uppercase tracking-wider text-text-subtle">Seats</div>
                    <div className="font-mono text-sm font-bold">{seats.map((s) => s.label).join(", ")}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <span className="text-sm font-medium text-muted-foreground">Total paid</span>
                  <span className="text-xl font-extrabold text-primary">{formatVND(trip.price * seats.length)}</span>
                </div>

                <div>
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-subtle">Passengers</div>
                  <div className="space-y-2">
                    {passengers.map((p, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {p.name?.charAt(0) ?? "?"}
                          </div>
                          <span className="text-sm font-semibold">{p.name || "Passenger"}</span>
                        </div>
                        <span className="font-mono text-sm text-muted-foreground">{seats[i]?.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={(e) => { e.stopPropagation(); setFlipped(false); }} variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-primary">
                  <RotateCw className="h-3 w-3" />
                  Tap to flip back
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile action buttons */}
        <div className="mt-5 flex gap-3">
          <Button onClick={() => window.print()} size="lg" className="hover-lift hover-lift-sm flex-1 shadow-card-hover">
            <Download />
            Download
          </Button>
          <Button onClick={() => router.push("/bookings")} variant="outline" size="lg" className="flex-1 hover:border-primary hover:text-primary">
            <Share2 />
            My bookings
          </Button>
          <Button onClick={() => router.push("/")} variant="outline" size="lg" className="flex-1 hover:border-primary hover:text-primary">
            <Plus />
            Book another
          </Button>
        </div>
      </div>
    </>
  );
}

/** QR code — 21x21 grid with 3 corner finder patterns + center logo */
function isFinderCell(row: number, column: number): boolean {
  return (row < 7 && column < 7) ||
    (row < 7 && column >= 14) ||
    (row >= 14 && column < 7);
}

function QRPattern() {
  const seed = 42;
  const cells: boolean[] = [];
  for (let i = 0; i < 21 * 21; i++) {
    cells.push(((seed * (i + 1) * 9301 + 49297) % 233280) / 233280 > 0.5);
  }

  return (
    <div
      className="relative grid h-full w-full gap-px rounded-lg bg-surface p-2 shadow-[inset_0_0_0_1px_var(--color-border)]"
      style={{ gridTemplateColumns: "repeat(21, 1fr)", gridTemplateRows: "repeat(21, 1fr)" }}
    >
      {cells.map((on, i) => {
        const r = Math.floor(i / 21);
        const c = i % 21;
        let filled = on;
        if (isFinderCell(r, c)) {
          const localR = r < 7 ? r : r - 14;
          const localC = c < 7 ? c : c >= 14 ? c - 14 : c;
          if (localR === 0 || localR === 6 || localC === 0 || localC === 6) filled = true;
          else if (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4) filled = true;
          else filled = false;
        }
        return (
          <div key={i} className="rounded-[1px]" style={{ background: filled ? "var(--color-foreground)" : "transparent" }} />
        );
      })}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex h-[26%] w-[26%] items-center justify-center rounded-lg bg-primary shadow-[0_0_0_4px_var(--color-surface)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-[60%] w-[60%] text-primary-foreground">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v1" />
          </svg>
        </div>
      </div>
    </div>
  );
}
