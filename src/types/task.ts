export const TASK_STATUSES = [
  "Todo",
  "In-Progress",
  "Complete",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_SORT_OPTIONS = [
  "dueDate",
  "topic",
  "status",
] as const;

export type TaskSortOption =
  (typeof TASK_SORT_OPTIONS)[number];

export const TASK_SORT_DIRECTIONS = [
  "asc",
  "desc",
] as const;

export type TaskSortDirection =
  (typeof TASK_SORT_DIRECTIONS)[number];

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