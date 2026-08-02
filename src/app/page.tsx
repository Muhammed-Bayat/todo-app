import { getLocalDateString } from "@/lib/task-rules";
import { getActiveTasks, getArchivedTasks } from "@/lib/tasks";

import { TaskWorkspace } from "./task-workspace";

export const dynamic = "force-dynamic";

export default function Home() {
  const activeTasks = getActiveTasks("dueDate", "asc");
  const archivedTasks = getArchivedTasks();

  return (
    <TaskWorkspace
      activeTasks={activeTasks}
      archivedTasks={archivedTasks}
      today={getLocalDateString()}
    />
  );
}
