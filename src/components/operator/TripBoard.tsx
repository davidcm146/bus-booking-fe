"use client";

import { useMemo, useState } from "react";
import {
  BusFront,
  Clock3,
  MapPin,
  Pencil,
  Play,
  Trash2,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DeleteDialog,
  EmptyCollection,
  ManagerHeader,
  PaginationBar,
} from "@/components/operator/ManagementPrimitives";
import { StatusBadge } from "@/components/operator/StatusBadge";
import { TripEditorSheet } from "@/components/operator/TripEditorSheet";
import { useOperator } from "@/contexts/OperatorContext";
import { usePagination } from "@/hooks/usePagination";
import { formatVND } from "@/lib/format";
import type { OperatorTrip, TripStatus } from "@/types/operator";
import { TRIP_STATUSES } from "@/types/operator";

const TRIP_FILTERS = ["all", ...TRIP_STATUSES] as const;

function isTripFilter(value: string): value is TripStatus | "all" {
  return (TRIP_FILTERS as readonly string[]).includes(value);
}

export function TripBoard() {
  const { data, saveTrip, deleteTrip, pendingKey } = useOperator();
  const [filter, setFilter] = useState<TripStatus | "all">("all");
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [editingTrip, setEditingTrip] = useState<OperatorTrip | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deletingTrip, setDeletingTrip] = useState<OperatorTrip | null>(null);
  const visibleTrips = useMemo(
    () =>
      filter === "all"
        ? data.trips
        : data.trips.filter((trip) => trip.status === filter),
    [data.trips, filter],
  );
  const pagination = usePagination(visibleTrips, 3);

  function openEditor(trip: OperatorTrip | null) {
    setEditingTrip(trip);
    setEditorOpen(true);
  }

  async function transitionTrip(trip: OperatorTrip) {
    const nextStatus: TripStatus =
      trip.status === "scheduled" ? "running" : "completed";
    await saveTrip({ ...trip, status: nextStatus });
  }

  async function confirmDelete() {
    if (!deletingTrip) return;
    await deleteTrip(deletingTrip.id);
    setDeletingTrip(null);
  }

  return (
    <div className="space-y-5">
      <ManagerHeader
        title="Trip operations"
        description="Schedule departures, assign vehicles, update dispatch status, and inspect manifests."
        actionLabel="Schedule trip"
        onAction={() => openEditor(null)}
      />
      <div className="flex justify-end">
        <Select
          value={filter}
          onValueChange={(value) => {
            if (isTripFilter(value)) {
              setFilter(value);
              pagination.setPage(1);
              setSelectedTripId(null);
            }
          }}
        >
          <SelectTrigger
            className="w-full sm:w-44"
            aria-label="Filter trips by status"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All trips</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {visibleTrips.length === 0 ? (
        <EmptyCollection
          title={filter === "all" ? "No trips scheduled" : `No ${filter} trips`}
          description="Create a departure or switch the status filter."
          actionLabel="Schedule trip"
          onAction={() => openEditor(null)}
        />
      ) : (
        <Card className="gap-0 py-0 shadow-card">
          <CardContent className="space-y-3 p-3 sm:p-4">
            {pagination.pageItems.map((trip) => {
              const occupancy = Math.round(
                (trip.bookedSeats / trip.totalSeats) * 100,
              );
              const selected = selectedTripId === trip.id;
              const transitioning = pendingKey === `trip:${trip.id}`;
              return (
                <div
                  key={trip.id}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="grid gap-4 p-4 lg:grid-cols-[8rem_1.4fr_1fr_auto] lg:items-center">
                    <div className="flex items-center gap-3 lg:flex lg:flex-col lg:items-start lg:gap-1.5">
                      <div>
                        <p className="text-2xl font-extrabold tabular-nums">
                          {trip.departureTime}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          arrives {trip.arrivalTime}
                        </p>
                      </div>
                      <StatusBadge
                        label={trip.status}
                        tone={
                          trip.status === "running"
                            ? "positive"
                            : trip.status === "cancelled"
                              ? "critical"
                              : "neutral"
                        }
                      />
                    </div>
                    <div>
                      <p className="font-extrabold">{trip.routeName}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {trip.originStop}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BusFront className="size-3" />
                        {trip.vehiclePlate} · {trip.vehicleType}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold">{occupancy}% occupied</span>
                        <span className="text-muted-foreground">
                          {trip.availableSeats} available
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {trip.heldSeats} held · {formatVND(trip.basePrice)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedTripId(selected ? null : trip.id)
                        }
                        aria-expanded={selected}
                        aria-controls={`trip-manifest-${trip.id}`}
                      >
                        {selected ? "Close" : "Manifest"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${trip.routeName}`}
                        onClick={() => openEditor(trip)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        aria-label={`Delete ${trip.routeName}`}
                        onClick={() => setDeletingTrip(trip)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                      {trip.status === "scheduled" ||
                      trip.status === "running" ? (
                        <Button
                          type="button"
                          size="sm"
                          disabled={transitioning}
                          onClick={() => transitionTrip(trip)}
                        >
                          <Play className="size-3.5" />
                          {trip.status === "scheduled"
                            ? "Dispatch"
                            : "Complete"}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  {selected ? (
                    <div
                      id={`trip-manifest-${trip.id}`}
                      className="grid gap-5 border-t border-primary/20 bg-primary-light/20 p-4 sm:grid-cols-3"
                    >
                      <div>
                        <p className="text-xs font-bold text-muted-foreground">
                          DRIVER
                        </p>
                        <p className="mt-2 font-extrabold">{trip.driverName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Assigned to {trip.vehiclePlate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground">
                          BOARDING
                        </p>
                        <p className="mt-2 flex items-center gap-2 font-extrabold">
                          <Clock3 className="size-4 text-primary" />
                          {trip.departureTime}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {trip.originStop}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground">
                          MANIFEST
                        </p>
                        <p className="mt-2 flex items-center gap-2 font-extrabold">
                          <UsersRound className="size-4 text-primary" />
                          {trip.bookedSeats} booked
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {trip.heldSeats} awaiting payment
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </CardContent>
          <PaginationBar
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            onPageChange={pagination.setPage}
          />
        </Card>
      )}
      {editorOpen ? (
        <TripEditorSheet
          open={editorOpen}
          onOpenChange={setEditorOpen}
          trip={editingTrip}
        />
      ) : null}
      <DeleteDialog
        open={deletingTrip !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingTrip(null);
        }}
        label={deletingTrip?.routeName ?? "trip"}
        pending={pendingKey === `trip:${deletingTrip?.id ?? ""}`}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
