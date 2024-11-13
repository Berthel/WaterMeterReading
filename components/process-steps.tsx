"use client";

import { cn } from "@/lib/utils";
import { Camera, Check, Send } from "lucide-react";

interface ProcessStepsProps {
  currentStep: number;
  isReadyToSubmit?: boolean;
}

export function ProcessSteps({ currentStep, isReadyToSubmit = false }: ProcessStepsProps) {
  const steps = [
    { number: 1, label: "Upload", icon: Camera },
    { number: 2, label: "Confirm", icon: Check },
    { number: 3, label: "Submit", icon: Send },
  ];

  return (
    <div className="w-full mb-8">
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="flex flex-col items-center flex-1">
              {/* Progress Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute h-[2px] top-7 -z-10",
                    "transition-all duration-300 ease-in-out",
                    index === 0
                      ? "left-[20%] right-[80%]"
                      : "left-[50%] right-[50%]",
                    currentStep > step.number
                      ? "bg-primary"
                      : "bg-muted-foreground/25"
                  )}
                />
              )}
              
              {/* Circle with Icon */}
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                  step.number === 3 && isReadyToSubmit
                    ? "bg-black text-white"
                    : currentStep === step.number
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.number
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              
              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-sm font-medium",
                  step.number === 3 && isReadyToSubmit
                    ? "text-black"
                    : currentStep >= step.number
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}