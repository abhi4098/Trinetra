import SectionHeader from "@/components/ui/section-header";
import ProjectsManager from "@/features/projects/components/projects-manager";
import { getProjects } from "@/features/projects/api";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <SectionHeader title="Projects" subtitle="View and manage all projects." />
      <ProjectsManager projects={projects} />
    </div>
  );
}
