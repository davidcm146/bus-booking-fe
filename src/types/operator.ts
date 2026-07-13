export const TRIP_STATUSES = ["scheduled", "running", "completed", "cancelled"] as const;
export type TripStatus = (typeof TRIP_STATUSES)[number];
export type BookingStatus = "pending_payment" | "confirmed" | "cancelled" | "expired" | "completed";
export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";
export type VehicleStatus = "active" | "maintenance" | "inactive";
export type PromotionStatus = "active" | "inactive" | "expired";

export interface OperatorMetric {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
  readonly tone: "neutral" | "positive" | "warning";
}

export interface OperatorTrip {
  readonly id: string;
  readonly routeId: string;
  readonly vehicleId: string;
  readonly departureAt: string;
  readonly routeName: string;
  readonly departureTime: string;
  readonly arrivalTime: string;
  readonly originStop: string;
  readonly destinationStop: string;
  readonly vehiclePlate: string;
  readonly vehicleType: string;
  readonly driverName: string;
  readonly totalSeats: number;
  readonly availableSeats: number;
  readonly bookedSeats: number;
  readonly heldSeats: number;
  readonly basePrice: number;
  readonly status: TripStatus;
}

export interface OperatorBooking {
  readonly id: string;
  readonly bookingCode: string;
  readonly passengerName: string;
  readonly passengerPhone: string;
  readonly routeName: string;
  readonly departureTime: string;
  readonly seats: readonly string[];
  readonly totalAmount: number;
  readonly status: BookingStatus;
  readonly paymentStatus: PaymentStatus;
  readonly checkedIn: boolean;
}

export interface OperatorVehicle {
  readonly id: string;
  readonly plateNumber: string;
  readonly vehicleType: string;
  readonly totalSeats: number;
  readonly seatLayout: readonly string[];
  readonly nextAssignment: string;
  readonly amenities: readonly string[];
  readonly status: VehicleStatus;
}

export interface OperatorPromotion {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly usageCount: number;
  readonly discountLabel: string;
  readonly endAt: string;
  readonly status: PromotionStatus;
}

export interface OperatorAlert {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly kind: "departure" | "payment" | "fleet";
}

export interface OperatorProfile {
  readonly name: string;
  readonly code: string;
  readonly hotline: string;
  readonly email: string;
  readonly status: "active" | "inactive";
  readonly policy: string;
}

export interface RoleRecord {
  readonly id: string;
  readonly name: string;
  readonly userCount: number;
}

export interface StaffRecord {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly role: string;
  readonly status: "active" | "inactive" | "blocked";
}

export interface AdministrativeAreaRecord {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly level: "province" | "district" | "ward";
  readonly parentName: string | null;
}

export const LOCATION_TYPES = ["bus_station", "operator_office", "rest_area", "roadside_point"] as const;
export type LocationType = (typeof LOCATION_TYPES)[number];

export const ACTIVE_STATUSES = ["active", "inactive"] as const;
export type ActiveStatus = (typeof ACTIVE_STATUSES)[number];

export const STOP_TYPES = ["pickup", "dropoff", "rest", "both"] as const;
export type StopType = (typeof STOP_TYPES)[number];

export interface LocationRecord {
  readonly id: string;
  readonly name: string;
  readonly areaName: string;
  readonly type: LocationType;
  readonly address: string;
  readonly status: ActiveStatus;
}

export interface RouteRecord {
  readonly id: string;
  readonly name: string;
  readonly distanceKm: number;
  readonly estimatedMinutes: number;
  readonly status: ActiveStatus;
  readonly stops: readonly { readonly order: number; readonly name: string; readonly type: StopType }[];
}

export interface SeatInventoryRecord {
  readonly tripLabel: string;
  readonly available: number;
  readonly held: number;
  readonly booked: number;
  readonly blocked: number;
}

export interface PaymentRecord {
  readonly id: string;
  readonly bookingCode: string;
  readonly provider: "vnpay" | "momo" | "cash";
  readonly method: "wallet" | "bank_card" | "cash";
  readonly amount: number;
  readonly status: PaymentStatus;
  readonly transactionRef: string;
  readonly paidAt: string | null;
  readonly refundedAt: string | null;
  readonly refundReason: string | null;
}

export interface BookingPromotionRecord {
  readonly bookingCode: string;
  readonly promotionCode: string;
  readonly discountAmount: number;
}

export interface NotificationRecord {
  readonly id: string;
  readonly type: "booking_confirmed" | "trip_cancelled" | "reminder";
  readonly channel: "sms" | "email" | "push";
  readonly title: string;
  readonly status: "pending" | "sent" | "failed";
  readonly sentAt: string | null;
  readonly attemptCount: number;
  readonly lastError: string | null;
}

export interface ReviewRecord {
  readonly bookingCode: string;
  readonly passengerName: string;
  readonly rating: number;
  readonly comment: string;
  readonly createdAt: string;
}

export interface AuditRecord {
  readonly id: string;
  readonly actorName: string;
  readonly action: string;
  readonly entityType: string;
  readonly entityId: string;
  readonly createdAt: string;
}

export interface OperatorDashboardData {
  readonly operatorId: string;
  readonly operatorName: string;
  readonly operatorCode: string;
  readonly serviceDate: string;
  readonly metrics: readonly OperatorMetric[];
  readonly trips: readonly OperatorTrip[];
  readonly bookings: readonly OperatorBooking[];
  readonly vehicles: readonly OperatorVehicle[];
  readonly promotions: readonly OperatorPromotion[];
  readonly alerts: readonly OperatorAlert[];
  readonly profile: OperatorProfile;
  readonly roles: readonly RoleRecord[];
  readonly staff: readonly StaffRecord[];
  readonly administrativeAreas: readonly AdministrativeAreaRecord[];
  readonly locations: readonly LocationRecord[];
  readonly routes: readonly RouteRecord[];
  readonly seatInventories: readonly SeatInventoryRecord[];
  readonly payments: readonly PaymentRecord[];
  readonly bookingPromotions: readonly BookingPromotionRecord[];
  readonly notifications: readonly NotificationRecord[];
  readonly reviews: readonly ReviewRecord[];
  readonly auditLogs: readonly AuditRecord[];
  readonly averageRating: number;
  readonly reviewCount: number;
}

export type OperatorMutationResult =
  | { readonly kind: "success"; readonly message: string }
  | { readonly kind: "conflict"; readonly message: string }
  | { readonly kind: "not_found"; readonly message: string };

export type OperatorCheckInResult =
  | { readonly kind: "success"; readonly bookingId: string }
  | { readonly kind: "not_found"; readonly message: string }
  | { readonly kind: "not_eligible"; readonly message: string };
