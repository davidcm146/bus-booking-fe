import type { OperatorDashboardData } from "@/types/operator";

export const operatorDashboardFixture: OperatorDashboardData = {
  operatorId: "operator-1",
  operatorName: "Phương Trang Express",
  operatorCode: "FUTA-SGN",
  serviceDate: "Monday, 13 July 2026",
  metrics: [
    { label: "Trips today", value: "18", detail: "5 departing in 3 hours", tone: "neutral" },
    { label: "Seat occupancy", value: "81%", detail: "+6.4% from last Monday", tone: "positive" },
    { label: "Revenue today", value: "₫86.4m", detail: "₫12.7m pending", tone: "positive" },
    { label: "Needs attention", value: "3", detail: "2 payments · 1 vehicle", tone: "warning" },
  ],
  trips: [
    { id: "trip-101", routeId: "route-1", vehicleId: "vehicle-301", departureAt: "2026-07-13T08:00", routeName: "Cà Mau → Sài Gòn", departureTime: "08:00", arrivalTime: "14:00", originStop: "Cà Mau Central Station", destinationStop: "Bến xe Miền Tây", vehiclePlate: "51B-123.45", vehicleType: "Limousine 22", driverName: "Nguyễn Minh Khang", totalSeats: 22, availableSeats: 3, bookedSeats: 17, heldSeats: 2, basePrice: 250000, status: "running" },
    { id: "trip-102", routeId: "route-2", vehicleId: "vehicle-302", departureAt: "2026-07-13T09:30", routeName: "Sài Gòn → Đà Lạt", departureTime: "09:30", arrivalTime: "16:30", originStop: "Bến xe Miền Đông", destinationStop: "Đà Lạt Intercity Station", vehiclePlate: "50F-778.21", vehicleType: "Sleeper 34", driverName: "Trần Quốc Huy", totalSeats: 34, availableSeats: 8, bookedSeats: 24, heldSeats: 2, basePrice: 320000, status: "scheduled" },
    { id: "trip-103", routeId: "route-3", vehicleId: "vehicle-303", departureAt: "2026-07-13T11:15", routeName: "Sài Gòn → Cần Thơ", departureTime: "11:15", arrivalTime: "15:15", originStop: "Bến xe Miền Tây", destinationStop: "Cần Thơ Central Station", vehiclePlate: "51B-904.66", vehicleType: "Sleeper 40", driverName: "Lê Hoàng Phúc", totalSeats: 40, availableSeats: 12, bookedSeats: 27, heldSeats: 1, basePrice: 180000, status: "scheduled" },
    { id: "trip-104", routeId: "route-4", vehicleId: "vehicle-304", departureAt: "2026-07-13T06:30", routeName: "Vũng Tàu → Sài Gòn", departureTime: "06:30", arrivalTime: "08:45", originStop: "Vũng Tàu Office", destinationStop: "District 1 Office", vehiclePlate: "72B-332.18", vehicleType: "Seat 28", driverName: "Phạm Gia Bảo", totalSeats: 28, availableSeats: 0, bookedSeats: 28, heldSeats: 0, basePrice: 140000, status: "completed" },
  ],
  bookings: [
    { id: "booking-201", bookingCode: "BB-6Q2X8P", passengerName: "Mai Anh", passengerPhone: "090 245 7781", routeName: "Sài Gòn → Đà Lạt", departureTime: "09:30", seats: ["A03", "A04"], totalAmount: 640000, status: "confirmed", paymentStatus: "paid", checkedIn: false },
    { id: "booking-202", bookingCode: "BB-8M1K4T", passengerName: "Daniel Lee", passengerPhone: "093 881 0402", routeName: "Sài Gòn → Đà Lạt", departureTime: "09:30", seats: ["B11"], totalAmount: 320000, status: "confirmed", paymentStatus: "paid", checkedIn: true },
    { id: "booking-203", bookingCode: "BB-3R7N2C", passengerName: "Trần Thu Hà", passengerPhone: "091 662 1055", routeName: "Sài Gòn → Cần Thơ", departureTime: "11:15", seats: ["A08", "A09", "A10"], totalAmount: 540000, status: "pending_payment", paymentStatus: "pending", checkedIn: false },
    { id: "booking-204", bookingCode: "BB-9T5H1V", passengerName: "Nguyễn Gia Linh", passengerPhone: "098 504 6620", routeName: "Cà Mau → Sài Gòn", departureTime: "08:00", seats: ["B02"], totalAmount: 250000, status: "confirmed", paymentStatus: "paid", checkedIn: false },
  ],
  vehicles: [
    { id: "vehicle-301", plateNumber: "51B-123.45", vehicleType: "Limousine", totalSeats: 22, seatLayout: ["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10", "A11", "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10", "B11"], nextAssignment: "On trip · Cà Mau → Sài Gòn", amenities: ["WiFi", "USB", "Water", "Blanket"], status: "active" },
    { id: "vehicle-302", plateNumber: "50F-778.21", vehicleType: "Sleeper", totalSeats: 34, seatLayout: Array.from({ length: 34 }, (_, index) => `A${String(index + 1).padStart(2, "0")}`), nextAssignment: "09:30 · Sài Gòn → Đà Lạt", amenities: ["WiFi", "USB", "Water", "A/C"], status: "active" },
    { id: "vehicle-303", plateNumber: "51B-904.66", vehicleType: "Sleeper", totalSeats: 40, seatLayout: Array.from({ length: 40 }, (_, index) => `A${String(index + 1).padStart(2, "0")}`), nextAssignment: "11:15 · Sài Gòn → Cần Thơ", amenities: ["WiFi", "Water", "A/C"], status: "active" },
    { id: "vehicle-304", plateNumber: "72B-118.09", vehicleType: "Seat", totalSeats: 28, seatLayout: Array.from({ length: 28 }, (_, index) => `A${String(index + 1).padStart(2, "0")}`), nextAssignment: "Inspection due 14 July", amenities: ["WiFi", "A/C"], status: "maintenance" },
  ],
  promotions: [
    { id: "promotion-401", code: "SUMMER26", name: "Summer routes", usageCount: 184, discountLabel: "10% · max ₫80k", endAt: "31 Jul 2026", status: "active" },
    { id: "promotion-402", code: "FIRSTTRIP", name: "First booking", usageCount: 92, discountLabel: "₫50k fixed", endAt: "31 Dec 2026", status: "active" },
  ],
  alerts: [
    { id: "alert-501", title: "Trip 09:30 boards in 42 minutes", detail: "24 of 34 seats booked · Gate 6", kind: "departure" },
    { id: "alert-502", title: "Two payments need reconciliation", detail: "Momo gateway references received without final status", kind: "payment" },
    { id: "alert-503", title: "Vehicle 72B-118.09 is in maintenance", detail: "Brake inspection must clear before tomorrow's assignment", kind: "fleet" },
  ],
  profile: { name: "Phương Trang Express", code: "FUTA-SGN", hotline: "1900 6067", email: "ops.demo@busgo.app", status: "active", policy: "Free cancellation up to 24 hours before departure" },
  roles: [
    { id: "role-1", name: "Operator admin", userCount: 2 },
    { id: "role-2", name: "Dispatcher", userCount: 6 },
    { id: "role-3", name: "Boarding agent", userCount: 12 },
  ],
  staff: [
    { id: "user-1", fullName: "Lê Minh Demo", email: "minh.demo@busgo.app", phone: "090 000 0101", role: "Operator admin", status: "active" },
    { id: "user-2", fullName: "Nguyễn An Demo", email: "an.demo@busgo.app", phone: "090 000 0102", role: "Dispatcher", status: "active" },
    { id: "user-3", fullName: "Trần Vy Demo", email: "vy.demo@busgo.app", phone: "090 000 0103", role: "Boarding agent", status: "inactive" },
  ],
  administrativeAreas: [
    { id: "area-1", name: "Hồ Chí Minh", code: "HCM", level: "province", parentName: null },
    { id: "area-2", name: "Bình Thạnh", code: "HCM-BT", level: "district", parentName: "Hồ Chí Minh" },
    { id: "area-3", name: "Phường 26", code: "HCM-BT-26", level: "ward", parentName: "Bình Thạnh" },
    { id: "area-4", name: "Cà Mau", code: "CM", level: "province", parentName: null },
  ],
  locations: [
    { id: "location-1", name: "Bến xe Miền Đông", areaName: "Bình Thạnh, Hồ Chí Minh", type: "bus_station", address: "292 Đinh Bộ Lĩnh", status: "active" },
    { id: "location-2", name: "Cà Mau Central Station", areaName: "Cà Mau", type: "bus_station", address: "Lý Thường Kiệt, Phường 6", status: "active" },
    { id: "location-3", name: "Tiền Giang Rest Stop", areaName: "Tiền Giang", type: "rest_area", address: "QL1A, Châu Thành", status: "active" },
  ],
  routes: [
    { id: "route-1", name: "Cà Mau → Sài Gòn", distanceKm: 310, estimatedMinutes: 360, status: "active", stops: [{ order: 1, name: "Cà Mau Central Station", type: "pickup" }, { order: 2, name: "Sóc Trăng", type: "rest" }, { order: 3, name: "Tiền Giang Rest Stop", type: "rest" }, { order: 4, name: "Bến xe Miền Tây", type: "dropoff" }] },
    { id: "route-2", name: "Sài Gòn → Đà Lạt", distanceKm: 305, estimatedMinutes: 420, status: "active", stops: [{ order: 1, name: "Bến xe Miền Đông", type: "pickup" }, { order: 2, name: "Bảo Lộc", type: "rest" }, { order: 3, name: "Đà Lạt Intercity Station", type: "dropoff" }] },
  ],
  seatInventories: [
    { tripLabel: "08:00 · Cà Mau → Sài Gòn", available: 3, held: 2, booked: 17, blocked: 0 },
    { tripLabel: "09:30 · Sài Gòn → Đà Lạt", available: 8, held: 2, booked: 24, blocked: 0 },
    { tripLabel: "11:15 · Sài Gòn → Cần Thơ", available: 12, held: 1, booked: 27, blocked: 0 },
  ],
  payments: [
    { id: "payment-1", bookingCode: "BB-6Q2X8P", provider: "momo", method: "wallet", amount: 640000, status: "paid", transactionRef: "MOMO-DEMO-260713-01", paidAt: "08:42", refundedAt: null, refundReason: null },
    { id: "payment-2", bookingCode: "BB-3R7N2C", provider: "vnpay", method: "bank_card", amount: 540000, status: "pending", transactionRef: "VNP-DEMO-260713-02", paidAt: null, refundedAt: null, refundReason: null },
    { id: "payment-3", bookingCode: "BB-9T5H1V", provider: "cash", method: "cash", amount: 250000, status: "paid", transactionRef: "CASH-DEMO-260713-03", paidAt: "07:10", refundedAt: null, refundReason: null },
  ],
  bookingPromotions: [
    { bookingCode: "BB-6Q2X8P", promotionCode: "SUMMER26", discountAmount: 64000 },
    { bookingCode: "BB-9T5H1V", promotionCode: "FIRSTTRIP", discountAmount: 50000 },
  ],
  notifications: [
    { id: "notification-1", type: "booking_confirmed", channel: "sms", title: "Booking BB-6Q2X8P confirmed", status: "sent", sentAt: "08:43", attemptCount: 1, lastError: null },
    { id: "notification-2", type: "reminder", channel: "push", title: "Trip departs in 60 minutes", status: "pending", sentAt: null, attemptCount: 0, lastError: null },
    { id: "notification-3", type: "trip_cancelled", channel: "email", title: "Cancellation notice delivery", status: "failed", sentAt: null, attemptCount: 2, lastError: "Provider timeout" },
  ],
  reviews: [
    { bookingCode: "BB-4D8N7K", passengerName: "Synthetic traveler 01", rating: 5, comment: "Clean coach and clear boarding instructions.", createdAt: "12 Jul 2026" },
    { bookingCode: "BB-1P6T9M", passengerName: "Synthetic traveler 02", rating: 4, comment: "Comfortable trip with a short departure delay.", createdAt: "11 Jul 2026" },
  ],
  auditLogs: [
    { id: "audit-1", actorName: "Lê Minh Demo", action: "trip.status_updated", entityType: "trip", entityId: "trip-101", createdAt: "08:04" },
    { id: "audit-2", actorName: "Nguyễn An Demo", action: "passenger.checked_in", entityType: "booking", entityId: "BB-8M1K4T", createdAt: "08:17" },
    { id: "audit-3", actorName: "System", action: "payment.reconciliation_flagged", entityType: "payment", entityId: "payment-2", createdAt: "08:45" },
  ],
  averageRating: 4.8,
  reviewCount: 1284,
};
