"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { submitMeterReading } from "@/lib/api";
import { MeterDisplay } from "./meter-display";
import { VerificationButtons } from "./verification-buttons";
import { ManualInput } from "./manual-input";
import { ErrorActions } from "./error-actions";

interface MeterResultProps {
  reading: string;
  onManualInputStart?: () => void;
  onReadingConfirmed?: () => void;
  isManualMode?: boolean;
  onReset?: () => void;
  onSubmitStart?: () => void;
  onSubmitComplete?: () => void;
}

export function MeterResult({ 
  reading, 
  onManualInputStart, 
  onReadingConfirmed, 
  isManualMode = false,
  onReset,
  onSubmitStart,
  onSubmitComplete
}: MeterResultProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(isManualMode ? false : null);
  const [manualReading, setManualReading] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const { toast } = useToast();

  const handleVerificationResponse = (verified: boolean) => {
    setIsVerified(verified);
    if (verified && onReadingConfirmed) {
      onReadingConfirmed();
    }
    if (!verified && onManualInputStart) {
      onManualInputStart();
    }
  };

  const submitReading = async () => {
    if (!manualReading.trim() && !isVerified) return;

    const finalReading = isVerified ? reading : manualReading;
    setIsSubmitting(true);
    setSubmitError(false);
    onSubmitStart?.();

    try {
      await submitMeterReading(finalReading, isVerified || false);
      setIsFinalSubmitted(true);
      onSubmitComplete?.();
      toast({
        title: "Success",
        description: "Reading submitted successfully",
      });
    } catch (error) {
      setSubmitError(true);
      toast({
        title: "Error",
        description: "Failed to submit reading. Please try again or start over.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <Card className="p-4 bg-primary/5 border-primary">
      <div className="space-y-4">
        {!isManualMode && (
          <>
            <MeterDisplay reading={reading} />

            {isVerified === null && (
              <VerificationButtons onVerify={handleVerificationResponse} />
            )}

            {isVerified === true && !isFinalSubmitted && !submitError && (
              <div className="text-sm text-center text-green-600 font-medium">
                Reading confirmed ✓
              </div>
            )}
          </>
        )}

        {(isVerified === false || isManualMode) && !isFinalSubmitted && !submitError && (
          <div className="space-y-3">
            {!isManualMode && (
              <div className="text-sm text-center text-red-600 font-medium">
                Reading marked as incorrect ✗
              </div>
            )}
            <ManualInput
              value={manualReading}
              onChange={setManualReading}
              onSubmit={submitReading}
              isSubmitting={isSubmitting}
              isManualMode={isManualMode}
            />
          </div>
        )}

        {isVerified === true && !isFinalSubmitted && !submitError && (
          <div className="pt-2">
            <Button
              className="w-full"
              onClick={submitReading}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Reading"}
            </Button>
          </div>
        )}

        {submitError && (
          <ErrorActions
            onRetry={submitReading}
            onStartOver={onReset || (() => {})}
            isSubmitting={isSubmitting}
          />
        )}

        {isFinalSubmitted && (
          <div className="space-y-4">
            <div className="text-sm text-center text-green-600 font-medium">
              Reading submitted successfully ✓
            </div>
            <Button
              onClick={handleStartOver}
              className="w-full"
            >
              Start Over
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}