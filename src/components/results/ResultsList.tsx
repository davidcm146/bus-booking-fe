"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchX } from "lucide-react";
import { TripCard } from "./TripCard";
import type { Trip, Operator } from "@/types";

interface ResultsListProps {
  readonly trips: readonly Trip[];
  readonly operators: readonly Operator[];
}

function TripSkeleton() {
  return (
    <Card className="flex animate-pulse flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-5">
        <div className="h-12 w-12 rounded-xl bg-muted" />
        <div className="space-y-2">
          <div className="h-6 w-16 rounded bg-muted" />
          <div className="h-3 w-12 rounded bg-muted" />
        </div>
        <div className="h-6 w-16 rounded bg-muted" />
        <div className="h-1 w-20 rounded bg-muted" />
        <div className="h-6 w-16 rounded bg-muted" />
      </div>
      <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-end">
        <div className="h-8 w-16 rounded bg-muted" />
        <div className="h-8 w-20 rounded bg-muted" />
      </div>
    </Card>
  );
}

export function ResultsList({ trips, operators }: ResultsListProps) {
  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/40 p-12 text-center sm:p-16">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary">
          <SearchX className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-xl font-extrabold tracking-tight">No coaches found for this route</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Try a different date using the calendar above, or search a nearby city.
          Routes run daily between major cities.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Search again</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {trips.map((trip, index) => (
        <div
          key={trip.id}
          className="stagger-item"
          style={{ "--stagger-index": Math.min(index, 5) } as React.CSSProperties}
        >
          <TripCard
            trip={trip}
            operator={operators.find((op) => op.id === trip.operatorId)}
          />
        </div>
      ))}
    </div>
  );
}

export { TripSkeleton };
