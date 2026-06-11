import { supabase } from "@/lib/supabase/client";
import type { Memory, MemoryInsert, MemoryUpdate, MemoryType } from "@/types/database";

export async function getMemories(memoryType?: MemoryType) {
  let query = supabase.from("memories").select("*").order("created_at");

  if (memoryType) {
    query = query.eq("memory_type", memoryType);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []) as Memory[];
}

export async function createMemory(input: MemoryInsert) {
  const { data, error } = await supabase
    .from("memories")
    .insert(input)
    .select("*")
    .single();

  if (error) throw error;

  return data as Memory;
}

export async function updateMemory(id: string, input: MemoryUpdate) {
  const { data, error } = await supabase
    .from("memories")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;

  return data as Memory;
}

export async function deleteMemory(id: string) {
  const { error } = await supabase.from("memories").delete().eq("id", id);
  if (error) throw error;
}
