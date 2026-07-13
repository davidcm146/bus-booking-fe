"use client";

import { useState } from "react";
import {
  Armchair,
  BusFront,
  Pencil,
  Plus,
  Star,
  Trash2,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DeleteDialog,
  EmptyCollection,
  ManagerHeader,
  PaginationBar,
} from "@/components/operator/ManagementPrimitives";
import {
  PromotionEditorSheet,
  SeatLayoutEditor,
  VehicleEditorSheet,
} from "@/components/operator/FleetEditorSheets";
import { StatusBadge } from "@/components/operator/StatusBadge";
import { useOperator } from "@/contexts/OperatorContext";
import { usePagination } from "@/hooks/usePagination";
import type { OperatorPromotion, OperatorVehicle } from "@/types/operator";

type DeleteTarget =
  | { readonly kind: "vehicle"; readonly record: OperatorVehicle }
  | { readonly kind: "promotion"; readonly record: OperatorPromotion };

export function FleetManager() {
  const { data, deleteVehicle, deletePromotion, pendingKey } = useOperator();
  const vehicles = usePagination(data.vehicles, 4);
  const promotions = usePagination(data.promotions, 4);
  const [vehicleEditorOpen, setVehicleEditorOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<OperatorVehicle | null>(
    null,
  );
  const [layoutVehicle, setLayoutVehicle] = useState<OperatorVehicle | null>(
    null,
  );
  const [promotionEditorOpen, setPromotionEditorOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] =
    useState<OperatorPromotion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  function openVehicle(vehicle: OperatorVehicle | null) {
    setEditingVehicle(vehicle);
    setVehicleEditorOpen(true);
  }
  function openPromotion(promotion: OperatorPromotion | null) {
    setEditingPromotion(promotion);
    setPromotionEditorOpen(true);
  }
  async function confirmDelete() {
    if (!deleteTarget) return;
    if (deleteTarget.kind === "vehicle")
      await deleteVehicle(deleteTarget.record.id);
    else await deletePromotion(deleteTarget.record.id);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-5">
      <ManagerHeader
        title="Fleet & commercial"
        description="Manage vehicle readiness, seat layouts, amenities, and bookable promotions."
      />
      <Tabs defaultValue="vehicles" className="space-y-4">
        <TabsList className="no-scrollbar h-10 w-fit max-w-full justify-start overflow-x-auto bg-muted/70 p-1">
          <TabsTrigger value="vehicles">
            Vehicles
          </TabsTrigger>
          <TabsTrigger value="promotions">
            Promotions
          </TabsTrigger>
          <TabsTrigger value="rating">
            Service rating
          </TabsTrigger>
        </TabsList>
        <TabsContent value="vehicles" className="space-y-4">
          <div className="flex justify-end">
            <Button type="button" onClick={() => openVehicle(null)}>
              <Plus className="size-4" />
              Add vehicle
            </Button>
          </div>
          {data.vehicles.length === 0 ? (
            <EmptyCollection
              title="No vehicles"
              description="Add the first coach before scheduling a trip."
              actionLabel="Add vehicle"
              onAction={() => openVehicle(null)}
            />
          ) : (
            <Card className="gap-0 py-0 shadow-card">
              <CardContent className="grid gap-3 p-4 md:grid-cols-2">
                {vehicles.pageItems.map((vehicle) => (
                  <Card key={vehicle.id} size="sm" className="shadow-none">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <BusFront className="size-4 text-primary" />
                            {vehicle.plateNumber}
                          </CardTitle>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {vehicle.vehicleType} · {vehicle.totalSeats} seats
                          </p>
                        </div>
                        <StatusBadge
                          label={vehicle.status}
                          tone={
                            vehicle.status === "active"
                              ? "positive"
                              : vehicle.status === "maintenance"
                                ? "warning"
                                : "neutral"
                          }
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-semibold">
                        {vehicle.nextAssignment}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {vehicle.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-lg bg-muted px-2 py-1 text-xs text-muted-foreground"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openVehicle(vehicle)}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setLayoutVehicle(vehicle)}
                        >
                          <Armchair className="size-3.5" />
                          Seat layout
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          aria-label={`Delete ${vehicle.plateNumber}`}
                          onClick={() =>
                            setDeleteTarget({
                              kind: "vehicle",
                              record: vehicle,
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
                page={vehicles.page}
                totalPages={vehicles.totalPages}
                totalItems={vehicles.totalItems}
                onPageChange={vehicles.setPage}
              />
            </Card>
          )}
        </TabsContent>
        <TabsContent value="promotions" className="space-y-4">
          <div className="flex justify-end">
            <Button type="button" onClick={() => openPromotion(null)}>
              <Plus className="size-4" />
              Create promotion
            </Button>
          </div>
          {data.promotions.length === 0 ? (
            <EmptyCollection
              title="No promotions"
              description="Create an offer for upcoming routes."
              actionLabel="Create promotion"
              onAction={() => openPromotion(null)}
            />
          ) : (
            <Card className="gap-0 py-0 shadow-card">
              <CardContent className="divide-y divide-border px-4">
                {promotions.pageItems.map((promotion) => (
                  <div
                    key={promotion.id}
                    className="grid gap-4 py-5 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-extrabold">{promotion.code}</p>
                        <StatusBadge
                          label={promotion.status}
                          tone={
                            promotion.status === "active"
                              ? "positive"
                              : "neutral"
                          }
                        />
                      </div>
                      <p className="mt-1 text-sm">
                        {promotion.name} · {promotion.discountLabel}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {promotion.usageCount} uses · ends {promotion.endAt}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openPromotion(promotion)}
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-sm"
                        aria-label={`Delete ${promotion.code}`}
                        onClick={() =>
                          setDeleteTarget({
                            kind: "promotion",
                            record: promotion,
                          })
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <PaginationBar
                page={promotions.page}
                totalPages={promotions.totalPages}
                totalItems={promotions.totalItems}
                onPageChange={promotions.setPage}
              />
            </Card>
          )}
        </TabsContent>
        <TabsContent value="rating">
          <Card className="shadow-card">
            <CardContent className="grid gap-5 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-warning/12 text-warning">
                <Star className="size-7 fill-current" />
              </span>
              <div>
                <p className="text-4xl font-extrabold tabular-nums">
                  {data.averageRating}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Average from {data.reviewCount.toLocaleString("en-US")}{" "}
                  verified completed trips.
                </p>
                <p className="mt-3 flex items-center gap-2 text-sm font-semibold">
                  <Wrench className="size-4 text-primary" />
                  Reviews remain read-only and auditable.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {vehicleEditorOpen ? (
        <VehicleEditorSheet
          open={vehicleEditorOpen}
          onOpenChange={setVehicleEditorOpen}
          vehicle={editingVehicle}
        />
      ) : null}
      {layoutVehicle ? (
        <SeatLayoutEditor
          vehicle={layoutVehicle}
          open
          onOpenChange={(open) => {
            if (!open) setLayoutVehicle(null);
          }}
        />
      ) : null}
      {promotionEditorOpen ? (
        <PromotionEditorSheet
          open={promotionEditorOpen}
          onOpenChange={setPromotionEditorOpen}
          promotion={editingPromotion}
        />
      ) : null}
      <DeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        label={
          deleteTarget?.kind === "vehicle"
            ? deleteTarget.record.plateNumber
            : (deleteTarget?.record.code ?? "record")
        }
        pending={
          pendingKey ===
          `${deleteTarget?.kind ?? ""}:${deleteTarget?.record.id ?? ""}`
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
