"use client";

import { Check } from "lucide-react";
import { cn } from "cnfast";

interface CheckoutStepperProps {
  readonly currentStep: number;
  readonly steps: readonly string[];
}

export function CheckoutStepper({ currentStep, steps }: CheckoutStepperProps) {
  return (
    <div className="mb-8 rounded-2xl bg-muted/55 p-4 ring-1 ring-border sm:p-5">
      {/* Desktop: horizontal stepper */}
      <div className="hidden items-center sm:flex">
        {steps.map((step, idx) => (
          <div key={step} className={cn("flex items-center", idx < steps.length - 1 && "flex-1")}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                  idx < currentStep && "border-primary bg-primary text-primary-foreground",
                  idx === currentStep && "border-primary bg-primary text-primary-foreground",
                  idx > currentStep && "border-border bg-background text-muted-foreground"
                )}
              >
                {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  idx <= currentStep ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  idx < currentStep ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: text indicator */}
      <div className="sm:hidden">
        <p className="text-sm font-medium">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
        </p>
        <div className="mt-2 flex gap-1">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1 flex-1 rounded-full",
                idx <= currentStep ? "bg-primary" : "bg-border"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
