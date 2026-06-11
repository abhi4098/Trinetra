"use client";
import RouteError from "@/components/ui/route-error";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <RouteError title="Failed to load projects" error={error} reset={reset} />;
}
