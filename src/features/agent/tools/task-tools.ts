import type { Task } from "@/types/database";

const unfinishedStatuses = new Set(["todo", "in_progress"]);

export function getUnfinishedTasks(tasks: Task[]) {
  return tasks.filter((task) => unfinishedStatuses.has(task.status));
}

export function getHighPriorityTasks(tasks: Task[]) {
  return getUnfinishedTasks(tasks).filter((task) => task.priority === "high");
}

export function getOldestTask(tasks: Task[]) {
  if (tasks.length === 0) return null;

  return [...tasks].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )[0] ?? null;
}
