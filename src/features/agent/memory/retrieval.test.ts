import { describe, expect, it, vi } from "vitest";
import { loadAgentContext } from "@/features/agent/memory/retrieval";

describe("loadAgentContext", () => {
  it("loads projects, tasks, and memories using provided deps", async () => {
    const loadProjects = vi.fn().mockResolvedValue([{ id: "p1" }]);
    const loadTasks = vi.fn().mockResolvedValue([{ id: "t1" }]);
    const loadMemories = vi.fn().mockResolvedValue([{ id: "m1" }]);

    const context = await loadAgentContext({
      loadProjects,
      loadTasks,
      loadMemories,
    });

    expect(loadProjects).toHaveBeenCalledOnce();
    expect(loadTasks).toHaveBeenCalledOnce();
    expect(loadMemories).toHaveBeenCalledOnce();

    expect(context.projects).toHaveLength(1);
    expect(context.tasks).toHaveLength(1);
    expect(context.memories).toHaveLength(1);
  });
});
