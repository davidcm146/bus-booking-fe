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
  return null;
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
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          operator={operators.find((op) => op.id === trip.operatorId)}
        />
      ))}
    </div>
  );
}

export { TripSkeleton };
