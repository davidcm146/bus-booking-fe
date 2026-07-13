"use client";

import { useState } from "react";
import { Loader2, Save, CalendarIcon } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/common/TimePicker";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useOperator } from "@/contexts/OperatorContext";
import type { OperatorTrip, TripStatus } from "@/types/operator";
import { TRIP_STATUSES } from "@/types/operator";

function isTripStatus(value: string): value is TripStatus {
  return (TRIP_STATUSES as readonly string[]).includes(value);
}

export function TripEditorSheet({
  open,
  onOpenChange,
  trip,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly trip: OperatorTrip | null;
}) {
  const { data, saveTrip, pendingKey } = useOperator();
  const [routeId, setRouteId] = useState(
    trip?.routeId ?? data.routes[0]?.id ?? "",
  );
  const [vehicleId, setVehicleId] = useState(
    trip?.vehicleId ?? data.vehicles[0]?.id ?? "",
  );
  const [departureAt, setDepartureAt] = useState(
    trip?.departureAt ?? "2026-07-14T08:00",
  );
  const [arrivalTime, setArrivalTime] = useState(trip?.arrivalTime ?? "14:00");
  const [driverName, setDriverName] = useState(trip?.driverName ?? "");
  const [basePrice, setBasePrice] = useState(String(trip?.basePrice ?? 250000));
  const [status, setStatus] = useState<TripStatus>(trip?.status ?? "scheduled");
  const [error, setError] = useState<string | null>(null);
  const [departOpen, setDepartOpen] = useState(false);

  const departDate = (() => {
    const d = parseISO(departureAt);
    return isValid(d) ? d : undefined;
  })();
  const departTimeStr = departureAt.slice(11, 16) || "08:00";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const route = data.routes.find((item) => item.id === routeId);
    const vehicle = data.vehicles.find((item) => item.id === vehicleId);
    const price = Number(basePrice);
    if (
      !route ||
      !vehicle ||
      !driverName.trim() ||
      !departureAt ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setError(
        "Complete the route, vehicle, driver, departure, and valid base price.",
      );
      return;
    }
    const firstStop =
      route.stops[0]?.name ?? route.name.split("→")[0]?.trim() ?? "Origin";
    const lastStop =
      route.stops.at(-1)?.name ??
      route.name.split("→").at(-1)?.trim() ??
      "Destination";
    const nextTrip: OperatorTrip = {
      id: trip?.id ?? crypto.randomUUID(),
      routeId,
      vehicleId,
      departureAt,
      routeName: route.name,
      departureTime: departureAt.slice(11, 16),
      arrivalTime,
      originStop: firstStop,
      destinationStop: lastStop,
      vehiclePlate: vehicle.plateNumber,
      vehicleType: `${vehicle.vehicleType} ${vehicle.totalSeats}`,
      driverName: driverName.trim(),
      totalSeats: vehicle.totalSeats,
      availableSeats: trip?.availableSeats ?? vehicle.totalSeats,
      bookedSeats: trip?.bookedSeats ?? 0,
      heldSeats: trip?.heldSeats ?? 0,
      basePrice: price,
      status,
    };
    const result = await saveTrip(nextTrip);
    if (result.kind === "success") onOpenChange(false);
    else setError(result.message);
  }

  const saving = pendingKey?.startsWith("trip:") === true;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>
            {trip ? "Edit scheduled trip" : "Schedule a trip"}
          </SheetTitle>
          <SheetDescription>
            Assign a route and vehicle now. The same command shape can be sent
            to the trip API later.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={submit} className="space-y-5 px-4 pb-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="trip-route">Route</Label>
              <Select value={routeId} onValueChange={setRouteId}>
                <SelectTrigger id="trip-route" className="w-full">
                  <SelectValue placeholder="Choose route" />
                </SelectTrigger>
                <SelectContent>
                  {data.routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-vehicle">Vehicle</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger id="trip-vehicle" className="w-full">
                  <SelectValue placeholder="Choose vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {data.vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.plateNumber} · {vehicle.totalSeats} seats
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Departure date</Label>
              <Popover open={departOpen} onOpenChange={setDepartOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className="h-9 w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {departDate ? format(departDate, "dd MMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departDate}
                    onSelect={(date) => {
                      if (date) {
                        setDepartureAt(`${format(date, "yyyy-MM-dd")}T${departTimeStr}`);
                        setDepartOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Departure time</Label>
              <TimePicker
                value={departTimeStr}
                onChange={(time) => {
                  setDepartureAt(`${departureAt.slice(0, 10) || format(new Date(), "yyyy-MM-dd")}T${time}`);
                }}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Arrival time</Label>
              <TimePicker
                value={arrivalTime}
                onChange={setArrivalTime}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-driver">Driver</Label>
              <Input
                id="trip-driver"
                value={driverName}
                onChange={(event) => setDriverName(event.target.value)}
                placeholder="Driver full name"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="trip-price">Base price (VND)</Label>
              <Input
                id="trip-price"
                inputMode="numeric"
                value={basePrice}
                onChange={(event) => setBasePrice(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  if (isTripStatus(value)) setStatus(value);
                }}
              >
                <SelectTrigger id="trip-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error ? (
            <Alert className="border-destructive/30 bg-destructive/8">
              <AlertTitle>Could not save trip</AlertTitle>
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
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save trip
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
