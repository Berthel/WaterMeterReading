"use client";

import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  onFileUpload: (file: File) => void;
}

export function Dropzone({ onFileUpload }: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-sm text-muted-foreground">
        {isDragActive ? (
          "Drop the image here"
        ) : (
          "Drag & drop an image here, or click to select"
        )}
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        Supports: JPG, JPEG, PNG
      </p>
    </div>
  );
}