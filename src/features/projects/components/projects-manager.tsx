"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Project, ProjectStatus, ProjectUpdate } from "@/types/database";
import { createProject, deleteProject, updateProject } from "@/features/projects/api";
import { projectSchema } from "@/features/projects/schema";
import FormError from "@/components/ui/form-error";

type Props = {
  projects: Project[];
};

const statuses: ProjectStatus[] = ["planned", "active", "blocked", "completed"];

type ProjectDraft = {
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
};

const defaultDraft: ProjectDraft = {
  name: "",
  description: "",
  progress: 0,
  status: "planned",
};

export default function ProjectsManager({ projects }: Props) {
  const router = useRouter();
  const [createDraft, setCreateDraft] = useState<ProjectDraft>(defaultDraft);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ProjectDraft>(defaultDraft);
  const [error, setError] = useState<string>();

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      setCreateDraft(defaultDraft);
      setError(undefined);
      router.refresh();
    },
    onError: (e: Error) => setError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProjectUpdate }) =>
      updateProject(id, input),
    onSuccess: () => {
      setEditId(null);
      setError(undefined);
      router.refresh();
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      setError(undefined);
      router.refresh();
    },
    onError: (e: Error) => setError(e.message),
  });

  const isBusy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [projects]
  );

  function submitCreate() {
    const parsed = projectSchema.safeParse({
      ...createDraft,
      description:
        createDraft.description.trim().length > 0 ? createDraft.description : undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid project input");
      return;
    }

    createMutation.mutate({
      ...parsed.data,
      description: parsed.data.description?.trim() || null,
    });
  }

  function startEdit(project: Project) {
    setEditId(project.id);
    setEditDraft({
      name: project.name,
      description: project.description ?? "",
      progress: project.progress,
      status: project.status,
    });
    setError(undefined);
  }

  function submitEdit() {
    if (!editId) return;

    const parsed = projectSchema.safeParse({
      ...editDraft,
      description: editDraft.description.trim().length > 0 ? editDraft.description : undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid project input");
      return;
    }

    updateMutation.mutate({
      id: editId,
      input: {
        ...parsed.data,
        description: parsed.data.description?.trim() || null,
      },
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Create Project</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            value={createDraft.name}
            onChange={(e) => setCreateDraft((s) => ({ ...s, name: e.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Project name"
          />
          <select
            value={createDraft.status}
            onChange={(e) => setCreateDraft((s) => ({ ...s, status: e.target.value as ProjectStatus }))}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <textarea
            value={createDraft.description}
            onChange={(e) => setCreateDraft((s) => ({ ...s, description: e.target.value }))}
            className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Description"
            rows={3}
          />
          <input
            type="number"
            value={createDraft.progress}
            onChange={(e) =>
              setCreateDraft((s) => ({
                ...s,
                progress: Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
              }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Progress"
            min={0}
            max={100}
          />
        </div>

        <FormError message={error} />

        <button
          type="button"
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          onClick={submitCreate}
          disabled={isBusy}
        >
          {createMutation.isPending ? "Creating..." : "Create Project"}
        </button>
      </section>

      <section className="space-y-3">
        {sortedProjects.map((project) => (
          <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {editId === project.id ? (
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={editDraft.name}
                  onChange={(e) => setEditDraft((s) => ({ ...s, name: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <select
                  value={editDraft.status}
                  onChange={(e) =>
                    setEditDraft((s) => ({ ...s, status: e.target.value as ProjectStatus }))
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <textarea
                  value={editDraft.description}
                  onChange={(e) => setEditDraft((s) => ({ ...s, description: e.target.value }))}
                  className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  rows={3}
                />
                <input
                  type="number"
                  value={editDraft.progress}
                  onChange={(e) =>
                    setEditDraft((s) => ({
                      ...s,
                      progress: Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber,
                    }))
                  }
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  min={0}
                  max={100}
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
                  <h4 className="text-base font-semibold text-slate-900">{project.name}</h4>
                  <span className="text-xs uppercase tracking-wide text-slate-600">{project.status}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{project.description || "No description"}</p>
                <p className="mt-2 text-sm text-slate-700">Progress: {project.progress}%</p>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-slate-900"
                    style={{ width: `${Math.max(0, Math.min(100, project.progress))}%` }}
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                    onClick={() => startEdit(project)}
                    disabled={isBusy}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700"
                    onClick={() => deleteMutation.mutate(project.id)}
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
