"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, TrendingUp, Clock3, Armchair, BadgeCheck, Ticket } from "lucide-react";
import { formatVND, todayISO } from "@/lib/format";
import { POPULAR_ROUTES, type PopularRoute } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "cnfast";

export function PopularRoutes() {
  const router = useRouter();

  function searchRoute(route: PopularRoute) {
    const params = new URLSearchParams({
      origin: route.fromId,
      destination: route.toId,
      date: todayISO(),
      tripType: "one-way",
    });
    router.push(`/results?${params.toString()}`);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pb-12 sm:pt-20 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-primary">
            <TrendingUp className="h-4 w-4" />
            Popular this week
          </p>
          <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
            Routes travelers book again.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          Starting prices include taxes and booking fees. Pick a route to compare departure times.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {POPULAR_ROUTES.map((route, index) => (
          <Button
            key={`${route.fromId}-${route.toId}`}
            type="button"
            variant="ghost"
            aria-label={`Search buses from ${route.from} to ${route.to}`}
            style={{ "--stagger-index": Math.min(index, 5) } as React.CSSProperties}
            className={cn(
              "stagger-item hover-lift group relative flex flex-col items-stretch justify-between min-h-48 whitespace-normal overflow-hidden rounded-2xl border p-5 text-left transition-[box-shadow,border-color,background-color] duration-200 hover:border-primary/40 hover:shadow-card-hover active:scale-[0.98] h-auto font-normal shadow-none",
              index === 0 ? "border-primary/20 bg-primary-light/80 hover:bg-primary-light" : "border-border bg-card hover:bg-card/90"
            )}
            onClick={() => searchRoute(route)}
          >
            <div className="absolute -right-4 -top-6 select-none text-[5rem] font-black tracking-[-0.08em] text-foreground/[0.035]" aria-hidden="true">
              {route.code.slice(-3)}
            </div>
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div>
                <p className="text-xs font-bold tracking-[0.06em] text-muted-foreground">{route.code}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-extrabold tracking-tight">{route.from}</p>
                    <p className="mt-1 truncate text-lg font-extrabold tracking-tight">{route.to}</p>
                  </div>
                  <div className="relative ml-auto h-12 w-12 shrink-0 rounded-full border border-primary/30 bg-surface/70">
                    <span className="absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary" />
                    <span className="absolute bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border-2 border-primary bg-surface" />
                    <span className="absolute bottom-3.5 left-1/2 top-3.5 w-px -translate-x-1/2 bg-primary/45" />
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between gap-4 border-t border-border/70 pt-4">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5" />
                  {route.duration} · {route.direct ? "Direct" : "With stops"}
                </span>
                <span className="text-right">
                  <span className="block text-xs text-muted-foreground">From</span>
                  <span className="font-extrabold tabular-nums text-primary">{formatVND(route.fromPrice)}</span>
                </span>
              </div>
            </div>
            <ArrowRight className="absolute right-5 top-5 h-4 w-4 text-primary opacity-0 transition-[opacity,transform] group-hover:translate-x-1 group-hover:opacity-100" />
          </Button>
        ))}
      </div>

      <div className="mt-12 grid overflow-hidden rounded-2xl border border-border bg-muted/60 sm:grid-cols-3">
        <div className="flex gap-4 p-5 sm:p-6">
          <BadgeCheck className="h-5 w-5 shrink-0 text-success" />
          <div>
            <p className="text-sm font-bold">Compare clearly</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Times, operators, amenities, and the final price.</p>
          </div>
        </div>
        <div className="flex gap-4 border-t border-border p-5 sm:border-l sm:border-t-0 sm:p-6">
          <Armchair className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-bold">Choose your seat</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">The seat map matches the coach you selected.</p>
          </div>
        </div>
        <div className="flex gap-4 border-t border-border p-5 sm:border-l sm:border-t-0 sm:p-6">
          <Ticket className="h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-bold">Keep the ticket handy</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Your booking and boarding pass stay in one place.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
