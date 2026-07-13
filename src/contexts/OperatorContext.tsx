"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { delay } from "@/lib/delay";
import type {
  LocationRecord,
  NotificationRecord,
  OperatorDashboardData,
  OperatorMutationResult,
  OperatorPromotion,
  OperatorTrip,
  OperatorVehicle,
  PaymentRecord,
  RouteRecord,
  StaffRecord,
} from "@/types/operator";

type OperatorContextValue = {
  readonly data: OperatorDashboardData;
  readonly loading: boolean;
  readonly pendingKey: string | null;
  readonly saveTrip: (trip: OperatorTrip) => Promise<OperatorMutationResult>;
  readonly deleteTrip: (id: string) => Promise<OperatorMutationResult>;
  readonly saveRoute: (route: RouteRecord) => Promise<OperatorMutationResult>;
  readonly deleteRoute: (id: string) => Promise<OperatorMutationResult>;
  readonly saveLocation: (location: LocationRecord) => Promise<OperatorMutationResult>;
  readonly deleteLocation: (id: string) => Promise<OperatorMutationResult>;
  readonly saveVehicle: (vehicle: OperatorVehicle) => Promise<OperatorMutationResult>;
  readonly deleteVehicle: (id: string) => Promise<OperatorMutationResult>;
  readonly saveStaff: (staff: StaffRecord) => Promise<OperatorMutationResult>;
  readonly deleteStaff: (id: string) => Promise<OperatorMutationResult>;
  readonly savePromotion: (promotion: OperatorPromotion) => Promise<OperatorMutationResult>;
  readonly deletePromotion: (id: string) => Promise<OperatorMutationResult>;
  readonly refundPayment: (id: string, reason: string) => Promise<OperatorMutationResult>;
  readonly reconcilePayment: (id: string) => Promise<OperatorMutationResult>;
  readonly retryNotification: (id: string) => Promise<OperatorMutationResult>;
  readonly resetData: () => void;
};

const OperatorContext = createContext<OperatorContextValue | null>(null);

type CollectionKey = "trips" | "routes" | "locations" | "vehicles" | "staff" | "promotions";

function upsert<T extends { readonly id: string }>(items: readonly T[], item: T): readonly T[] {
  return items.some((c) => c.id === item.id)
    ? items.map((c) => (c.id === item.id ? item : c))
    : [item, ...items];
}

function upsertIn<T extends { readonly id: string }>(
  key: CollectionKey,
  item: T,
): (d: OperatorDashboardData) => OperatorDashboardData {
  return (d) => ({ ...d, [key]: upsert(d[key] as unknown as readonly T[], item) });
}

function removeFrom(
  key: CollectionKey,
  id: string,
): (d: OperatorDashboardData) => OperatorDashboardData {
  return (d) => ({ ...d, [key]: (d[key] as unknown as readonly { readonly id: string }[]).filter((i) => i.id !== id) });
}

type CommitFn = (
  key: string,
  action: string,
  entityType: string,
  entityId: string,
  update: (current: OperatorDashboardData) => OperatorDashboardData,
) => Promise<OperatorMutationResult>;

