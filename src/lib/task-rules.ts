import type { TaskStatus } from "@/types/task";

const taskStatusOrder: Record<TaskStatus, number> = {
  Todo: 1,
  "In-Progress": 2,
  Complete: 3,
};

interface OverdueCandidate {
  dueDate: string;
  status: TaskStatus;
}

export function getLocalDateString(
  date: Date = new Date(),
): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isTaskOverdue(
  task: OverdueCandidate,
  today: string = getLocalDateString(),
): boolean {
  return task.status !== "Complete" && task.dueDate < today;
}

export function compareTaskStatuses(
  firstStatus: TaskStatus,
  secondStatus: TaskStatus,
): number {
  return taskStatusOrder[firstStatus] - taskStatusOrder[secondStatus];
}
