import { loadAgentContext } from "@/features/agent/memory/retrieval";
import { buildPlan } from "@/features/agent/planner/planner";

export type ChatResponse = {
  reply: string;
  recommendation: {
    title: string;
    estimate: string;
    reason: string;
  };
  contextSummary: {
    projects: number;
    tasks: number;
    memories: number;
  };
};

function inferIntent(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("project")) return "project";
  if (normalized.includes("task") || normalized.includes("todo")) return "task";
  if (normalized.includes("memory") || normalized.includes("remember")) return "memory";

  return "general";
}

function buildReply(message: string, contextSummary: ChatResponse["contextSummary"], recommendation: ChatResponse["recommendation"]) {
  const intent = inferIntent(message);

  if (intent === "project") {
    return `You currently have ${contextSummary.projects} project(s). Recommended next move: ${recommendation.title}.`;
  }

  if (intent === "task") {
    return `You currently have ${contextSummary.tasks} task(s). Recommended next move: ${recommendation.title}.`;
  }

  if (intent === "memory") {
    return `You currently have ${contextSummary.memories} memory item(s). Recommended next move: ${recommendation.title}.`;
  }

  return `Trinetra analyzed your workspace: ${contextSummary.projects} project(s), ${contextSummary.tasks} task(s), ${contextSummary.memories} memory item(s). Recommended next move: ${recommendation.title}.`;
}

export async function chatWithTrinetra(message: string): Promise<ChatResponse> {
  const context = await loadAgentContext();
  const plan = buildPlan(context);

  return {
    reply: buildReply(message, plan.summary, plan.recommendation),
    recommendation: plan.recommendation,
    contextSummary: plan.summary,
  };
}
