import type Database from "better-sqlite3";

import {
  TASK_STATUSES,
  type CreateTaskInput,
  type Task,
  type TaskSortDirection,
  type TaskSortOption,
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

export interface TaskRepository {
  getActiveTasks(
    sort?: TaskSortOption,
    direction?: TaskSortDirection,
  ): Task[];

  getArchivedTasks(): Task[];

  getActiveTaskById(id: number): Task | null;

  createTask(input: CreateTaskInput): Task;

  updateTask(input: UpdateTaskInput): Task;

  archiveTask(id: number): Task;
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

const activeTaskOrderBy: Record<
  TaskSortOption,
  Record<TaskSortDirection, string>
> = {
  dueDate: {
    asc: `
      due_date ASC,
      created_at DESC,
      id DESC
    `,
    desc: `
      due_date DESC,
      created_at DESC,
      id DESC
    `,
  },

  topic: {
    asc: `
      topic COLLATE NOCASE ASC,
      due_date ASC,
      id DESC
    `,
    desc: `
      topic COLLATE NOCASE DESC,
      due_date ASC,
      id DESC
    `,
  },

  status: {
    asc: `
      CASE status
        WHEN 'Todo' THEN 1
        WHEN 'In-Progress' THEN 2
        WHEN 'Complete' THEN 3
      END ASC,
      due_date ASC,
      id DESC
    `,
    desc: `
      CASE status
        WHEN 'Todo' THEN 1
        WHEN 'In-Progress' THEN 2
        WHEN 'Complete' THEN 3
      END DESC,
      due_date ASC,
      id DESC
    `,
  },
};

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

export function createTaskRepository(
  database: Database.Database,
): TaskRepository {
  function getActiveTasks(
    sort: TaskSortOption = "dueDate",
    direction: TaskSortDirection = "asc",
  ): Task[] {
    const orderBy = activeTaskOrderBy[sort][direction];

    const rows = database
      .prepare(
        `
          SELECT ${taskColumns}
          FROM tasks
          WHERE archived_at IS NULL
          ORDER BY ${orderBy}
        `,
      )
      .all() as TaskRow[];

    return rows.map(mapTaskRow);
  }

  function getArchivedTasks(): Task[] {
    const rows = database
      .prepare(
        `
          SELECT ${taskColumns}
          FROM tasks
          WHERE archived_at IS NOT NULL
          ORDER BY archived_at DESC, id DESC
        `,
      )
      .all() as TaskRow[];

    return rows.map(mapTaskRow);
  }

  function getActiveTaskById(id: number): Task | null {
    if (!Number.isInteger(id) || id <= 0) {
      return null;
    }

    const row = database
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

  function createTask(input: CreateTaskInput): Task {
    const fields = normalizeTaskFields(input);

    const row = database
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

  function updateTask(input: UpdateTaskInput): Task {
    if (!Number.isInteger(input.id) || input.id <= 0) {
      throw new Error("A valid task ID is required.");
    }

    if (!TASK_STATUSES.includes(input.status)) {
      throw new Error("A valid task status is required.");
    }

    const fields = normalizeTaskFields(input);

    const row = database
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

  function archiveTask(id: number): Task {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("A valid task ID is required.");
    }

    const row = database
      .prepare(
        `
          UPDATE tasks
          SET
            archived_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
            AND archived_at IS NULL
          RETURNING ${taskColumns}
        `,
      )
      .get(id) as TaskRow | undefined;

    if (!row) {
      throw new Error("The active task could not be found.");
    }

    return mapTaskRow(row);
  }

  return {
    getActiveTasks,
    getArchivedTasks,
    getActiveTaskById,
    createTask,
    updateTask,
    archiveTask,
  };
}