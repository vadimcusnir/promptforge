import { PromptForgeLoading } from "@/components/loading-states";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <PromptForgeLoading size="lg" message="Initializing Cognitive OS..." />
    </div>
  );
}
