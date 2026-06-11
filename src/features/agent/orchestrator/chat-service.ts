import { loadAgentContext } from "@/features/agent/memory/retrieval";
import { getTaskRecommendation } from "@/features/agent/planner/recommendation-engine";
import { routeIntent, type ChatIntent } from "@/features/agent/orchestrator/intent-router";
import { getHighPriorityTasks, getUnfinishedTasks } from "@/features/agent/tools/task-tools";
import type { Memory, Project, Task } from "@/types/database";

export type ChatResponse = {
  reply: string;
  intent: ChatIntent;
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

type AgentContext = {
  projects: Project[];
  tasks: Task[];
  memories: Memory[];
};

type ChatServiceDeps = {
  loadContext: () => Promise<AgentContext>;
};

const defaultDeps: ChatServiceDeps = {
  loadContext: loadAgentContext,
};

function summarizeMemory(memory: Memory) {
  const content = memory.content.trim();
  return content.length > 120 ? `${content.slice(0, 117)}...` : content;
}

function formatProjectNames(projects: Project[]) {
  if (projects.length === 0) return "no projects yet";

  return projects.map((project) => project.name).join(", ");
}

function formatTaskList(tasks: Task[]) {
  if (tasks.length === 0) return "no tasks yet";

  return tasks.map((task) => `${task.title} [${task.status}]`).join(", ");
}

function formatMemoryList(memories: Memory[]) {
  if (memories.length === 0) return "none";

  return memories
    .map((memory, index) => `${index + 1}. ${summarizeMemory(memory)}`)
    .join(" | ");
}

function buildProjectsReply(projects: Project[]) {
  return `You have ${projects.length} project(s): ${formatProjectNames(projects)}.`;
}

function buildTasksReply(message: string, tasks: Task[]) {
  const normalizedMessage = message.toLowerCase();
  const unfinishedOnly =
    normalizedMessage.includes("unfinished") ||
    normalizedMessage.includes("open") ||
    normalizedMessage.includes("todo");

  const tasksToShow = unfinishedOnly ? getUnfinishedTasks(tasks) : tasks;
  const label = unfinishedOnly ? "unfinished task(s)" : "task(s)";

  return `You have ${tasksToShow.length} ${label}: ${formatTaskList(tasksToShow)}.`;
}

function buildMemoriesReply(memories: Memory[]) {
  if (memories.length === 0) {
    return "You do not have any memories stored yet.";
  }

  return `You have ${memories.length} memory item(s): ${formatMemoryList(memories)}`;
}

function buildDecisionsReply(memories: Memory[]) {
  const decisions = memories.filter((memory) => memory.memory_type === "decision");

  if (decisions.length === 0) {
    return "No decision memories found yet.";
  }

  return `You have ${decisions.length} decision memory item(s): ${formatMemoryList(decisions)}`;
}

function buildInsightsReply(memories: Memory[]) {
  const insights = memories.filter((memory) => memory.memory_type === "insight");

  if (insights.length === 0) {
    return "No insight memories found yet.";
  }

  return `You have ${insights.length} insight memory item(s): ${formatMemoryList(insights)}`;
}

function buildNotesReply(memories: Memory[]) {
  const notes = memories.filter((memory) => memory.memory_type === "note");

  if (notes.length === 0) {
    return "No note memories found yet.";
  }

  return `You have ${notes.length} note memory item(s): ${formatMemoryList(notes)}`;
}

function buildWorkspaceSummaryReply(context: AgentContext) {
  const highPriorityTasks = getHighPriorityTasks(context.tasks);
  const highPrioritySummary =
    highPriorityTasks.length > 0
      ? highPriorityTasks.map((task) => task.title).join(", ")
      : "No high priority tasks found.";

  return `Workspace summary: Projects ${context.projects.length}, Tasks ${context.tasks.length}, Memories ${context.memories.length}. High priority tasks: ${highPrioritySummary}`;
}

function buildAboutReply(context: AgentContext) {
  if (context.memories.length === 0) {
    return "No memory has been stored yet.";
  }

  const latestMemory = [...context.memories].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )[0];

  return `Trinetra is a Personal AI Operating System. I have ${context.memories.length} stored memory item(s). Latest memory: ${summarizeMemory(latestMemory)}`;
}

function buildRecommendationReply(recommendation: ChatResponse["recommendation"]) {
  return `Recommended next step: ${recommendation.title}. Estimated effort: ${recommendation.estimate}. ${recommendation.reason}`;
}

function buildReply(message: string, context: AgentContext, recommendation: ChatResponse["recommendation"]) {
  const intent = routeIntent(message);

  switch (intent) {
    case "projects":
      return buildProjectsReply(context.projects);
    case "tasks":
      return buildTasksReply(message, context.tasks);
    case "memories":
      return buildMemoriesReply(context.memories);
    case "decisions":
      return buildDecisionsReply(context.memories);
    case "insights":
      return buildInsightsReply(context.memories);
    case "notes":
      return buildNotesReply(context.memories);
    case "workspace_summary":
      return buildWorkspaceSummaryReply(context);
    case "about_trinetra":
      return buildAboutReply(context);
    case "recommendation":
    case "unknown":
    default:
      return buildRecommendationReply(recommendation);
  }
}

export async function chatWithTrinetra(
  message: string,
  deps: Partial<ChatServiceDeps> = {}
): Promise<ChatResponse> {
  const resolvedDeps: ChatServiceDeps = {
    ...defaultDeps,
    ...deps,
  };

  const context = await resolvedDeps.loadContext();
  const recommendation = getTaskRecommendation(context.tasks);
  const intent = routeIntent(message);

  return {
    reply: buildReply(message, context, recommendation),
    intent,
    recommendation,
    contextSummary: {
      projects: context.projects.length,
      tasks: context.tasks.length,
      memories: context.memories.length,
    },
  };
}
