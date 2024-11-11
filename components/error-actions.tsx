import { Button } from "@/components/ui/button";

interface ErrorActionsProps {
  onRetry: () => void;
  onStartOver: () => void;
  isSubmitting: boolean;
}

export function ErrorActions({ onRetry, onStartOver, isSubmitting }: ErrorActionsProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-center text-red-600 font-medium">
        Failed to submit reading
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRetry}
          disabled={isSubmitting}
          className="flex-1"
        >
          Try Again
        </Button>
        <Button
          onClick={onStartOver}
          className="flex-1"
        >
          Start Over
        </Button>
      </div>
    </div>
  );
}