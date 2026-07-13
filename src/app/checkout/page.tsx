"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { ReviewStep } from "@/components/checkout/ReviewStep";
import { PassengerStep } from "@/components/checkout/PassengerStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { getOperator } from "@/lib/services/searchService";
import { createBooking } from "@/lib/services/bookingService";
import type { Passenger } from "@/types/booking";
import { STEPS } from "@/lib/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { selectedTrip, selectedSeats, getTotal } = useBooking();
  const [currentStep, setCurrentStep] = useState(0);
  const [passengers, setPassengers] = useState<Passenger[]>(() =>
    selectedSeats.map((seat) => ({
      seatLabel: seat.label,
      name: "",
      email: "",
    }))
  );

  async function handlePay() {
    if (!selectedTrip) return;
    const booking = await createBooking(selectedTrip, selectedSeats, passengers);
    router.push(`/confirmation/${booking.id}`);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.replace("/login?redirect=/checkout");
    return null;
  }

  if (!selectedTrip || selectedSeats.length === 0) {
    router.replace("/");
    return null;
  }

  const operator = getOperator(selectedTrip.operatorId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold text-primary">Secure checkout</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Finish your booking</h1>
        <p className="mt-2 text-sm text-muted-foreground">Review the route, add passenger names, then confirm payment.</p>
      </div>
      <CheckoutStepper currentStep={currentStep} steps={STEPS} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main step content — re-mounts on step change for fade-in */}
        <div key={currentStep} className="animate-fade-in">
          {currentStep === 0 && (
            <ReviewStep
              trip={selectedTrip}
              seats={selectedSeats}
              operator={operator}
              onContinue={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 1 && (
            <PassengerStep
              seats={selectedSeats}
              passengers={passengers}
              userEmail={user.email}
              onPassengersChange={setPassengers}
              onBack={() => setCurrentStep(0)}
              onContinue={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <PaymentStep
              total={getTotal()}
              onBack={() => setCurrentStep(1)}
              onPay={handlePay}
            />
          )}

          {/* Mobile order summary — below the step content */}
          <div className="mt-6 lg:hidden">
            <OrderSummary
              trip={selectedTrip}
              seats={selectedSeats}
              operator={operator}
              total={getTotal()}
            />
          </div>
        </div>

        {/* Desktop order summary sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <OrderSummary
              trip={selectedTrip}
              seats={selectedSeats}
              operator={operator}
              total={getTotal()}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
