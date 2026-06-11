import { loadAgentContext } from "@/features/agent/memory/retrieval";
import { ACTIVE_INTENTS } from "@/features/agent/orchestrator/intent-router";

type DiagnosticsDeps = {
  loadContext: typeof loadAgentContext;
};

const defaultDeps: DiagnosticsDeps = {
  loadContext: loadAgentContext,
};

export async function getAgentDiagnostics(deps: Partial<DiagnosticsDeps> = {}) {
  const resolvedDeps: DiagnosticsDeps = {
    ...defaultDeps,
    ...deps,
  };

  const context = await resolvedDeps.loadContext();

  return {
    projects: context.projects.length,
    tasks: context.tasks.length,
    memories: context.memories.length,
    activeIntents: ACTIVE_INTENTS,
  };
}
