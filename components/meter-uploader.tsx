"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Dropzone } from "./dropzone";
import { MeterResult } from "./meter-result";
import { UploadProgress } from "./upload-progress";
import { ProcessSteps } from "./process-steps";

interface WebhookResponse {
  Reading?: string | number;
  error?: string;
  message?: string;
}

export function MeterUploader() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [meterReading, setMeterReading] = useState<string | null>(null);
  const [isManualInputMode, setIsManualInputMode] = useState(false);
  const [isReadingConfirmed, setIsReadingConfirmed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  const getCurrentStep = () => {
    if (!selectedImage) return 1;
    if (!meterReading && !isManualInputMode) return 1;
    if ((meterReading || isManualInputMode) && !isReadingConfirmed) return 2;
    return 3;
  };

  const isReadyToSubmit = () => {
    return isReadingConfirmed || (isManualInputMode && meterReading !== null);
  };

  const handleFileUpload = (file: File) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setMeterReading(null);
    setIsManualInputMode(false);
    setIsReadingConfirmed(false);
    setHasError(false);
  };

  const resetForm = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview("");
    setMeterReading(null);
    setIsManualInputMode(false);
    setIsReadingConfirmed(false);
    setHasError(false);
  };

  const handleManualEntry = () => {
    setIsManualInputMode(true);
    setMeterReading("");
    setHasError(false);
  };

  const handleError = (error: unknown) => {
    let errorMessage = "Failed to process meter reading";

    if (error instanceof Error) {
      if (error.message.includes("500")) {
        errorMessage = "The server is temporarily unavailable. Please try again later or enter the reading manually.";
      } else if (error.message.includes("Network")) {
        errorMessage = "Network connection error. Please check your internet connection and try again.";
      } else {
        errorMessage = error.message;
      }
    }

    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
    setMeterReading(null);
    setHasError(true);
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setHasError(false);

    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("filename", selectedImage.name);
    formData.append("contentType", selectedImage.type);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 100);

    try {
      const response = await fetch(
        "https://hook.eu2.make.com/gilno9hpihs228cv0d8uaoq7bqzussiu",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      let data: WebhookResponse;
      const contentType = response.headers.get("content-type");

      try {
        if (contentType?.includes("application/json")) {
          data = await response.json();
        } else {
          const text = await response.text();
          data = JSON.parse(text);
        }
      } catch (parseError) {
        throw new Error("Invalid response format from server");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.message && !data.Reading) {
        throw new Error(data.message);
      }

      if (!data.Reading) {
        throw new Error("No meter reading detected in the image");
      }

      setMeterReading(data.Reading.toString());
    } catch (error) {
      handleError(error);
    } finally {
      setIsUploading(false);
      clearInterval(progressInterval);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Water Meter Reading</h1>
          <p className="text-xl text-muted-foreground">
            Take a clear photo of your water meter
          </p>
        </div>

        <ProcessSteps currentStep={getCurrentStep()} isReadyToSubmit={isReadyToSubmit()} />

        <div className="space-y-4">
          {!isManualInputMode && (
            <>
              {imagePreview ? (
                <div className="relative w-full h-64">
                  <Image
                    src={imagePreview}
                    alt="Selected meter"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <Dropzone onFileUpload={handleFileUpload} />
              )}

              {isUploading && <UploadProgress progress={uploadProgress} />}
            </>
          )}

          {(meterReading || isManualInputMode) && (
            <MeterResult 
              reading={meterReading || ""}
              onManualInputStart={() => setIsManualInputMode(true)}
              onReadingConfirmed={() => setIsReadingConfirmed(true)}
              isManualMode={isManualInputMode}
              onReset={resetForm}
            />
          )}

          {hasError && (
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">
                Would you like to try again with another photo or enter the reading manually?
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Try Another Photo
                </Button>
                <Button
                  onClick={handleManualEntry}
                  className="flex-1"
                >
                  Enter Manually
                </Button>
              </div>
            </div>
          )}

          {!hasError && !isManualInputMode && !isReadingConfirmed && imagePreview && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetForm}
                className="flex-1"
              >
                Clear
              </Button>
              <Button
                onClick={uploadImage}
                disabled={!selectedImage || isUploading}
                className="flex-1"
              >
                {isUploading ? "Processing..." : "Process Image"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}