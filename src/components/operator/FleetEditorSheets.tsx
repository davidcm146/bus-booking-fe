"use client";

import { useMemo, useState } from "react";
import { Armchair, Loader2, Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useOperator } from "@/contexts/OperatorContext";
import type {
  OperatorPromotion,
  OperatorVehicle,
  PromotionStatus,
  VehicleStatus,
} from "@/types/operator";

function isVehicleStatus(value: string): value is VehicleStatus {
  return value === "active" || value === "maintenance" || value === "inactive";
}
function isPromotionStatus(value: string): value is PromotionStatus {
  return value === "active" || value === "inactive" || value === "expired";
}

export function VehicleEditorSheet({
  open,
  onOpenChange,
  vehicle,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly vehicle: OperatorVehicle | null;
}) {
  const { saveVehicle, pendingKey } = useOperator();
  const [plate, setPlate] = useState(vehicle?.plateNumber ?? "");
  const [vehicleType, setVehicleType] = useState(
    vehicle?.vehicleType ?? "Sleeper",
  );
  const [seats, setSeats] = useState(String(vehicle?.totalSeats ?? 34));
  const [amenities, setAmenities] = useState(
    vehicle?.amenities.join(", ") ?? "WiFi, USB, Water, A/C",
  );
  const [assignment, setAssignment] = useState(
    vehicle?.nextAssignment ?? "Unassigned",
  );
  const [status, setStatus] = useState<VehicleStatus>(
    vehicle?.status ?? "active",
  );
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const totalSeats = Number(seats);
    if (
      !plate.trim() ||
      !vehicleType.trim() ||
      !Number.isInteger(totalSeats) ||
      totalSeats < 4 ||
      totalSeats > 80
    ) {
      setError("Add a plate, vehicle type, and seat count between 4 and 80.");
      return;
    }
    const seatLayout =
      vehicle?.seatLayout.length === totalSeats
        ? vehicle.seatLayout
        : Array.from(
            { length: totalSeats },
            (_, index) => `A${String(index + 1).padStart(2, "0")}`,
          );
    const result = await saveVehicle({
      id: vehicle?.id ?? crypto.randomUUID(),
      plateNumber: plate.trim().toUpperCase(),
      vehicleType: vehicleType.trim(),
      totalSeats,
      seatLayout,
      nextAssignment: assignment.trim() || "Unassigned",
      amenities: amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      status,
    });
    if (result.kind === "success") onOpenChange(false);
    else setError(result.message);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{vehicle ? "Edit vehicle" : "Add vehicle"}</SheetTitle>
          <SheetDescription>
            Vehicle readiness, amenities, and seat capacity are kept together
            for later API wiring.
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-5 px-4 pb-6" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicle-plate">Plate number</Label>
              <Input
                id="vehicle-plate"
                value={plate}
                onChange={(event) => setPlate(event.target.value)}
                placeholder="51B-123.45"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-type">Vehicle type</Label>
              <Input
                id="vehicle-type"
                value={vehicleType}
                onChange={(event) => setVehicleType(event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vehicle-seats">Total seats</Label>
              <Input
                id="vehicle-seats"
                inputMode="numeric"
                value={seats}
                onChange={(event) => setSeats(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicle-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  if (isVehicleStatus(value)) setStatus(value);
                }}
              >
                <SelectTrigger id="vehicle-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle-amenities">Amenities</Label>
            <Input
              id="vehicle-amenities"
              value={amenities}
              onChange={(event) => setAmenities(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separate amenities with commas.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle-assignment">Next assignment</Label>
            <Input
              id="vehicle-assignment"
              value={assignment}
              onChange={(event) => setAssignment(event.target.value)}
            />
          </div>
          {error ? (
            <Alert className="border-destructive/30 bg-destructive/8">
              <AlertTitle>Could not save vehicle</AlertTitle>
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
              disabled={pendingKey?.startsWith("vehicle:") === true}
            >
              {pendingKey?.startsWith("vehicle:") === true ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save vehicle
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function SeatLayoutEditor({
  vehicle,
  open,
  onOpenChange,
}: {
  readonly vehicle: OperatorVehicle | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}) {
  const { saveVehicle, pendingKey } = useOperator();
  const initialColumns =
    vehicle?.totalSeats && vehicle.totalSeats % 4 === 0 ? 4 : 2;
  const [rows, setRows] = useState(
    String(Math.ceil((vehicle?.totalSeats ?? 16) / initialColumns)),
  );
  const [columns, setColumns] = useState(String(initialColumns));
  const [prefix, setPrefix] = useState(
    vehicle?.seatLayout[0]?.slice(0, 1) ?? "A",
  );
  const layout = useMemo(() => {
    const count = Math.min(80, Math.max(1, Number(rows) * Number(columns)));
    return Array.from(
      { length: Number.isFinite(count) ? count : 1 },
      (_, index) =>
        `${prefix.trim().toUpperCase() || "A"}${String(index + 1).padStart(2, "0")}`,
    );
  }, [columns, prefix, rows]);
  async function save() {
    if (!vehicle) return;
    const result = await saveVehicle({
      ...vehicle,
      totalSeats: layout.length,
      seatLayout: layout,
    });
    if (result.kind === "success") onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Seat-layout editor · {vehicle?.plateNumber ?? "Vehicle"}
          </DialogTitle>
          <DialogDescription>
            Generate a stable seat definition for inventory creation. Adjust
            rows, columns, and the seat prefix.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="layout-rows">Rows</Label>
            <Input
              id="layout-rows"
              inputMode="numeric"
              value={rows}
              onChange={(event) => setRows(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="layout-columns">Columns</Label>
            <Input
              id="layout-columns"
              inputMode="numeric"
              value={columns}
              onChange={(event) => setColumns(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="layout-prefix">Prefix</Label>
            <Input
              id="layout-prefix"
              maxLength={2}
              value={prefix}
              onChange={(event) => setPrefix(event.target.value)}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-muted/35 p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold">{layout.length} seat preview</p>
            <Armchair className="size-4 text-primary" />
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
            {layout.map((seat) => (
              <Button
                key={seat}
                type="button"
                variant="outline"
                size="sm"
                className="h-9 px-1 text-xs"
              >
                {seat}
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={save}
            disabled={pendingKey === `vehicle:${vehicle?.id ?? ""}`}
          >
            <Save className="size-4" />
            Save layout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PromotionEditorSheet({
  open,
  onOpenChange,
  promotion,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly promotion: OperatorPromotion | null;
}) {
  const { savePromotion, pendingKey } = useOperator();
  const [code, setCode] = useState(promotion?.code ?? "");
  const [name, setName] = useState(promotion?.name ?? "");
  const [discount, setDiscount] = useState(
    promotion?.discountLabel ?? "10% · max ₫80k",
  );
  const [endAt, setEndAt] = useState(promotion?.endAt ?? "31 Dec 2026");
  const [status, setStatus] = useState<PromotionStatus>(
    promotion?.status ?? "active",
  );
  const [error, setError] = useState<string | null>(null);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!code.trim() || !name.trim() || !discount.trim() || !endAt.trim()) {
      setError("Code, name, discount, and end date are required.");
      return;
    }
    const result = await savePromotion({
      id: promotion?.id ?? crypto.randomUUID(),
      code: code.trim().toUpperCase(),
      name: name.trim(),
      discountLabel: discount.trim(),
      endAt: endAt.trim(),
      usageCount: promotion?.usageCount ?? 0,
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
            {promotion ? "Edit promotion" : "Create promotion"}
          </SheetTitle>
          <SheetDescription>
            Configure the offer shown to the booking system. Conditions remain
            ready for the API payload.
          </SheetDescription>
        </SheetHeader>
        <form className="space-y-5 px-4 pb-6" onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="promotion-code">Code</Label>
              <Input
                id="promotion-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promotion-status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  if (isPromotionStatus(value)) setStatus(value);
                }}
              >
                <SelectTrigger id="promotion-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="promotion-name">Promotion name</Label>
            <Input
              id="promotion-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="promotion-discount">Discount rule</Label>
            <Input
              id="promotion-discount"
              value={discount}
              onChange={(event) => setDiscount(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="promotion-end">End date</Label>
            <Input
              id="promotion-end"
              value={endAt}
              onChange={(event) => setEndAt(event.target.value)}
            />
          </div>
          {error ? (
            <Alert className="border-destructive/30 bg-destructive/8">
              <AlertTitle>Could not save promotion</AlertTitle>
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
              disabled={pendingKey?.startsWith("promotion:") === true}
            >
              {pendingKey?.startsWith("promotion:") === true ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save promotion
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
