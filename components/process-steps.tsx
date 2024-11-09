"use client";

import { cn } from "@/lib/utils";

interface ProcessStepsProps {
  currentStep: number;
}

export function ProcessSteps({ currentStep }: ProcessStepsProps) {
  const steps = [
    { number: 1, label: "Upload" },
    { number: 2, label: "Confirm" },
    { number: 3, label: "Submit" },
  ];

  return (
    <div className="w-full mb-8">
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center flex-1">
            {/* Progress Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute h-[2px] top-5 -z-10",
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
            
            {/* Circle with Number */}
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                currentStep === step.number
                  ? "bg-primary text-primary-foreground"
                  : currentStep > step.number
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step.number}
            </div>
            
            {/* Label */}
            <span
              className={cn(
                "mt-2 text-sm font-medium",
                currentStep >= step.number
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}