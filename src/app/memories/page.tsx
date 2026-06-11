import SectionHeader from "@/components/ui/section-header";
import MemoriesManager from "@/features/memories/components/memories-manager";
import { getMemories } from "@/features/memories/api";

export default async function MemoriesPage() {
  const memories = await getMemories();

  return (
    <div>
      <SectionHeader title="Memories" subtitle="View, filter, and manage all memories." />
      <MemoriesManager memories={memories} />
    </div>
  );
}
