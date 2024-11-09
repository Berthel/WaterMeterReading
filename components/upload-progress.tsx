"use client";

import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  progress: number;
}

export function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div className="space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-muted-foreground text-center">
        {progress === 100 ? "Processing image..." : "Uploading..."}
      </p>
    </div>
  );
}