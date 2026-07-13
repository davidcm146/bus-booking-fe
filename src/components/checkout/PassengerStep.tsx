"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SelectedSeat, Passenger } from "@/types/booking";

interface PassengerStepProps {
  readonly seats: readonly SelectedSeat[];
  readonly passengers: readonly Passenger[];
  readonly userEmail?: string;
  readonly onPassengersChange: (passengers: Passenger[]) => void;
  readonly onBack: () => void;
  readonly onContinue: () => void;
}

export function PassengerStep({
  seats,
  passengers,
  userEmail,
  onPassengersChange,
  onBack,
  onContinue,
}: PassengerStepProps) {
  function updatePassenger(index: number, field: keyof Passenger, value: string) {
    const updated: Passenger[] = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    onPassengersChange(updated);
  }

  const allNamesFilled = passengers.every((p) => p.name.trim().length > 0);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {seats.map((seat, index) => (
          <Card key={seat.label}>
            <CardHeader>
              <CardTitle className="text-lg font-extrabold tracking-tight">
                Passenger for seat {seat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`name-${index}`}>Full name</Label>
                <Input
                  id={`name-${index}`}
                  type="text"
                  value={passengers[index]?.name ?? ""}
                  onChange={(e) => updatePassenger(index, "name", e.target.value)}
                  placeholder="Nguyen Minh Anh"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`email-${index}`}>Email (optional)</Label>
                <Input
                  id={`email-${index}`}
                  type="email"
                  value={passengers[index]?.email ?? ""}
                  onChange={(e) => updatePassenger(index, "email", e.target.value)}
                  placeholder={userEmail ? `Same as account (${userEmail})` : "you@example.com"}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} size="icon" aria-label="Back" className="size-10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={onContinue}
          size="lg"
          className="flex-1"
          disabled={!allNamesFilled}
        >
          Continue to payment
        </Button>
      </div>
    </div>
  );
}
