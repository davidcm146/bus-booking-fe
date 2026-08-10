"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  BellRing,
  CalendarDays,
  RefreshCcw,
} from "lucide-react";
import { cn } from "cnfast";
import { Button } from "@/components/ui/button";
import { BookingDesk } from "@/components/operator/BookingDesk";
import { FinanceManager } from "@/components/operator/FinanceManager";
import { FleetManager } from "@/components/operator/FleetManager";
import { NetworkManager } from "@/components/operator/NetworkManager";
import { OperatorOverview } from "@/components/operator/OperatorOverview";
import { TeamManager } from "@/components/operator/TeamManager";
import { TripBoard } from "@/components/operator/TripBoard";
import { WorkspaceSkeleton } from "@/components/operator/ManagementPrimitives";
import { OperatorProvider, useOperator } from "@/contexts/OperatorContext";
import { OPERATOR_SECTIONS, type OperatorSectionId } from "@/lib/constants";
import type { OperatorDashboardData } from "@/types/operator";

type SectionId = OperatorSectionId;

function initialCheckedInIds(data: OperatorDashboardData): ReadonlySet<string> {
  return new Set(
    data.bookings
      .filter((booking) => booking.checkedIn)
      .map((booking) => booking.id),
  );
}

function sectionContent(
  section: SectionId,
  data: OperatorDashboardData,
  setSection: (section: SectionId) => void,
  checkedInIds: ReadonlySet<string>,
  onCheckedIn: (bookingId: string) => void,
): ReactNode {
  switch (section) {
    case "overview":
      return (
        <OperatorOverview
          data={data}
          onOpenTrips={() => setSection("trips")}
          onOpenBookings={() => setSection("bookings")}
        />
      );
    case "trips":
      return <TripBoard />;
    case "bookings":
      return (
        <BookingDesk
          bookings={data.bookings}
          checkedInIds={checkedInIds}
          onCheckedIn={onCheckedIn}
        />
      );
    case "fleet":
      return <FleetManager />;
    case "network":
      return <NetworkManager />;
    case "team":
      return <TeamManager />;
    case "finance":
      return <FinanceManager />;
    default: {
      const unreachable: never = section;
      return unreachable;
    }
  }
}

function OperatorWorkspaceShell() {
  const { data, loading, resetData } = useOperator();
  const [section, setSection] = useState<SectionId>("overview");
  const [checkedInIds, setCheckedInIds] = useState<ReadonlySet<string>>(() =>
    initialCheckedInIds(data),
  );
  const sectionNavRef = useRef<HTMLElement>(null);
  useEffect(() => {
    sectionNavRef.current
      ?.querySelector<HTMLElement>('[aria-pressed="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [section]);
  function onCheckedIn(bookingId: string) {
    setCheckedInIds((current) => new Set(current).add(bookingId));
  }
  function resetWorkspace() {
    resetData();
    setCheckedInIds(initialCheckedInIds(data));
    setSection("overview");
  }

  return (
    <div className="min-h-[calc(100dvh-4.5rem)] bg-muted/35">
      <section className="border-b border-border bg-card text-card-foreground">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
                <span className="rounded-full bg-primary-light px-2.5 py-1 text-primary-dark">
                  {data.operatorCode}
                </span>
                <span>Synthetic demo data · Operator workspace</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
                Good morning, dispatch team.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Schedule service, manage network records, reconcile payments,
                and board passengers from one operational view.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-muted px-3.5 py-2.5 text-sm font-semibold">
                <CalendarDays className="size-4 text-primary" />
                {data.serviceDate}
              </div>
              <Button type="button" variant="outline" onClick={resetWorkspace}>
                <RefreshCcw className="size-4" />
                Reset demo
              </Button>
            </div>
          </div>
          <nav
            ref={sectionNavRef}
            className="no-scrollbar mt-7 flex gap-2 overflow-x-auto pb-1"
            aria-label="Operator workspace"
          >
            {OPERATOR_SECTIONS.map((item) => {
              const Icon = item.icon;
              const active = item.id === section;
              return (
                <Button
                  type="button"
                  key={item.id}
                  variant={active ? "default" : "ghost"}
                  onClick={() => setSection(item.id)}
                  aria-pressed={active}
                  className={cn(
                    "shrink-0",
                    !active && "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </section>
      <div className="border-b border-warning/20 bg-warning/10">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 sm:items-center sm:px-6 lg:px-8">
          <BellRing className="mt-0.5 size-4 shrink-0 text-warning sm:mt-0" />
          <p className="text-sm">
            <span className="font-bold">
              {data.alerts.length} items need attention.
            </span>{" "}
            <span>{data.alerts[0]?.title ?? "Operations are clear."}</span>
          </p>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setSection("overview")}
            className="ml-auto hidden shrink-0 sm:flex"
          >
            Review
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {loading ? (
          <WorkspaceSkeleton />
        ) : (
          <div key={section} className="animate-slide-up">
            {sectionContent(section, data, setSection, checkedInIds, onCheckedIn)}
          </div>
        )}
      </div>
    </div>
  );
}

export function OperatorWorkspace({
  data,
}: {
  readonly data: OperatorDashboardData;
}) {
  return (
    <OperatorProvider initialData={data}>
      <OperatorWorkspaceShell />
    </OperatorProvider>
  );
}
