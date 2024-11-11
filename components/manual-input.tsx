import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ManualInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isManualMode: boolean;
}

export function ManualInput({ 
  value, 
  onChange, 
  onSubmit, 
  isSubmitting,
  isManualMode 
}: ManualInputProps) {
  return (
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-center"
        />
        <Button 
          size="sm"
          onClick={onSubmit}
          disabled={!value.trim() || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}