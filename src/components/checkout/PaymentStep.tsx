"use client";

import { useState } from "react";
import { Lock, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatVND } from "@/lib/format";

interface PaymentStepProps {
  total: number;
  onBack: () => void;
  onPay: () => Promise<void>;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export function PaymentStep({ total, onBack, onPay }: PaymentStepProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Validation
  const cardValid = cardNumber.replace(/\s/g, "").length >= 16;
  const expiryValid = expiry.length === 5 && expiry.includes("/");
  const cvcValid = cvc.length >= 3;
  const nameValid = nameOnCard.trim().length >= 2;
  const formValid = cardValid && expiryValid && cvcValid && nameValid;

  async function handleConfirmPay() {
    setShowConfirm(false);
    setProcessing(true);
    try {
      await onPay();
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-4 w-4 text-muted-foreground" />
            Payment details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card number</Label>
            <Input
              id="card-number"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              disabled={processing}
              inputMode="numeric"
            />
            {cardNumber && !cardValid && (
              <p className="text-xs text-destructive">Enter a valid 16-digit card number</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry date</Label>
              <Input
                id="expiry"
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                disabled={processing}
                inputMode="numeric"
              />
              {expiry && !expiryValid && (
                <p className="text-xs text-destructive">MM/YY format</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                placeholder="123"
                maxLength={3}
                disabled={processing}
                inputMode="numeric"
              />
              {cvc && !cvcValid && (
                <p className="text-xs text-destructive">3 digits</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name-on-card">Name on card</Label>
            <Input
              id="name-on-card"
              type="text"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              placeholder="Mario Rossi"
              disabled={processing}
            />
            {nameOnCard && !nameValid && (
              <p className="text-xs text-destructive">Enter the full name on the card</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            This is a mock payment. No real charge will be made.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              setCardNumber("4242 4242 4242 4242");
              setExpiry("12/28");
              setCvc("123");
              setNameOnCard("Test User");
            }}
          >
            Fill test card
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} size="icon" disabled={processing} aria-label="Back" className="size-10">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setShowConfirm(true)}
          size="lg"
          className="flex-1"
          disabled={!formValid || processing}
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>Pay {formatVND(total)}</>
          )}
        </Button>
      </div>

      {/* Confirm payment dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Confirm payment
            </DialogTitle>
            <DialogDescription>
              You&apos;re about to pay <span className="font-bold text-foreground">{formatVND(total)}</span> for your booking. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Card ending in</span>
              <span className="font-mono font-semibold">{cardNumber.replace(/\s/g, "").slice(-4)}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-muted-foreground">Name on card</span>
              <span className="font-semibold">{nameOnCard}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-muted-foreground">Total amount</span>
              <span className="font-bold text-primary">{formatVND(total)}</span>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPay}>
              <Lock className="mr-1 h-4 w-4" />
              Confirm & Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
