import { supabase } from "@/lib/supabase/client";
import type { Project, ProjectInsert, ProjectUpdate } from "@/types/database";

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at");

  if (error) throw error;

  return (data ?? []) as Project[];
}

export async function createProject(input: ProjectInsert) {
  const { data, error } = await supabase
    .from("projects")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;

  return data as Project;
}

export async function updateProject(id: string, input: ProjectUpdate) {
  const { data, error } = await supabase
    .from("projects")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;

  return data as Project;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
