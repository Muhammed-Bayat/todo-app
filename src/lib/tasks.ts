import "server-only";

import { db } from "@/lib/database";
import {
  TASK_STATUSES,
  type CreateTaskInput,
  type Task,
  type TaskStatus,
  type UpdateTaskInput,
} from "@/types/task";

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

interface NormalizedTaskFields {
  title: string;
  description: string;
  dueDate: string;
  topic: string;
}

const taskColumns = `
  id,
  title,
  description,
  due_date,
  topic,
  status,
  archived_at,
  created_at,
  updated_at
`;

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

function normalizeTaskFields(
  input: CreateTaskInput,
): NormalizedTaskFields {
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
    throw new Error(
      "Due date must be a valid date in YYYY-MM-DD format.",
    );
  }

  return {
    title,
    description,
    dueDate,
    topic,
  };
}

export function getActiveTasks(): Task[] {
  const rows = db
    .prepare(
      `
        SELECT ${taskColumns}
        FROM tasks
        WHERE archived_at IS NULL
        ORDER BY created_at DESC, id DESC
      `,
    )
    .all() as TaskRow[];

  return rows.map(mapTaskRow);
}

export function getActiveTaskById(id: number): Task | null {
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  const row = db
    .prepare(
      `
        SELECT ${taskColumns}
        FROM tasks
        WHERE id = ?
          AND archived_at IS NULL
      `,
    )
    .get(id) as TaskRow | undefined;

  return row ? mapTaskRow(row) : null;
}

export function createTask(input: CreateTaskInput): Task {
  const fields = normalizeTaskFields(input);

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
        RETURNING ${taskColumns}
      `,
    )
    .get(
      fields.title,
      fields.description,
      fields.dueDate,
      fields.topic,
    ) as TaskRow | undefined;

  if (!row) {
    throw new Error("The task could not be created.");
  }

  return mapTaskRow(row);
}

export function updateTask(input: UpdateTaskInput): Task {
  if (!Number.isInteger(input.id) || input.id <= 0) {
    throw new Error("A valid task ID is required.");
  }

  if (!TASK_STATUSES.includes(input.status)) {
    throw new Error("A valid task status is required.");
  }

  const fields = normalizeTaskFields(input);

  const row = db
    .prepare(
      `
        UPDATE tasks
        SET
          title = ?,
          description = ?,
          due_date = ?,
          topic = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND archived_at IS NULL
        RETURNING ${taskColumns}
      `,
    )
    .get(
      fields.title,
      fields.description,
      fields.dueDate,
      fields.topic,
      input.status,
      input.id,
    ) as TaskRow | undefined;

  if (!row) {
    throw new Error("The active task could not be found.");
  }

  return mapTaskRow(row);
}