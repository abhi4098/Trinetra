import { describe, expect, it } from "vitest";
import { chatWithTrinetra } from "@/features/agent/orchestrator/chat-service";
import type { Memory, Project, Task } from "@/types/database";

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

describe("chatWithTrinetra", () => {
  const loadContext = async () => ({
    projects: [{ id: "p1", name: "Alpha", description: null, progress: 10, status: "planned", created_at: "2025-01-01T00:00:00.000Z" }] as Project[],
    tasks: [makeTask({ title: "Critical task", priority: "high" })],
    memories: [
      { id: "m1", project_id: "p1", memory_type: "note", content: "Trinetra stores context.", importance: 5, created_at: "2025-01-02T00:00:00.000Z" },
      { id: "m2", project_id: "p1", memory_type: "decision", content: "We decided to prioritize reliability.", importance: 7, created_at: "2025-01-03T00:00:00.000Z" },
      { id: "m3", project_id: "p1", memory_type: "insight", content: "Users ask for chat-first workflows.", importance: 8, created_at: "2025-01-04T00:00:00.000Z" },
    ] as Memory[],
  });

  it("returns projects response", async () => {
    const response = await chatWithTrinetra("What projects do I have?", { loadContext });
    expect(response.intent).toBe("projects");
    expect(response.reply).toContain("Alpha");
  });

  it("returns workspace summary response", async () => {
    const response = await chatWithTrinetra("Summarize my workspace", { loadContext });
    expect(response.intent).toBe("workspace_summary");
    expect(response.reply).toContain("Projects 1");
    expect(response.reply).toContain("High priority tasks");
  });

  it("returns memory-based about response", async () => {
    const response = await chatWithTrinetra("What is Trinetra?", { loadContext });
    expect(response.intent).toBe("about_trinetra");
    expect(response.reply).toContain("Personal AI Operating System");
    expect(response.reply).toContain("stored memory item");
  });

  it("returns memories intent response without recommendation fallback", async () => {
    const response = await chatWithTrinetra("How many memories do I have?", { loadContext });
    expect(response.intent).toBe("memories");
    expect(response.reply).toContain("memory item(s)");
    expect(response.reply).not.toContain("Recommended next step");
  });

  it("returns decisions intent filtered by memory_type=decision", async () => {
    const response = await chatWithTrinetra("What decisions have been made?", { loadContext });
    expect(response.intent).toBe("decisions");
    expect(response.reply).toContain("decision memory item");
    expect(response.reply).toContain("prioritize reliability");
  });

  it("returns helpful message when no insights exist", async () => {
    const response = await chatWithTrinetra("List insights", {
      loadContext: async () => ({
        projects: [] as Project[],
        tasks: [] as Task[],
        memories: [] as Memory[],
      }),
    });

    expect(response.intent).toBe("insights");
    expect(response.reply).toBe("No insight memories found yet.");
  });
});
