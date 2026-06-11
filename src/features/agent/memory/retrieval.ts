import type { Memory, Project, Task } from "@/types/database";

export type AgentContext = {
  projects: Project[];
  tasks: Task[];
  memories: Memory[];
};

export type MemoryRetrievalDeps = {
  loadProjects: () => Promise<Project[]>;
  loadTasks: () => Promise<Task[]>;
  loadMemories: () => Promise<Memory[]>;
};

async function loadProjectsFromApi() {
  const projectsApi = await import("@/features/projects/api");
  return projectsApi.getProjects();
}

async function loadTasksFromApi() {
  const tasksApi = await import("@/features/tasks/api");
  return tasksApi.getTasks();
}

async function loadMemoriesFromApi() {
  const memoriesApi = await import("@/features/memories/api");
  return memoriesApi.getMemories();
}

export async function loadAgentContext(
  deps: Partial<MemoryRetrievalDeps> = {}
): Promise<AgentContext> {
  const resolvedDeps: MemoryRetrievalDeps = {
    loadProjects: loadProjectsFromApi,
    loadTasks: loadTasksFromApi,
    loadMemories: loadMemoriesFromApi,
    ...deps,
  };

  const [projects, tasks, memories] = await Promise.all([
    resolvedDeps.loadProjects(),
    resolvedDeps.loadTasks(),
    resolvedDeps.loadMemories(),
  ]);

  return {
    projects,
    tasks,
    memories,
  };
}
