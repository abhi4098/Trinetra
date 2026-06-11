import { getProjects } from "@/features/projects/api";
import ProjectCard from "@/components/dashboard/project-card";
import StatCard from "@/components/dashboard/stat-card";
import { getDashboardStats } from "@/features/dashboard/api";
import { getRecommendedAction } from "@/features/agent/recommendation";
import SectionHeader from "@/components/ui/section-header";

export default async function Home() {
  const projects = await getProjects();
  const stats = await getDashboardStats();
  const recommendation = await getRecommendedAction();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Manage projects, tasks and memories.</p>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Projects" value={stats.projects} />
        <StatCard label="Tasks" value={stats.tasks} />
        <StatCard label="Memories" value={stats.memories} />
      </section>

      <section className="mb-8">
        <SectionHeader title="Projects" subtitle="Current portfolio and execution progress" />
        {projects.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            No projects found yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                progress={Number(project.progress ?? 0)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Recommended Action
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">{recommendation.title}</h2>
        <p className="mt-1 text-sm text-slate-600">Estimated time: {recommendation.estimate}</p>
      </section>
    </div>
  );
}
