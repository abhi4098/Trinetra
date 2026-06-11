"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Memory, MemoryType, MemoryUpdate, Project } from "@/types/database";
import { createMemory, deleteMemory, updateMemory } from "@/features/memories/api";
import { memoryFilterSchema, memorySchema } from "@/features/memories/schema";
import FormError from "@/components/ui/form-error";

type Props = {
  memories: Memory[];
  projects: Project[];
};

const memoryTypes: MemoryType[] = ["note", "decision", "insight", "meeting"];

type MemoryDraft = {
  project_id: string | null;
  memory_type: MemoryType;
  content: string;
  importance: number;
};

const defaultDraft: MemoryDraft = {
  project_id: null,
  memory_type: "note",
  content: "",
  importance: 5,
};

const NO_PROJECT_VALUE = "__no_project__";

export default function MemoriesManager({ memories, projects }: Props) {
  const router = useRouter();
  const [createDraft, setCreateDraft] = useState<MemoryDraft>(defaultDraft);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<MemoryDraft>(defaultDraft);
  const [filter, setFilter] = useState<"all" | MemoryType>("all");
  const [error, setError] = useState<string>();

  const createMutation = useMutation({
    mutationFn: createMemory,
    onSuccess: () => {
      setCreateDraft(defaultDraft);
      setError(undefined);
      router.refresh();
    },
    onError: (e: Error) => setError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: MemoryUpdate }) =>
      updateMemory(id, input),
    onSuccess: () => {
      setEditId(null);
      setError(undefined);
      router.refresh();
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMemory,
    onSuccess: () => {
      setError(undefined);
      router.refresh();
    },
    onError: (e: Error) => setError(e.message),
  });

  const isBusy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const filteredMemories = useMemo(() => {
    const parsed = memoryFilterSchema.safeParse({ memory_type: filter });
    if (!parsed.success || parsed.data.memory_type === "all") {
      return memories;
    }

    return memories.filter((memory) => memory.memory_type === parsed.data.memory_type);
  }, [filter, memories]);

  function submitCreate() {
    const parsed = memorySchema.safeParse(createDraft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid memory input");
      return;
    }

    createMutation.mutate(parsed.data);
  }

  function startEdit(memory: Memory) {
    setEditId(memory.id);
    setEditDraft({
      project_id: memory.project_id,
      memory_type: memory.memory_type,
      content: memory.content,
      importance: memory.importance,
    });
    setError(undefined);
  }

  function submitEdit() {
    if (!editId) return;

    const parsed = memorySchema.safeParse(editDraft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid memory input");
      return;
    }

    updateMutation.mutate({ id: editId, input: parsed.data });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Create Memory</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <select
            value={createDraft.project_id ?? NO_PROJECT_VALUE}
            onChange={(e) =>
              setCreateDraft((s) => ({
                ...s,
                project_id: e.target.value === NO_PROJECT_VALUE ? null : e.target.value,
              }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value={NO_PROJECT_VALUE}>No Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            value={createDraft.memory_type}
            onChange={(e) =>
              setCreateDraft((s) => ({ ...s, memory_type: e.target.value as MemoryType }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {memoryTypes.map((memoryType) => (
              <option key={memoryType} value={memoryType}>
                {memoryType}
              </option>
            ))}
          </select>
          <textarea
            value={createDraft.content}
            onChange={(e) => setCreateDraft((s) => ({ ...s, content: e.target.value }))}
            className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            rows={4}
            placeholder="Memory content"
          />
          <input
            type="number"
            min={1}
            max={10}
            value={createDraft.importance}
            onChange={(e) =>
              setCreateDraft((s) => ({
                ...s,
                importance: Number.isNaN(e.target.valueAsNumber) ? 1 : e.target.valueAsNumber,
              }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Importance (1-10)"
          />
        </div>

        <FormError message={error} />

        <button
          type="button"
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          onClick={submitCreate}
          disabled={isBusy}
        >
          {createMutation.isPending ? "Creating..." : "Create Memory"}
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Memories</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | MemoryType)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="all">all</option>
            {memoryTypes.map((memoryType) => (
              <option key={memoryType} value={memoryType}>
                {memoryType}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {filteredMemories.map((memory) => (
            <article key={memory.id} className="rounded-xl border border-slate-200 p-4">
              {editId === memory.id ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <select
                    value={editDraft.project_id ?? NO_PROJECT_VALUE}
                    onChange={(e) =>
                      setEditDraft((s) => ({
                        ...s,
                        project_id: e.target.value === NO_PROJECT_VALUE ? null : e.target.value,
                      }))
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value={NO_PROJECT_VALUE}>No Project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={editDraft.memory_type}
                    onChange={(e) =>
                      setEditDraft((s) => ({ ...s, memory_type: e.target.value as MemoryType }))
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    {memoryTypes.map((memoryType) => (
                      <option key={memoryType} value={memoryType}>
                        {memoryType}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={editDraft.content}
                    onChange={(e) => setEditDraft((s) => ({ ...s, content: e.target.value }))}
                    rows={4}
                    className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editDraft.importance}
                    onChange={(e) =>
                      setEditDraft((s) => ({
                        ...s,
                        importance: Number.isNaN(e.target.valueAsNumber)
                          ? 1
                          : e.target.valueAsNumber,
                      }))
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <div className="md:col-span-2 flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                      onClick={submitEdit}
                      disabled={isBusy}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                      onClick={() => setEditId(null)}
                      disabled={isBusy}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase text-slate-700">{memory.memory_type}</p>
                    <p className="text-sm text-slate-600">Importance: {memory.importance}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-800">{memory.content}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Project: {memory.project_id ?? "No Project"}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                      onClick={() => startEdit(memory)}
                      disabled={isBusy}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700"
                      onClick={() => deleteMutation.mutate(memory.id)}
                      disabled={isBusy}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
