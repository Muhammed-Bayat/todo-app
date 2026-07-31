import "server-only";

import { db } from "@/lib/database";
import type { CreateTaskInput, Task, TaskStatus } from "@/types/task";

interface TaskRow {
  id: number;
  title: string;
  description: string;
  due_date: string;
  topic: string;
  status: TaskStatus;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapTaskRow(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    topic: row.topic,
    status: row.status,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
}

export function getActiveTasks(): Task[] {
  const rows = db
    .prepare(
      `
        SELECT
          id,
          title,
          description,
          due_date,
          topic,
          status,
          archived_at,
          created_at,
          updated_at
        FROM tasks
        WHERE archived_at IS NULL
        ORDER BY created_at DESC, id DESC
      `,
    )
    .all() as TaskRow[];

  return rows.map(mapTaskRow);
}

export function createTask(input: CreateTaskInput): Task {
  const title = input.title.trim();
  const description = input.description ?? "";
  const dueDate = input.dueDate.trim();
  const topic = input.topic.trim();

  if (title.length === 0) {
    throw new Error("Task title is required.");
  }

  if (topic.length === 0) {
    throw new Error("Task topic is required.");
  }

  if (!isValidDate(dueDate)) {
    throw new Error("Due date must be a valid date in YYYY-MM-DD format.");
  }

  const row = db
    .prepare(
      `
        INSERT INTO tasks (
          title,
          description,
          due_date,
          topic
        )
        VALUES (?, ?, ?, ?)
        RETURNING
          id,
          title,
          description,
          due_date,
          topic,
          status,
          archived_at,
          created_at,
          updated_at
      `,
    )
    .get(title, description, dueDate, topic) as TaskRow | undefined;

  if (!row) {
    throw new Error("The task could not be created.");
  }

  return mapTaskRow(row);
}