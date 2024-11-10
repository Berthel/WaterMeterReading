"use client";

import { CheckCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface MeterResultProps {
  reading: string;
  onManualInputStart?: () => void;
  onReadingConfirmed?: () => void;
  isManualMode?: boolean;
  onReset?: () => void;
}

export function MeterResult({ 
  reading, 
  onManualInputStart, 
  onReadingConfirmed, 
  isManualMode = false,
  onReset 
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

    try {
      const response = await fetch(
        "https://hook.eu2.make.com/t078lb2an5ny3du2gg694mppox2lrbnd",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reading: finalReading,
            isAutomaticReading: isVerified,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      if (response.status === 200) {
        setIsFinalSubmitted(true);
        toast({
          title: "Success",
          description: "Reading submitted successfully",
        });
        return;
      }

      throw new Error("Failed to submit reading");
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
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Detected Reading</p>
                <p className="text-2xl font-bold">{reading}</p>
              </div>
            </div>

            {isVerified === null && (
              <div className="space-y-2">
                <p className="text-sm text-center">Is this reading correct?</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-32"
                    onClick={() => handleVerificationResponse(true)}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-32"
                    onClick={() => handleVerificationResponse(false)}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    No
                  </Button>
                </div>
              </div>
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
            <div className="space-y-2">
              <p className="text-sm text-center">
                {isManualMode ? "Enter your meter reading:" : "Please enter the correct reading:"}
              </p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter reading"
                  value={manualReading}
                  onChange={(e) => setManualReading(e.target.value)}
                  className="text-center"
                />
                <Button 
                  size="sm"
                  onClick={submitReading}
                  disabled={!manualReading.trim() || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
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
          <div className="space-y-4">
            <div className="text-sm text-center text-red-600 font-medium">
              Failed to submit reading
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={submitReading}
                disabled={isSubmitting}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button
                onClick={handleStartOver}
                className="flex-1"
              >
                Start Over
              </Button>
            </div>
          </div>
        )}

        {isFinalSubmitted && (
          <div className="text-sm text-center text-green-600 font-medium">
            Reading submitted successfully ✓
          </div>
        )}
      </div>
    </Card>
  );
}