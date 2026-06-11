import { describe, expect, it } from "vitest";
import { getTaskRecommendation } from "@/features/agent/planner/recommendation-engine";
import type { Task } from "@/types/database";

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: overrides.id ?? "t1",
    project_id: overrides.project_id ?? "p1",
    title: overrides.title ?? "Task",
    status: overrides.status ?? "todo",
    priority: overrides.priority ?? "medium",
    estimate_hours: overrides.estimate_hours ?? 2,
    created_at: overrides.created_at ?? "2025-01-01T00:00:00.000Z",
  };
}

describe("getTaskRecommendation", () => {
  it("recommends high-priority unfinished task first", () => {
    const tasks: Task[] = [
      makeTask({ id: "a", title: "Normal", priority: "medium", created_at: "2025-01-01T00:00:00.000Z" }),
      makeTask({ id: "b", title: "Critical", priority: "high", created_at: "2025-01-02T00:00:00.000Z" }),
    ];

    const recommendation = getTaskRecommendation(tasks);
    expect(recommendation.title).toContain("Critical");
    expect(recommendation.reason).toContain("High-priority unfinished tasks");
  });

  it("recommends oldest unfinished task when no high-priority unfinished tasks exist", () => {
    const tasks: Task[] = [
      makeTask({ id: "a", title: "Older task", priority: "medium", created_at: "2025-01-01T00:00:00.000Z" }),
      makeTask({ id: "b", title: "Newer task", priority: "low", created_at: "2025-01-03T00:00:00.000Z" }),
    ];

    const recommendation = getTaskRecommendation(tasks);
    expect(recommendation.title).toContain("Older task");
    expect(recommendation.reason).toContain("Oldest unfinished task");
  });

  it("recommends creating a new task when no unfinished tasks exist", () => {
    const tasks: Task[] = [makeTask({ status: "done", priority: "high" })];

    const recommendation = getTaskRecommendation(tasks);
    expect(recommendation.title).toBe("Create a new task");
  });
});
