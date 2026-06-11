import { supabase } from "@/lib/supabase/client";

export async function getDashboardStats() {
  const [projects, tasks, memories] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("tasks").select("id", { count: "exact", head: true }),
    supabase.from("memories").select("id", { count: "exact", head: true }),
  ]);

  if (projects.error) throw projects.error;
  if (tasks.error) throw tasks.error;
  if (memories.error) throw memories.error;

  return {
    projects: projects.count ?? 0,
    tasks: tasks.count ?? 0,
    memories: memories.count ?? 0,
  };
}
