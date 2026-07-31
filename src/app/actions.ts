"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  archiveTask,
  createTask,
  updateTask,
} from "@/lib/tasks";
import {
  TASK_STATUSES,
  type TaskStatus,
} from "@/types/task";

function getTextField(
  formData: FormData,
  fieldName: string,
): string {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

function getTaskStatus(formData: FormData): TaskStatus {
  const status = getTextField(formData, "status");

  if (!TASK_STATUSES.includes(status as TaskStatus)) {
    throw new Error("A valid task status is required.");
  }

  return status as TaskStatus;
}

export async function createTaskAction(
  formData: FormData,
): Promise<void> {
  createTask({
    title: getTextField(formData, "title"),
    description: getTextField(formData, "description"),
    dueDate: getTextField(formData, "dueDate"),
    topic: getTextField(formData, "topic"),
  });

  revalidatePath("/");
}

export async function updateTaskAction(
  taskId: number,
  formData: FormData,
): Promise<void> {
  updateTask({
    id: taskId,
    title: getTextField(formData, "title"),
    description: getTextField(formData, "description"),
    dueDate: getTextField(formData, "dueDate"),
    topic: getTextField(formData, "topic"),
    status: getTaskStatus(formData),
  });

  revalidatePath("/");
  revalidatePath(`/tasks/${taskId}/edit`);

  redirect("/");
}

export async function archiveTaskAction(
  formData: FormData,
): Promise<void> {
  const taskId = Number(getTextField(formData, "taskId"));

  archiveTask(taskId);

  revalidatePath("/");
  revalidatePath("/archived");
}