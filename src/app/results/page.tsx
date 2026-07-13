import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchParams } from "./search-params";

export const metadata: Metadata = {
  title: "Bus search results",
  description:
    "Compare bus trips across Vietnam — filter by operator, departure time, price, and amenities. Book sleeper coaches from Hà Nội to Sài Gòn.",
  alternates: {
    canonical: "/results",
  },
};

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      }
    >
      <SearchParams />
    </Suspense>
  );
}
