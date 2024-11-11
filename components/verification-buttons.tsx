import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationButtonsProps {
  onVerify: (verified: boolean) => void;
}

export function VerificationButtons({ onVerify }: VerificationButtonsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-center">Is this reading correct?</p>
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          className="w-32"
          onClick={() => onVerify(true)}
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
          Yes
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-32"
          onClick={() => onVerify(false)}
        >
          <ThumbsDown className="w-4 h-4 mr-2" />
          No
        </Button>
      </div>
    </div>
  );
}