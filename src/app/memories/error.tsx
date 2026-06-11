"use client";
import RouteError from "@/components/ui/route-error";

export default function MemoriesError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <RouteError title="Failed to load memories" error={error} reset={reset} />;
}
