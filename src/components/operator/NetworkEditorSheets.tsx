"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useOperator } from "@/contexts/OperatorContext";
import type { LocationRecord, RouteRecord, StopType, ActiveStatus, LocationType } from "@/types/operator";
import { STOP_TYPES, ACTIVE_STATUSES, LOCATION_TYPES } from "@/types/operator";

function stopType(value: string | undefined): StopType {
  return STOP_TYPES.includes(value as StopType) ? (value as StopType) : "both";
}

function isActiveStatus(value: string): value is ActiveStatus {
  return ACTIVE_STATUSES.includes(value as ActiveStatus);
}

function isLocationType(value: string): value is LocationType {
  return LOCATION_TYPES.includes(value as LocationType);
}

export function RouteEditorSheet({
  open,
  onOpenChange,
  route,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly route: RouteRecord | null;
}) {
  const { saveRoute, pendingKey } = useOperator();
  const [name, setName] = useState(route?.name ?? "");
  const [distance, setDistance] = useState(String(route?.distanceKm ?? 300));
  const [minutes, setMinutes] = useState(
    String(route?.estimatedMinutes ?? 360),
  );
  const [status, setStatus] = useState<RouteRecord["status"]>(
    route?.status ?? "active",
  );
  const [stops, setStops] = useState(
    route?.stops.map((item) => `${item.name} | ${item.type}`).join("\n") ??
      "Origin station | pickup\nRest stop | rest\nDestination station | dropoff",
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const distanceKm = Number(distance);
    const estimatedMinutes = Number(minutes);
    const parsedStops = stops
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [stopName, rawType] = line.split("|").map((part) => part.trim());
        return {
          order: index + 1,
          name: stopName ?? `Stop ${index + 1}`,
          type: stopType(rawType),
        };
      });
    if (
      !name.trim() ||
      !Number.isFinite(distanceKm) ||
      !Number.isFinite(estimatedMinutes) ||
      parsedStops.length < 2
    ) {
      setError(
        "Add a route name, valid distance and duration, plus at least two stops.",
      );
      return;
    }
    const result = await saveRoute({
      id: route?.id ?? crypto.randomUUID(),
      name: name.trim(),
      distanceKm,
      estimatedMinutes,
      status,
      stops: parsedStops,
    });
    if (result.kind === "success") onOpenChange(false);
    else setError(result.message);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{route ? "Edit route" : "Create route"}</SheetTitle>
          <SheetDescription>
            Manage route timing and the ordered stop sequence used by trip
            snapshots.
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-5 px-4 pb-6" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="route-name">Route name</Label>
            <Input
              id="route-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Cà Mau → Sài Gòn"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="route-distance">Distance (km)</Label>
              <Input
                id="route-distance"
                inputMode="decimal"
                value={distance}
                onChange={(event) => setDistance(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="route-duration">Duration (minutes)</Label>
              <Input
                id="route-duration"
                inputMode="numeric"
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="route-status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => {
                if (isActiveStatus(value)) setStatus(value);
              }}
            >
              <SelectTrigger id="route-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="route-stops">Ordered stops</Label>
            <Textarea
              id="route-stops"
              rows={7}
              value={stops}
              onChange={(event) => setStops(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              One per line: Location name | pickup, rest, dropoff, or both.
            </p>
          </div>
          {error ? (
            <Alert className="border-destructive/30 bg-destructive/8">
              <AlertTitle>Could not save route</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <SheetFooter className="px-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pendingKey?.startsWith("route:") === true}
            >
              {pendingKey?.startsWith("route:") === true ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save route
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function LocationEditorSheet({
  open,
  onOpenChange,
  location,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly location: LocationRecord | null;
}) {
  const { saveLocation, pendingKey } = useOperator();
  const [name, setName] = useState(location?.name ?? "");
  const [areaName, setAreaName] = useState(location?.areaName ?? "");
  const [address, setAddress] = useState(location?.address ?? "");
  const [type, setType] = useState<LocationRecord["type"]>(
    location?.type ?? "bus_station",
  );
  const [status, setStatus] = useState<LocationRecord["status"]>(
    location?.status ?? "active",
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !areaName.trim() || !address.trim()) {
      setError("Name, administrative area, and address are required.");
      return;
    }
    const result = await saveLocation({
      id: location?.id ?? crypto.randomUUID(),
      name: name.trim(),
      areaName: areaName.trim(),
      address: address.trim(),
      type,
      status,
    });
    if (result.kind === "success") onOpenChange(false);
    else setError(result.message);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>
            {location ? "Edit location" : "Create location"}
          </SheetTitle>
          <SheetDescription>
            Stations, offices, rest areas, and roadside boarding points.
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-5 px-4 pb-6" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="location-name">Location name</Label>
            <Input
              id="location-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-area">Administrative area</Label>
            <Input
              id="location-area"
              value={areaName}
              onChange={(event) => setAreaName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location-address">Address</Label>
            <Input
              id="location-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="location-type">Type</Label>
              <Select
                value={type}
                onValueChange={(value) => {
                  if (isLocationType(value)) setType(value);
                }}
              >
                <SelectTrigger id="location-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bus_station">Bus station</SelectItem>
                  <SelectItem value="operator_office">
                    Operator office
                  </SelectItem>
                  <SelectItem value="rest_area">Rest area</SelectItem>
                  <SelectItem value="roadside_point">Roadside point</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  if (isActiveStatus(value)) setStatus(value);
                }}
              >
                <SelectTrigger id="location-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error ? (
            <Alert className="border-destructive/30 bg-destructive/8">
              <AlertTitle>Could not save location</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <SheetFooter className="px-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pendingKey?.startsWith("location:") === true}
            >
              {pendingKey?.startsWith("location:") === true ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save location
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
