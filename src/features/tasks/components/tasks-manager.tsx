"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Task, TaskPriority, TaskStatus, TaskUpdate } from "@/types/database";
import { createTask, deleteTask, updateTask } from "@/features/tasks/api";
import { taskSchema } from "@/features/tasks/schema";
import FormError from "@/components/ui/form-error";

type Props = {
  tasks: Task[];
};

const statuses: TaskStatus[] = ["todo", "in_progress", "done"];
const priorities: TaskPriority[] = ["low", "medium", "high"];

type TaskDraft = {
  project_id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimate_hours: number;
};

const defaultDraft: TaskDraft = {
  project_id: "",
  title: "",
  status: "todo",
  priority: "medium",
  estimate_hours: 1,
};

export default function TasksManager({ tasks }: Props) {
  const router = useRouter();
  const [createDraft, setCreateDraft] = useState<TaskDraft>(defaultDraft);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<TaskDraft>(defaultDraft);
  const [error, setError] = useState<string>();

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setCreateDraft(defaultDraft);
      setError(undefined);
      router.refresh();
    },
    onError: (e: Error) => setError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: TaskUpdate }) => updateTask(id, input),
    onSuccess: () => {
      setEditId(null);
      setError(undefined);
      router.refresh();
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      setError(undefined);
      router.refresh();
    },
    onError: (e: Error) => setError(e.message),
  });

  const isBusy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [tasks]
  );

  function submitCreate() {
    const parsed = taskSchema.safeParse(createDraft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid task input");
      return;
    }

    createMutation.mutate({
      ...parsed.data,
      estimate_hours: parsed.data.estimate_hours ?? null,
    });
  }

  function startEdit(task: Task) {
    setEditId(task.id);
    setEditDraft({
      project_id: task.project_id ?? "",
      title: task.title ?? "",
      status: task.status,
      priority: task.priority,
      estimate_hours: task.estimate_hours ?? 0,
    });
    setError(undefined);
  }

  function submitEdit() {
    if (!editId) return;

    const parsed = taskSchema.safeParse(editDraft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid task input");
      return;
    }

    updateMutation.mutate({
      id: editId,
      input: {
        ...parsed.data,
        estimate_hours: parsed.data.estimate_hours ?? null,
      },
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Create Task</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={createDraft.title}
            onChange={(e) => setCreateDraft((s) => ({ ...s, title: e.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Task title"
          />
          <input
            value={createDraft.project_id}
            onChange={(e) => setCreateDraft((s) => ({ ...s, project_id: e.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Project ID"
          />
          <select
            value={createDraft.status}
            onChange={(e) => setCreateDraft((s) => ({ ...s, status: e.target.value as TaskStatus }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={createDraft.priority}
            onChange={(e) =>
              setCreateDraft((s) => ({ ...s, priority: e.target.value as TaskPriority }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            value={createDraft.estimate_hours}
            onChange={(e) =>
              setCreateDraft((s) => ({
                ...s,
                estimate_hours: Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
              }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Estimate hours"
          />
        </div>

        <FormError message={error} />

        <button
          type="button"
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          onClick={submitCreate}
          disabled={isBusy}
        >
          {createMutation.isPending ? "Creating..." : "Create Task"}
        </button>
      </section>

      <section className="space-y-3">
        {sortedTasks.map((task) => (
          <article key={task.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {editId === task.id ? (
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={editDraft.title ?? ""}
                  onChange={(e) => setEditDraft((s) => ({ ...s, title: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  value={editDraft.project_id ?? ""}
                  onChange={(e) => setEditDraft((s) => ({ ...s, project_id: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <select
                  value={editDraft.status}
                  onChange={(e) => setEditDraft((s) => ({ ...s, status: e.target.value as TaskStatus }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <select
                  value={editDraft.priority}
                  onChange={(e) =>
                    setEditDraft((s) => ({ ...s, priority: e.target.value as TaskPriority }))
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  value={editDraft.estimate_hours}
                  onChange={(e) =>
                    setEditDraft((s) => ({
                      ...s,
                      estimate_hours: Number.isNaN(e.target.valueAsNumber)
                        ? 0
                        : e.target.valueAsNumber,
                    }))
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />

                <div className="flex gap-2 md:col-span-2">
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
                  <h4 className="text-base font-semibold text-slate-900">{task.title}</h4>
                  <span className="text-xs uppercase tracking-wide text-slate-600">{task.status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">Project: {task.project_id}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Priority: {task.priority} • Estimate: {task.estimate_hours ?? 0}h
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    onClick={() => startEdit(task)}
                    disabled={isBusy}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700"
                    onClick={() => deleteMutation.mutate(task.id)}
                    disabled={isBusy}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
