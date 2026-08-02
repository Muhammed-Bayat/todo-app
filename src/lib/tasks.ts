import "server-only";

import { db } from "@/lib/database";
import { createTaskRepository } from "@/lib/task-repository";

export const {
  getActiveTasks,
  getArchivedTasks,
  getActiveTaskById,
  createTask,
  updateTask,
  archiveTask,
} = createTaskRepository(db);
