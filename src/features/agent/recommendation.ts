import { loadAgentContext } from "@/features/agent/memory/retrieval";
import { getTaskRecommendation } from "@/features/agent/planner/recommendation-engine";

export async function getRecommendedAction() {
  const context = await loadAgentContext();
  return getTaskRecommendation(context.tasks);
}
