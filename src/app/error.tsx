"use client";
import RouteError from "@/components/ui/route-error";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <RouteError title="Failed to load dashboard" error={error} reset={reset} />;
}
