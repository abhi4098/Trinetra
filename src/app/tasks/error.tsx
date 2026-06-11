"use client";
import RouteError from "@/components/ui/route-error";

export default function TasksError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <RouteError title="Failed to load tasks" error={error} reset={reset} />;
}
