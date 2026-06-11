import { describe, expect, it, vi } from "vitest";
import {
  filterMemoriesByType,
  getMemoriesByType,
  loadMemories,
  synthesizeMemories,
} from "@/features/agent/memory/memory-service";
import type { Memory } from "@/types/database";

const memories: Memory[] = [
  {
    id: "m1",
    project_id: "p1",
    memory_type: "decision",
    content: "Use Next.js and Supabase as foundation.",
    importance: 8,
    created_at: "2025-01-01T00:00:00.000Z",
  },
  {
    id: "m2",
    project_id: "p1",
    memory_type: "insight",
    content: "Adopt chat-first architecture.",
    importance: 7,
    created_at: "2025-01-02T00:00:00.000Z",
  },
  {
    id: "m3",
    project_id: null,
    memory_type: "note",
    content: "Future support for voice commands.",
    importance: 6,
    created_at: "2025-01-03T00:00:00.000Z",
  },
  {
    id: "m4",
    project_id: null,
    memory_type: "note",
    content: "Future support for voice commands.",
    importance: 5,
    created_at: "2025-01-04T00:00:00.000Z",
  },
];

describe("memory-service", () => {
  it("loads memories from context dependency", async () => {
    const loadContext = vi.fn().mockResolvedValue({
      projects: [],
      tasks: [],
      memories,
    });

    const loaded = await loadMemories({ loadContext });

    expect(loadContext).toHaveBeenCalledOnce();
    expect(loaded).toHaveLength(4);
  });

  it("filters memories by type", () => {
    const decisions = filterMemoriesByType(memories, "decision");
    const insights = getMemoriesByType(memories, "insight");

    expect(decisions).toHaveLength(1);
    expect(insights).toHaveLength(1);
  });

  it("synthesizes memories deterministically and removes duplicates", () => {
    const synthesis = synthesizeMemories(memories);

    expect(synthesis.total).toBe(3);
    expect(synthesis.summary).toContain("Use Next.js and Supabase as foundation.");
    expect(synthesis.summary).toContain("Adopt chat-first architecture.");
    expect(synthesis.summary).toContain("Future support for voice commands.");
  });
});
