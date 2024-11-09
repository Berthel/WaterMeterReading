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
  const { toast } = useToast();

  const getCurrentStep = () => {
    if (!selectedImage) return 1;
    if (!meterReading) return 1;
    if (meterReading && !isUploading) return 2;
    return 3;
  };

  const handleFileUpload = (file: File) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setMeterReading(null);
    setIsManualInputMode(false);
    setIsReadingConfirmed(false);
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
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      let data: WebhookResponse;

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Invalid response format from server");
        }
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
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to process meter reading. Please try again.";
      
      console.error("Upload error:", { error, message: errorMessage });
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setMeterReading(null);
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
          <h2 className="text-2xl font-bold mb-2">Water Meter Reading Upload</h2>
          <p className="text-muted-foreground">
            Upload a clear image of your water meter for automatic reading
          </p>
        </div>

        <ProcessSteps currentStep={getCurrentStep()} />

        <div className="space-y-4">
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

          {meterReading && (
            <MeterResult 
              reading={meterReading} 
              onManualInputStart={() => setIsManualInputMode(true)}
              onReadingConfirmed={() => setIsReadingConfirmed(true)}
            />
          )}

          <div className="flex gap-2">
            {imagePreview && (
              <Button
                variant="outline"
                onClick={resetForm}
                className="flex-1"
              >
                Clear
              </Button>
            )}
            {!isManualInputMode && !isReadingConfirmed && (
              <Button
                onClick={uploadImage}
                disabled={!selectedImage || isUploading}
                className="flex-1"
              >
                {isUploading ? "Processing..." : "Process Image"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}