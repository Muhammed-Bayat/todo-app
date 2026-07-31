"use server";

import { revalidatePath } from "next/cache";

import { createTask } from "@/lib/tasks";

function getTextField(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

export async function createTaskAction(formData: FormData): Promise<void> {
  createTask({
    title: getTextField(formData, "title"),
    description: getTextField(formData, "description"),
    dueDate: getTextField(formData, "dueDate"),
    topic: getTextField(formData, "topic"),
  });

  revalidatePath("/");
}