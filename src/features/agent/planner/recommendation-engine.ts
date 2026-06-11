import type { Task } from "@/types/database";
import { getHighPriorityTasks, getOldestTask, getUnfinishedTasks } from "@/features/agent/tools/task-tools";

export type Recommendation = {
  title: string;
  estimate: string;
  reason: string;
};

export function getTaskRecommendation(tasks: Task[]): Recommendation {
  const highPriorityUnfinishedTasks = getHighPriorityTasks(tasks);

  if (highPriorityUnfinishedTasks.length > 0) {
    const oldestHighPriorityTask = getOldestTask(highPriorityUnfinishedTasks);

    return {
      title: `Finish high-priority task: ${oldestHighPriorityTask?.title ?? "Untitled task"}`,
      estimate: `${oldestHighPriorityTask?.estimate_hours ?? 1} hour(s)`,
      reason: "High-priority unfinished tasks should be completed first.",
    };
  }

  const unfinishedTasks = getUnfinishedTasks(tasks);
  if (unfinishedTasks.length > 0) {
    const oldestTask = getOldestTask(unfinishedTasks);

    return {
      title: `Continue oldest unfinished task: ${oldestTask?.title ?? "Untitled task"}`,
      estimate: `${oldestTask?.estimate_hours ?? 1} hour(s)`,
      reason: "Oldest unfinished task is recommended to reduce backlog.",
    };
  }

  return {
    title: "Create a new task",
    estimate: "30 minute(s)",
    reason: "No unfinished tasks found.",
  };
}
