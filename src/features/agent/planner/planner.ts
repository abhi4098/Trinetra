import type { Memory, Project, Task } from "@/types/database";
import { getTaskRecommendation, type Recommendation } from "@/features/agent/planner/recommendation-engine";

export type PlannerInput = {
  projects: Project[];
  tasks: Task[];
  memories: Memory[];
};

export type PlannerOutput = {
  recommendation: Recommendation;
  summary: {
    projects: number;
    tasks: number;
    memories: number;
  };
};

export function buildPlan(input: PlannerInput): PlannerOutput {
  return {
    recommendation: getTaskRecommendation(input.tasks),
    summary: {
      projects: input.projects.length,
      tasks: input.tasks.length,
      memories: input.memories.length,
    },
  };
}
