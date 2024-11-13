"use client";

import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";

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
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
      <p className="text-lg text-muted-foreground mb-4">
        {isDragActive ? (
          "Drop the image here"
        ) : (
          "Drag & drop an image here"
        )}
      </p>
      <p className="text-muted-foreground mb-6">- or -</p>
      <Button
        size="lg"
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Choose file
      </Button>
      <p className="text-sm text-muted-foreground mt-4">
        Supports: JPG, JPEG, PNG
      </p>
    </div>
  );
}