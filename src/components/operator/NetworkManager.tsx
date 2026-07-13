"use client";

import { useMemo, useState } from "react";
import { MapPin, Pencil, Route, Search, Trash2, Waypoints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DeleteDialog,
  EmptyCollection,
  ManagerHeader,
  PaginationBar,
} from "@/components/operator/ManagementPrimitives";
import {
  LocationEditorSheet,
  RouteEditorSheet,
} from "@/components/operator/NetworkEditorSheets";
import { StatusBadge } from "@/components/operator/StatusBadge";
import { useOperator } from "@/contexts/OperatorContext";
import { usePagination } from "@/hooks/usePagination";
import type { LocationRecord, RouteRecord } from "@/types/operator";

type DeleteTarget =
  | { readonly kind: "route"; readonly record: RouteRecord }
  | { readonly kind: "location"; readonly record: LocationRecord };

export function NetworkManager() {
  const { data, deleteRoute, deleteLocation, pendingKey } = useOperator();
  const [query, setQuery] = useState("");
  const [routeEditorOpen, setRouteEditorOpen] = useState(false);
  const [locationEditorOpen, setLocationEditorOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteRecord | null>(null);
  const [editingLocation, setEditingLocation] = useState<LocationRecord | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const routes = useMemo(
    () =>
      data.routes.filter((item) =>
        item.name.toLowerCase().includes(normalizedQuery),
      ),
    [data.routes, normalizedQuery],
  );
  const locations = useMemo(
    () =>
      data.locations.filter((item) =>
        `${item.name} ${item.areaName} ${item.address}`
          .toLowerCase()
          .includes(normalizedQuery),
      ),
    [data.locations, normalizedQuery],
  );
  const areas = useMemo(
    () =>
      data.administrativeAreas.filter((item) =>
        `${item.name} ${item.code}`.toLowerCase().includes(normalizedQuery),
      ),
    [data.administrativeAreas, normalizedQuery],
  );
  const routePages = usePagination(routes, 3);
  const locationPages = usePagination(locations, 4);
  const areaPages = usePagination(areas, 5);

  function openRoute(route: RouteRecord | null) {
    setEditingRoute(route);
    setRouteEditorOpen(true);
  }
  function openLocation(location: LocationRecord | null) {
    setEditingLocation(location);
    setLocationEditorOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.kind === "route")
      await deleteRoute(deleteTarget.record.id);
    else await deleteLocation(deleteTarget.record.id);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-5">
      <ManagerHeader
        title="Network & service map"
        description="Maintain routes, ordered stops, stations, offices, rest areas, and the administrative hierarchy."
      />
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="pl-10"
          placeholder="Search network records"
          aria-label="Search network records"
        />
      </div>
      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList className="no-scrollbar h-10 w-fit max-w-full justify-start overflow-x-auto bg-muted/70 p-1">
          <TabsTrigger value="routes">
            Routes
          </TabsTrigger>
          <TabsTrigger value="locations">
            Locations
          </TabsTrigger>
          <TabsTrigger value="areas">
            Administrative areas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="routes" className="space-y-4">
          <div className="flex justify-end">
            <Button type="button" onClick={() => openRoute(null)}>
              Create route
            </Button>
          </div>
          {routes.length === 0 ? (
            <EmptyCollection
              title="No routes found"
              description="Clear the search or create the first route."
              actionLabel="Create route"
              onAction={() => openRoute(null)}
            />
          ) : (
            <Card className="gap-0 py-0 shadow-card">
              <CardContent className="divide-y divide-border px-4">
                {routePages.pageItems.map((route) => (
                  <div
                    key={route.id}
                    className="grid gap-4 py-5 lg:grid-cols-[1fr_auto] lg:items-start"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Route className="size-4 text-primary" />
                        <p className="font-extrabold">{route.name}</p>
                        <StatusBadge
                          label={route.status}
                          tone={
                            route.status === "active" ? "positive" : "neutral"
                          }
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {route.distanceKm} km ·{" "}
                        {Math.round(route.estimatedMinutes / 60)}h estimated
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {route.stops.map((stop, index) => (
                          <div
                            key={`${route.id}-${stop.order}`}
                            className="flex items-center gap-2"
                          >
                            <span className="rounded-lg bg-muted px-2.5 py-1.5 text-xs font-semibold">
                              {stop.order}. {stop.name} · {stop.type}
                            </span>
                            {index < route.stops.length - 1 ? (
                              <Waypoints className="size-3 text-primary" />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openRoute(route)}
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        aria-label={`Delete ${route.name}`}
                        onClick={() =>
                          setDeleteTarget({ kind: "route", record: route })
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <PaginationBar
                page={routePages.page}
                totalPages={routePages.totalPages}
                totalItems={routePages.totalItems}
                onPageChange={routePages.setPage}
              />
            </Card>
          )}
        </TabsContent>
        <TabsContent value="locations" className="space-y-4">
          <div className="flex justify-end">
            <Button type="button" onClick={() => openLocation(null)}>
              Create location
            </Button>
          </div>
          {locations.length === 0 ? (
            <EmptyCollection
              title="No locations found"
              description="Clear the search or create a boarding location."
              actionLabel="Create location"
              onAction={() => openLocation(null)}
            />
          ) : (
            <Card className="gap-0 py-0 shadow-card">
              <CardContent className="grid gap-3 p-4 md:grid-cols-2">
                {locationPages.pageItems.map((location) => (
                  <Card key={location.id} size="sm" className="shadow-none">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="size-4 text-primary" />
                            {location.name}
                          </CardTitle>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {location.areaName}
                          </p>
                        </div>
                        <StatusBadge
                          label={location.status}
                          tone={
                            location.status === "active"
                              ? "positive"
                              : "neutral"
                          }
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{location.address}</p>
                      <p className="mt-2 text-xs font-semibold text-muted-foreground">
                        {location.type.replaceAll("_", " ")}
                      </p>
                      <div className="mt-4 flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openLocation(location)}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          aria-label={`Delete ${location.name}`}
                          onClick={() =>
                            setDeleteTarget({
                              kind: "location",
                              record: location,
                            })
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
              <PaginationBar
                page={locationPages.page}
                totalPages={locationPages.totalPages}
                totalItems={locationPages.totalItems}
                onPageChange={locationPages.setPage}
              />
            </Card>
          )}
        </TabsContent>
        <TabsContent value="areas">
          <Card className="gap-0 py-0 shadow-card">
            <CardContent className="divide-y divide-border px-4">
              {areaPages.pageItems.map((area) => (
                <div
                  key={area.id}
                  className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-extrabold">{area.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {area.code} · Parent: {area.parentName ?? "National root"}
                    </p>
                  </div>
                  <StatusBadge label={area.level} />
                </div>
              ))}
            </CardContent>
            <PaginationBar
              page={areaPages.page}
              totalPages={areaPages.totalPages}
              totalItems={areaPages.totalItems}
              onPageChange={areaPages.setPage}
            />
          </Card>
        </TabsContent>
      </Tabs>
      {routeEditorOpen ? (
        <RouteEditorSheet
          open={routeEditorOpen}
          onOpenChange={setRouteEditorOpen}
          route={editingRoute}
        />
      ) : null}
      {locationEditorOpen ? (
        <LocationEditorSheet
          open={locationEditorOpen}
          onOpenChange={setLocationEditorOpen}
          location={editingLocation}
        />
      ) : null}
      <DeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        label={deleteTarget?.record.name ?? "record"}
        pending={
          pendingKey ===
          `${deleteTarget?.kind ?? ""}:${deleteTarget?.record.id ?? ""}`
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
