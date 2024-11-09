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
}

export function MeterResult({ reading, onManualInputStart, onReadingConfirmed }: MeterResultProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [manualReading, setManualReading] = useState("");
  const [isManualReadingSubmitted, setIsManualReadingSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);
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

  const handleManualSubmit = () => {
    if (manualReading.trim()) {
      setIsManualReadingSubmitted(true);
    }
  };

  const submitFinalReading = async () => {
    const finalReading = isVerified ? reading : manualReading;
    setIsSubmitting(true);

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
      toast({
        title: "Error",
        description: "Failed to submit reading. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showSubmitButton = 
    (isVerified === true || isManualReadingSubmitted) && 
    !isFinalSubmitted;

  return (
    <Card className="p-4 bg-primary/5 border-primary">
      <div className="space-y-4">
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

        {isVerified === true && !isFinalSubmitted && (
          <div className="text-sm text-center text-green-600 font-medium">
            Reading confirmed ✓
          </div>
        )}

        {isVerified === false && !isManualReadingSubmitted && (
          <div className="space-y-3">
            <div className="text-sm text-center text-red-600 font-medium">
              Reading marked as incorrect ✗
            </div>
            <div className="space-y-2">
              <p className="text-sm text-center">Please enter the correct reading:</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter correct reading"
                  value={manualReading}
                  onChange={(e) => setManualReading(e.target.value)}
                  className="text-center"
                />
                <Button 
                  size="sm"
                  onClick={handleManualSubmit}
                  disabled={!manualReading.trim()}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}

        {isVerified === false && isManualReadingSubmitted && !isFinalSubmitted && (
          <div className="space-y-2">
            <div className="text-sm text-center text-green-600 font-medium">
              Manual reading submitted ✓
            </div>
            <p className="text-sm text-center">
              Corrected reading: <span className="font-bold">{manualReading}</span>
            </p>
          </div>
        )}

        {showSubmitButton && (
          <div className="pt-2">
            <Button
              className="w-full"
              onClick={submitFinalReading}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Final Reading"}
            </Button>
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