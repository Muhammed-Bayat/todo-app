export const TASK_STATUSES = [
  "Todo",
  "In-Progress",
  "Complete",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  topic: string;
  status: TaskStatus;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: string;
  topic: string;
}

export interface UpdateTaskInput extends CreateTaskInput {
  id: number;
  status: TaskStatus;
}