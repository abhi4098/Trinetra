import SectionHeader from "@/components/ui/section-header";
import TasksManager from "@/features/tasks/components/tasks-manager";
import { getTasks } from "@/features/tasks/api";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div>
      <SectionHeader title="Tasks" subtitle="View and manage all tasks." />
      <TasksManager tasks={tasks} />
    </div>
  );
}
