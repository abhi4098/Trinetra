export type ProjectStatus = "planned" | "active" | "blocked" | "completed";

export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export type MemoryType = "note" | "decision" | "insight" | "meeting";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  progress: number;
  status: ProjectStatus;
  created_at: string;
};

export type ProjectInsert = {
  name: string;
  description?: string | null;
  progress?: number;
  status?: ProjectStatus;
};

export type ProjectUpdate = Partial<ProjectInsert>;

export type Task = {
  id: string;
  project_id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimate_hours: number | null;
  created_at: string;
};

export type TaskInsert = {
  project_id: string;
  title: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimate_hours?: number | null;
};

export type TaskUpdate = Partial<TaskInsert>;

export type Memory = {
  id: string;
  project_id: string;
  memory_type: MemoryType;
  content: string;
  importance: number;
  created_at: string;
};

export type MemoryInsert = {
  project_id: string;
  memory_type: MemoryType;
  content: string;
  importance?: number;
};

export type MemoryUpdate = Partial<MemoryInsert>;