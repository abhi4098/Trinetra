import SectionHeader from "@/components/ui/section-header";
import MemoriesManager from "@/features/memories/components/memories-manager";
import { getMemories } from "@/features/memories/api";
import { getProjects } from "@/features/projects/api";

export default async function MemoriesPage() {
  const [memories, projects] = await Promise.all([getMemories(), getProjects()]);

  return (
    <div>
      <SectionHeader title="Memories" subtitle="View, filter, and manage all memories." />
      <MemoriesManager memories={memories} projects={projects} />
    </div>
  );
}
