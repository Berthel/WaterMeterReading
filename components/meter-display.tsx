import { CheckCircle } from "lucide-react";

interface MeterDisplayProps {
  reading: string;
}

export function MeterDisplay({ reading }: MeterDisplayProps) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="h-5 w-5 text-primary" />
      <div>
        <p className="text-sm font-medium">Detected Reading</p>
        <p className="text-2xl font-bold">{reading}</p>
      </div>
    </div>
  );
}