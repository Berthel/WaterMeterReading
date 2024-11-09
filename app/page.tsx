import { MeterUploader } from "@/components/meter-uploader";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <MeterUploader />
      <Toaster />
    </main>
  );
}