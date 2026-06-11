import { supabase } from "@/lib/supabase/client";
import type { Task, TaskInsert, TaskUpdate } from "@/types/database";

export async function getTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at");

  if (error) throw error;

  return (data ?? []) as Task[];
}

export async function createTask(input: TaskInsert) {
  const { data, error } = await supabase
    .from("tasks")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;

  return data as Task;
}

export async function updateTask(id: string, input: TaskUpdate) {
  const { data, error } = await supabase
    .from("tasks")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;

  return data as Task;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}
