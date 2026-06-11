import { describe, expect, it } from "vitest";
import { buildPlan } from "@/features/agent/planner/planner";
import type { Memory, Project, Task } from "@/types/database";

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: overrides.id ?? "t1",
    project_id: overrides.project_id ?? "p1",
    title: overrides.title ?? "Task",
    status: overrides.status ?? "todo",
    priority: overrides.priority ?? "medium",
    estimate_hours: overrides.estimate_hours ?? 3,
    created_at: overrides.created_at ?? "2025-01-01T00:00:00.000Z",
  };
}

describe("buildPlan", () => {
  it("builds summary counts and recommendation", () => {
    const projects = [{ id: "p1" }] as Project[];
    const tasks = [makeTask({ title: "High priority", priority: "high" })];
    const memories = [{ id: "m1" }] as Memory[];

    const plan = buildPlan({ projects, tasks, memories });

    expect(plan.summary).toEqual({ projects: 1, tasks: 1, memories: 1 });
    expect(plan.recommendation.title).toContain("High priority");
  });
});
