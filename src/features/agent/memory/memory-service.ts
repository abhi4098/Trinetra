import { loadAgentContext, type AgentContext } from "@/features/agent/memory/retrieval";
import type { Memory, MemoryType } from "@/types/database";

type MemoryServiceDeps = {
  loadContext: () => Promise<AgentContext>;
};

const memoryTypeOrder: MemoryType[] = ["decision", "insight", "note", "meeting"];

const defaultDeps: MemoryServiceDeps = {
  loadContext: loadAgentContext,
};

function normalizeMemoryContent(content: string) {
  return content.trim().toLowerCase().replace(/\s+/g, " ");
}

function dedupeMemories(memories: Memory[]) {
  const seen = new Set<string>();
  const unique: Memory[] = [];

  for (const memory of memories) {
    const key = `${memory.memory_type}:${normalizeMemoryContent(memory.content)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(memory);
  }

  return unique;
}

function summarizeLine(content: string) {
  const trimmed = content.trim();
  return trimmed.length > 110 ? `${trimmed.slice(0, 107)}...` : trimmed;
}

export async function loadMemories(deps: Partial<MemoryServiceDeps> = {}): Promise<Memory[]> {
  const resolvedDeps: MemoryServiceDeps = {
    ...defaultDeps,
    ...deps,
  };

  const context = await resolvedDeps.loadContext();
  return context.memories;
}

export function filterMemoriesByType(memories: Memory[], memoryType: MemoryType) {
  return memories.filter((memory) => memory.memory_type === memoryType);
}

export function getMemoriesByType(memories: Memory[], memoryType: MemoryType) {
  return filterMemoriesByType(memories, memoryType);
}

export function synthesizeMemories(memories: Memory[]) {
  const uniqueMemories = dedupeMemories(memories);

  const grouped = memoryTypeOrder
    .map((memoryType) => {
      const items = uniqueMemories
        .filter((memory) => memory.memory_type === memoryType)
        .sort((a, b) => a.created_at.localeCompare(b.created_at));

      return {
        memoryType,
        items,
      };
    })
    .filter((group) => group.items.length > 0);

  const lines = grouped.flatMap((group) =>
    group.items.map((memory) => `- ${summarizeLine(memory.content)} (${group.memoryType})`)
  );

  return {
    total: uniqueMemories.length,
    grouped,
    summary: lines.join("\n"),
  };
}