export function OperatorProvider({
  initialData,
  children,
}: {
  readonly initialData: OperatorDashboardData;
  readonly children: React.ReactNode;
}) {
  const [data, setData] = useState<OperatorDashboardData>(() => structuredClone(initialData));
  const [loading, setLoading] = useState(true);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 320);
    return () => window.clearTimeout(timer);
  }, []);

  const commit = useCallback<CommitFn>(
    async (key, action, entityType, entityId, update) => {
      setPendingKey(key);
      await delay(260);
      setData((current) => {
        const updated = update(current);
        return {
          ...updated,
          auditLogs: [
            { id: crypto.randomUUID(), actorName: "Current operator", action, entityType, entityId, createdAt: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) },
            ...updated.auditLogs,
          ],
        };
      });
      setPendingKey(null);
      const result = { kind: "success" as const, message: "Saved in the mock workspace." };
      toast.success(result.message);
      return result;
    },
    [],
  );

  const save = useCallback(
    <T extends { readonly id: string }>(key: CollectionKey, entity: string, item: T) =>
      commit(`${entity}:${item.id}`, `${entity}.saved`, entity, item.id, upsertIn(key, item)),
    [commit],
  );
  const remove = useCallback(
    (key: CollectionKey, entity: string, id: string) =>
      commit(`${entity}:${id}`, `${entity}.deleted`, entity, id, removeFrom(key, id)),
    [commit],
  );

  const saveTrip = useCallback(
    async (trip: OperatorTrip): Promise<OperatorMutationResult> => {
      const conflict = data.trips.some(
        (item) => item.id !== trip.id && item.vehicleId === trip.vehicleId && item.departureAt === trip.departureAt && item.status !== "cancelled",
      );
      if (conflict) {
        const result = { kind: "conflict" as const, message: "That vehicle already has a trip at this departure time." };
        toast.error(result.message);
        return result;
      }
      return save("trips", "trip", trip);
    },
    [save, data.trips],
  );

  const deleteTrip = useCallback((id: string) => remove("trips", "trip", id), [remove]);
  const saveRoute = useCallback((route: RouteRecord) => save("routes", "route", route), [save]);
  const deleteRoute = useCallback((id: string) => remove("routes", "route", id), [remove]);
  const saveLocation = useCallback((location: LocationRecord) => save("locations", "location", location), [save]);
  const deleteLocation = useCallback((id: string) => remove("locations", "location", id), [remove]);
  const saveVehicle = useCallback((vehicle: OperatorVehicle) => save("vehicles", "vehicle", vehicle), [save]);
  const deleteVehicle = useCallback((id: string) => remove("vehicles", "vehicle", id), [remove]);
  const saveStaff = useCallback((staff: StaffRecord) => save("staff", "user", staff), [save]);
  const deleteStaff = useCallback((id: string) => remove("staff", "user", id), [remove]);
  const savePromotion = useCallback((promotion: OperatorPromotion) => save("promotions", "promotion", promotion), [save]);
  const deletePromotion = useCallback((id: string) => remove("promotions", "promotion", id), [remove]);

  const refundPayment = useCallback(
    async (id: string, reason: string): Promise<OperatorMutationResult> => {
      const payment = data.payments.find((item) => item.id === id);
      if (!payment) return { kind: "not_found", message: "Payment not found." };
      if (payment.status !== "paid") return { kind: "conflict", message: "Only paid transactions can be refunded." };
      return commit(`payment:${id}`, "payment.refunded", "payment", id, (current) => ({
        ...current,
        payments: current.payments.map((item): PaymentRecord =>
          item.id === id ? { ...item, status: "refunded", refundedAt: "Just now", refundReason: reason } : item,
        ),
      }));
    },
    [commit, data.payments],
  );

  const reconcilePayment = useCallback(
    (id: string) => commit(`payment:${id}`, "payment.reconciled", "payment", id, (current) => ({
      ...current,
      payments: current.payments.map((item): PaymentRecord =>
        item.id === id ? { ...item, status: "paid", paidAt: "Just now" } : item,
      ),
    })),
    [commit],
  );

  const retryNotification = useCallback(
    (id: string) => commit(`notification:${id}`, "notification.retried", "notification", id, (current) => ({
      ...current,
      notifications: current.notifications.map((item): NotificationRecord =>
        item.id === id ? { ...item, status: "pending", attemptCount: item.attemptCount + 1, lastError: null } : item,
      ),
    })),
    [commit],
  );

  const resetData = useCallback(() => setData(structuredClone(initialData)), [initialData]);

  const value = useMemo<OperatorContextValue>(
    () => ({
      data, loading, pendingKey,
      saveTrip, deleteTrip, saveRoute, deleteRoute,
      saveLocation, deleteLocation, saveVehicle, deleteVehicle,
      saveStaff, deleteStaff, savePromotion, deletePromotion,
      refundPayment, reconcilePayment, retryNotification, resetData,
    }),
    [data, loading, pendingKey, saveTrip, deleteTrip, saveRoute, deleteRoute, saveLocation, deleteLocation, saveVehicle, deleteVehicle, saveStaff, deleteStaff, savePromotion, deletePromotion, refundPayment, reconcilePayment, retryNotification, resetData],
  );

  return (
    <OperatorContext.Provider value={value}>
      {children}
    </OperatorContext.Provider>
  );
}

export function useOperator(): OperatorContextValue {
  const context = useContext(OperatorContext);
  if (!context) throw new Error("useOperator must be used inside OperatorProvider");
  return context;
}
