# Project Handover Steps

**User:** Anonymous  
**Created:** 7/31/2026 14:15:07  
**Updated:** 8/2/2026 14:02:33  
**Exported:** 8/2/2026 18:56:53  
**Link:** [https://chatgpt.com/g/g-p-6a64d379628c81919baa208063a5387c/c/6a6c91c2-d130-83ea-9381-8e6ba95237ae](https://chatgpt.com/g/g-p-6a64d379628c81919baa208063a5387c/c/6a6c91c2-d130-83ea-9381-8e6ba95237ae)  

## Prompt:
7/31/2026, 2:15:06 PM

[Attachment: Pasted text.txt]

## Response:
7/31/2026, 2:15:07 PM

Thanks - I’ve got the full project handover and will continue from the automated-testing slice. `Pasted text.txt`

From the `todo-app` folder, please run and paste the output of:

```powershell
git status
git log --oneline --decorate -15
```

I’ll first confirm whether the sorting/overdue slice still needs linting, building, committing, or pushing. Then we’ll implement the complete Vitest slice using a throwaway SQLite database without touching `database/todo.db`.

## Prompt:
7/31/2026, 2:15:43 PM

yea the overdue and sorting works

## Response:
7/31/2026, 2:15:46 PM

Great - that confirms the sorting and overdue behavior works manually. The remaining question is whether that slice is already committed and pushed. `Pasted text.txt`

Please paste the output of:

```powershell
git status
git log --oneline --decorate -15
```

Once we verify the repository state, we’ll move directly into the complete automated-testing slice.

## Prompt:
7/31/2026, 2:16:45 PM

PS C:\Users\bayat\Desktop\todo-app> git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
PS C:\Users\bayat\Desktop\todo-app> git log --oneline --decorate -15

b0da01d (HEAD -> main, origin/main) feat(tasks): add sorting controls and overdue indicators
06922f9 feat(tasks): add task archiving and archived view
d34ecdc feat(tasks): add task editing workflow
b73d68b feat(tasks): add task creation and active task list
10f4dfe feat(tasks): add task models and database operations
ce1c6fe docs(database): document tasks schema and design decisions
5fbf418 feat(database): add SQLite connection and schema check
1beb1e6 build(database): add SQLite dependencies
7b86380 feat(database): add initial tasks schema
d936c33 chore: scaffold initial Next.js TypeScript project
:...skipping...
b0da01d (HEAD -> main, origin/main) feat(tasks): add sorting controls and overdue indicators
06922f9 feat(tasks): add task archiving and archived view
d34ecdc feat(tasks): add task editing workflow
b73d68b feat(tasks): add task creation and active task list
10f4dfe feat(tasks): add task models and database operations
ce1c6fe docs(database): document tasks schema and design decisions
5fbf418 feat(database): add SQLite connection and schema check
1beb1e6 build(database): add SQLite dependencies
7b86380 feat(database): add initial tasks schema
d936c33 chore: scaffold initial Next.js TypeScript project
~
~
~
~
~
~
~
~
~
~
~
~
(END)

## Response:
7/31/2026, 2:16:56 PM

Your repository is clean, and the sorting/overdue slice is committed and pushed as `b0da01d`. We can move to automated testing. `Pasted text.txt`

You are currently inside Git’s pager at `(END)`. Press:

```text
q
```

Before choosing the test-database architecture, I need the exact current code. Run this from `todo-app` and paste the output:

```powershell
Get-Content package.json

Write-Output "`n--- src/lib/database.ts ---"
Get-Content src/lib/database.ts

Write-Output "`n--- src/lib/tasks.ts ---"
Get-Content src/lib/tasks.ts

Write-Output "`n--- src/lib/task-rules.ts ---"
Get-Content src/lib/task-rules.ts

Write-Output "`n--- tsconfig.json ---"
Get-Content tsconfig.json
```

I’ll use those files to build one complete testing slice covering real SQLite creation, updating, archiving, and deterministic overdue behavior-without touching `database/todo.db`.

## Prompt:
7/31/2026, 2:18:05 PM

PS C:\Users\bayat\Desktop\todo-app> Get-Content package.json
{
  "name": "todo-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "better-sqlite3": "^13.0.2",
    "next": "16.2.12",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.13",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.12",
    "typescript": "^5"
  }
}
PS C:\Users\bayat\Desktop\todo-app> 
PS C:\Users\bayat\Desktop\todo-app> Write-Output "`n--- src/lib/database.ts ---"

--- src/lib/database.ts ---
PS C:\Users\bayat\Desktop\todo-app> Get-Content src/lib/database.ts
import "server-only";

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const databaseDirectory = path.join(process.cwd(), "database");
const databasePath = path.join(databaseDirectory, "todo.db");
const schemaPath = path.join(databaseDirectory, "schema.sql");

function createDatabase(): Database.Database {
  fs.mkdirSync(databaseDirectory, { recursive: true });

  const database = new Database(databasePath);

  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");

  const schema = fs.readFileSync(schemaPath, "utf8");
  database.exec(schema);

  return database;
}

const globalForDatabase = globalThis as typeof globalThis & {
  todoDatabase?: Database.Database;
};

export const db =
  globalForDatabase.todoDatabase ?? createDatabase();

globalForDatabase.todoDatabase = db;
PS C:\Users\bayat\Desktop\todo-app> 
PS C:\Users\bayat\Desktop\todo-app> Write-Output "`n--- src/lib/tasks.ts ---"

--- src/lib/tasks.ts ---
PS C:\Users\bayat\Desktop\todo-app> Get-Content src/lib/tasks.ts
import "server-only";

import { db } from "@/lib/database";
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

export function getActiveTasks(
  sort: TaskSortOption = "dueDate",
  direction: TaskSortDirection = "asc",
): Task[] {
  const orderBy = activeTaskOrderBy[sort][direction];

  const rows = db
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

export function getArchivedTasks(): Task[] {
  const rows = db
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

export function archiveTask(id: number): Task {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("A valid task ID is required.");
  }

  const row = db
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
PS C:\Users\bayat\Desktop\todo-app> 
PS C:\Users\bayat\Desktop\todo-app> Write-Output "`n--- src/lib/task-rules.ts ---"

--- src/lib/task-rules.ts ---
PS C:\Users\bayat\Desktop\todo-app> Get-Content src/lib/task-rules.ts
import type { TaskStatus } from "@/types/task";

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
PS C:\Users\bayat\Desktop\todo-app> 
PS C:\Users\bayat\Desktop\todo-app> Write-Output "`n--- tsconfig.json ---"

--- tsconfig.json ---
PS C:\Users\bayat\Desktop\todo-app> Get-Content tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
PS C:\Users\bayat\Desktop\todo-app>

## Response:
7/31/2026, 2:18:13 PM

I’ve reviewed the current structure. The cleanest testable design is to keep `tasks.ts` server-only, extract the database operations into a repository factory, and let tests inject a temporary SQLite connection.

Your repository structure supports a clean dependency-injection approach:

- Production code keeps `server-only` protection.
- `database.ts` continues owning the real `database/todo.db` connection.
- A new repository factory accepts any SQLite connection.
- Tests create a fresh temporary SQLite file for every test and delete it afterward.
- Tests never import `database.ts`, so the development database cannot be opened or modified.

This meets the project’s throwaway-database and deterministic-testing requirements. `Pasted text.txt` Vitest supports a dedicated `vitest.config.ts`, and `vitest run` runs the suite once rather than entering watch mode. 

## 1. Install Vitest and add the test command

Run:

```powershell
npm install --save-dev vitest
npm pkg set scripts.test="vitest run"
```

Your scripts should then include:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run"
}
```

Do not manually replace the whole `package.json`; the commands above will update it and `package-lock.json`.

## 2. Create `vitest.config.ts`

Create this file in the project root:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
```

The alias allows tests to use the same `@/` imports as the application.

## 3. Create `src/lib/task-repository.ts`

This moves the reusable SQLite behaviour out of the server-only wrapper while keeping the same validation and SQL behaviour.

```ts
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
```

## 4. Replace `src/lib/tasks.ts`

Replace its current contents with:

```ts
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
```

The rest of the application can continue importing from `@/lib/tasks`; no page or Server Action imports need to change.

## 5. Create the temporary-database helper

Create the folder `tests/helpers`, then create:

`tests/helpers/create-test-database.ts`

```ts
import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export interface TestDatabase {
  database: Database.Database;
  cleanup: () => void;
}

export function createTestDatabase(): TestDatabase {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "todo-app-test-"),
  );

  const databasePath = path.join(directory, "test.db");
  const schemaPath = path.join(
    process.cwd(),
    "database",
    "schema.sql",
  );

  const database = new Database(databasePath);

  database.pragma("foreign_keys = ON");

  const schema = fs.readFileSync(schemaPath, "utf8");
  database.exec(schema);

  return {
    database,

    cleanup() {
      database.close();
      fs.rmSync(directory, {
        recursive: true,
        force: true,
      });
    },
  };
}
```

Every test will therefore use a real SQLite file under the operating system’s temporary directory. The helper loads the shipped `database/schema.sql`, so the tests also exercise the actual schema.

## 6. Create repository behaviour tests

Create:

`tests/task-repository.test.ts`

```ts
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  createTaskRepository,
  type TaskRepository,
} from "@/lib/task-repository";
import {
  createTestDatabase,
  type TestDatabase,
} from "./helpers/create-test-database";

describe("task repository", () => {
  let testDatabase: TestDatabase;
  let repository: TaskRepository;

  beforeEach(() => {
    testDatabase = createTestDatabase();
    repository = createTaskRepository(testDatabase.database);
  });

  afterEach(() => {
    testDatabase.cleanup();
  });

  it("creates and stores a task with Todo status", () => {
    const createdTask = repository.createTask({
      title: "Prepare lab demonstration",
      description: "Test the complete walkthrough",
      dueDate: "2026-08-04",
      topic: "COMS3011A",
    });

    expect(createdTask).toMatchObject({
      title: "Prepare lab demonstration",
      description: "Test the complete walkthrough",
      dueDate: "2026-08-04",
      topic: "COMS3011A",
      status: "Todo",
      archivedAt: null,
    });

    expect(
      repository.getActiveTaskById(createdTask.id),
    ).toEqual(createdTask);
  });

  it("updates and persists task fields and status", () => {
    const createdTask = repository.createTask({
      title: "Write tests",
      description: "Add repository tests",
      dueDate: "2026-08-01",
      topic: "Testing",
    });

    const updatedTask = repository.updateTask({
      id: createdTask.id,
      title: "Finish automated tests",
      description: "Cover update and archive behaviour",
      dueDate: "2026-08-02",
      topic: "Quality Assurance",
      status: "In-Progress",
    });

    expect(updatedTask).toMatchObject({
      id: createdTask.id,
      title: "Finish automated tests",
      description: "Cover update and archive behaviour",
      dueDate: "2026-08-02",
      topic: "Quality Assurance",
      status: "In-Progress",
      archivedAt: null,
    });

    expect(
      repository.getActiveTaskById(createdTask.id),
    ).toEqual(updatedTask);
  });

  it("archives a task without deleting it", () => {
    const createdTask = repository.createTask({
      title: "Archive this task",
      description: "The row must remain in the tasks table",
      dueDate: "2026-07-30",
      topic: "Archiving",
    });

    const archivedTask = repository.archiveTask(createdTask.id);

    expect(archivedTask.id).toBe(createdTask.id);
    expect(archivedTask.archivedAt).not.toBeNull();

    expect(repository.getActiveTasks()).toEqual([]);
    expect(repository.getActiveTaskById(createdTask.id)).toBeNull();

    const archivedTasks = repository.getArchivedTasks();

    expect(archivedTasks).toHaveLength(1);
    expect(archivedTasks[0]).toEqual(archivedTask);

    const countRow = testDatabase.database
      .prepare("SELECT COUNT(*) AS count FROM tasks")
      .get() as { count: number };

    expect(countRow.count).toBe(1);
  });
});
```

These three tests exercise actual inserts, updates, reads, archive filtering, and the real SQLite table.

## 7. Create deterministic overdue tests

Create:

`tests/task-rules.test.ts`

```ts
import { describe, expect, it } from "vitest";

import { isTaskOverdue } from "@/lib/task-rules";
import type { TaskStatus } from "@/types/task";

interface OverdueTestCase {
  name: string;
  dueDate: string;
  status: TaskStatus;
  expected: boolean;
}

const today = "2026-07-31";

const cases: OverdueTestCase[] = [
  {
    name: "a past Todo task is overdue",
    dueDate: "2026-07-30",
    status: "Todo",
    expected: true,
  },
  {
    name: "a past In-Progress task is overdue",
    dueDate: "2026-07-30",
    status: "In-Progress",
    expected: true,
  },
  {
    name: "a past Complete task is not overdue",
    dueDate: "2026-07-30",
    status: "Complete",
    expected: false,
  },
  {
    name: "a task due today is not overdue",
    dueDate: "2026-07-31",
    status: "Todo",
    expected: false,
  },
  {
    name: "a future task is not overdue",
    dueDate: "2026-08-01",
    status: "Todo",
    expected: false,
  },
];

describe("isTaskOverdue", () => {
  it.each(cases)(
    "$name",
    ({ dueDate, status, expected }) => {
      expect(
        isTaskOverdue(
          {
            dueDate,
            status,
          },
          today,
        ),
      ).toBe(expected);
    },
  );
});
```

The explicit `today` value prevents the test result from changing based on the actual date or timezone.

## 8. Run the complete verification

Run these commands after saving all files:

```powershell
npm test
npm run lint
npm run build
git status
```

Do not commit yet. Paste the complete output from those four commands so we can fix any errors and inspect the final changed-file list before creating the testing commit.

## Prompt:
7/31/2026, 2:26:55 PM

why are we using vitest as a testing tool as opposed to jest and other stuff

## Response:
7/31/2026, 2:26:56 PM

Vitest is not the only correct choice. **Jest would also work.** Vitest is preferable here mainly because it fits this project’s small, TypeScript-based testing slice with less setup.

### Why Vitest fits this project

Your tests are primarily:

- Node-based repository tests against `better-sqlite3`
- pure-function tests for the overdue rule
- written in TypeScript
- not currently testing rendered React components

Vitest supports TypeScript and modern ES modules directly, so we can install essentially one testing package and begin writing `.test.ts` files without configuring Babel or `ts-jest`. It also provides familiar Jest-style APIs such as `describe`, `it`, `expect`, `beforeEach`, and mocks. 

That supports the lab requirement to **keep dependencies minimal**, which is part of your project approach. `Pasted text.txt`

### Why not Jest?

Jest is mature, widely used, and officially documented by Next.js. It would be a completely defensible selection. 

However, for this project it generally introduces more configuration concerns:

- TypeScript transformation must be handled through Babel, `ts-jest`, or Next.js’s Jest integration.
- Path aliases such as `@/lib/...` need mapping.
- Modern ESM handling can require additional attention; Jest’s official documentation still characterizes its native ESM support as experimental. 
- A typical Next.js Jest setup commonly involves several development packages rather than only the runner.

None of those problems is insurmountable. They simply provide no important advantage for the repository and overdue tests we need.

### Important qualification

Vitest’s biggest advertised advantage is that it shares Vite’s transformation pipeline. Your application is **Next.js, not a Vite application**, so that particular advantage is not the reason we are selecting it. Vitest explicitly supports non-Vite projects and backend code, though. 

Next.js also maintains an official Vitest setup guide, so this is not an unusual or unsupported combination. 

### What about Playwright or Cypress?

Those are more appropriate for end-to-end browser tests:

- open the application;
- fill in the task form;
- click Edit or Archive;
- verify what appears on screen.

They require more installation and infrastructure. Your rubric presently asks for at least three deterministic tests exercising real behaviour, and repository tests against real temporary SQLite databases satisfy that efficiently. Next.js distinguishes Vitest/Jest for unit testing from Playwright/Cypress for end-to-end testing. 

### Decision

For this application:

| Tool | Suitable? | Assessment |
|---|---:|---|
| **Vitest** | Yes | Best balance of minimal setup, TypeScript support, and Jest-like syntax |
| **Jest** | Yes | Mature, but slightly more configuration than needed |
| **Playwright** | Later | Excellent for the final seven-step browser walkthrough, but excessive for this slice |
| **Cypress** | Later | Similar role to Playwright; unnecessary for current database-rule tests |
| Node test runner | Possible | Minimal dependency, but fewer convenient testing features and less conventional for this Next.js coursework |

So Vitest is not being chosen because Jest is bad. It is being chosen because **Vitest gives us everything this particular test slice needs with the smallest amount of additional tooling**.

## Prompt:
8/2/2026, 1:31:43 PM

> 4\. Replace `src/lib/tasks.ts`
> ------------------------------
> 
> Replace its current contents with:

im replacing this import "server-only";

import { db } from "@/lib/database";
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

export function getActiveTasks(
  sort: TaskSortOption = "dueDate",
  direction: TaskSortDirection = "asc",
): Task[] {
  const orderBy = activeTaskOrderBy[sort][direction];

  const rows = db
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

export function getArchivedTasks(): Task[] {
  const rows = db
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

export function archiveTask(id: number): Task {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("A valid task ID is required.");
  }

  const row = db
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

with what you gave?

## Response:
8/2/2026, 1:31:43 PM

Yes. That entire code block is the current contents of `src/lib/tasks.ts`, and you should replace it with the much smaller wrapper:

```ts
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
```

But only do that **after** creating `src/lib/task-repository.ts` with the longer repository code I gave you.

So the split becomes:

- `src/lib/task-repository.ts`  
  Contains all the SQL, validation, mapping, and repository functions.

- `src/lib/tasks.ts`  
  Connects that repository to the real production database.

This does not remove any behavior. It only moves the existing logic into a testable function that can receive either:

- the real `database/todo.db` connection in production; or
- a temporary SQLite connection during tests.

Your pages and Server Actions should keep importing from `@/lib/tasks` exactly as before.

## Prompt:
8/2/2026, 1:35:18 PM

PS C:\Users\bayat\Desktop\todo-app> npm test

> todo-app@0.1.0 test
> vitest run

(!) Your Vite config uses features that are unsupported by `configLoader: 'native'`, which is planned to become the default in a future major version of Vite:
  - ESM syntax in a file loaded as CommonJS (vitest.config.ts:1:1). Use a `.mjs` extension or set `"type": "module"` in the closest package.json
Set `VITE_CONFIG_NATIVE_IGNORE_WARNING=true` to suppress this warning.

 RUN  v4.1.10 C:/Users/bayat/Desktop/todo-app

 ✓ tests/task-rules.test.ts (5 tests) 3ms
 ✓ tests/task-repository.test.ts (3 tests) 50ms

 Test Files  2 passed (2)
      Tests  8 passed (8)
   Start at  13:34:48
   Duration  282ms (transform 73ms, setup 0ms, import 120ms, tests 53ms, environment 0ms)

PS C:\Users\bayat\Desktop\todo-app> npm run lint

> todo-app@0.1.0 lint
> eslint


C:\Users\bayat\Desktop\todo-app\src\app\sort-controls.tsx
  45:5  error  Error: Calling setState synchronously within an effect can trigger cascading renders

Effects are intended to synchronize state between React and external systems such as manually updating the DOM, state management libraries, or other platform APIs. In general, the body of an effect should do one or both of the following:
* Update external systems with the latest state from React.
* Subscribe for updates from some external system, calling setState in a callback function when external state changes.

Calling setState synchronously within an effect body causes cascading renders that can hurt performance, and is not recommended. (https://react.dev/learn/you-might-not-need-an-effect).

C:\Users\bayat\Desktop\todo-app\src\app\sort-controls.tsx:45:5
  43 |
  44 |   useEffect(() => {
> 45 |     setSelectedSort(sort);
     |     ^^^^^^^^^^^^^^^ Avoid calling setState() directly within an effect
  46 |     setSelectedDirection(direction);
  47 |   }, [sort, direction]);
  48 |  react-hooks/set-state-in-effect

✖ 1 problem (1 error, 0 warnings)

PS C:\Users\bayat\Desktop\todo-app> npm run build

> todo-app@0.1.0 build
> next build

▲ Next.js 16.2.12 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 2.5s
✓ Finished TypeScript in 2.2s    
✓ Collecting page data using 8 workers in 655ms    
✓ Generating static pages using 8 workers (4/4) in 491ms
✓ Finalizing page optimization in 21ms    

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /api/database-check
├ ƒ /archived
└ ƒ /tasks/[id]/edit


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

PS C:\Users\bayat\Desktop\todo-app> git status
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   package-lock.json
        modified:   package.json
        modified:   src/lib/tasks.ts

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        src/lib/task-repository.ts
        tests/
        vitest.config.ts

no changes added to commit (use "git add" and/or "git commit -a")
PS C:\Users\bayat\Desktop\todo-app>

## Response:
8/2/2026, 1:35:26 PM

The testing code is working: all 8 tests passed, and the production build succeeded. The only blocker is a pre-existing lint error in the committed sort controls, plus a harmless Vitest config warning.

Good progress:

- `npm test`: **8/8 tests passed**
- `npm run build`: **passed**
- Temporary SQLite test setup is working
- `database/todo.db` was not added or modified
- `npm run lint`: failed on the existing `sort-controls.tsx`, not the new tests

Because `src/app/sort-controls.tsx` does not appear in `git status`, that lint error already existed in the committed sorting slice. The problem is that the component copies incoming props into state inside `useEffect`, which React’s current lint rules reject.

Do **not commit yet**.

Please run and paste:

```powershell
Get-Content src/app/sort-controls.tsx
```

I’ll give you the smallest safe correction that preserves:

- immediate sorting;
- the Asc/Desc toggle;
- URL-based state;
- pending-navigation disabling.

The Vitest warning is non-fatal-the tests still passed-but we’ll also clean it up by changing the config to an explicitly ESM-compatible filename after fixing the lint error. `Pasted text.txt`

## Prompt:
8/2/2026, 1:36:11 PM

PS C:\Users\bayat\Desktop\todo-app> Get-Content src/app/sort-controls.tsx
"use client";

import {
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  TASK_SORT_OPTIONS,
  type TaskSortDirection,
  type TaskSortOption,
} from "@/types/task";

import styles from "./page.module.css";

const SORT_LABELS: Record<TaskSortOption, string> = {
  dueDate: "Due date",
  topic: "Topic",
  status: "Status",
};

interface SortControlsProps {
  sort: TaskSortOption;
  direction: TaskSortDirection;
}

export function SortControls({
  sort,
  direction,
}: SortControlsProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [selectedSort, setSelectedSort] = useState(sort);
  const [selectedDirection, setSelectedDirection] =
    useState(direction);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedSort(sort);
    setSelectedDirection(direction);
  }, [sort, direction]);

  function navigate(
    nextSort: TaskSortOption,
    nextDirection: TaskSortDirection,
  ) {
    setSelectedSort(nextSort);
    setSelectedDirection(nextDirection);

    const params = new URLSearchParams({
      sort: nextSort,
      direction: nextDirection,
    });

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  }

  function handleSortChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    navigate(
      event.target.value as TaskSortOption,
      selectedDirection,
    );
  }

  function toggleDirection() {
    const nextDirection =
      selectedDirection === "asc" ? "desc" : "asc";

    navigate(selectedSort, nextDirection);
  }

  const nextDirectionLabel =
    selectedDirection === "asc"
      ? "descending"
      : "ascending";

  return (
    <div
      className={styles.sortControls}
      aria-busy={isPending}
    >
      <label htmlFor="sort">Sort by</label>

      <select
        id="sort"
        className={styles.sortSelect}
        value={selectedSort}
        onChange={handleSortChange}
        disabled={isPending}
      >
        {TASK_SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {SORT_LABELS[option]}
          </option>
        ))}
      </select>

      <button
        className={styles.directionButton}
        type="button"
        onClick={toggleDirection}
        disabled={isPending}
        aria-label={`Change to ${nextDirectionLabel} order`}
      >
        {selectedDirection === "asc" ? "Asc â†‘" : "Desc â†“"}
      </button>
    </div>
  );
}
PS C:\Users\bayat\Desktop\todo-app>

## Response:
8/2/2026, 1:36:10 PM

Replace the entire `src/app/sort-controls.tsx` file with this version:

```tsx
"use client";

import { useTransition } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  TASK_SORT_OPTIONS,
  type TaskSortDirection,
  type TaskSortOption,
} from "@/types/task";

import styles from "./page.module.css";

const SORT_LABELS: Record<TaskSortOption, string> = {
  dueDate: "Due date",
  topic: "Topic",
  status: "Status",
};

interface SortControlsProps {
  sort: TaskSortOption;
  direction: TaskSortDirection;
}

export function SortControls({
  sort,
  direction,
}: SortControlsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(
    nextSort: TaskSortOption,
    nextDirection: TaskSortDirection,
  ) {
    const params = new URLSearchParams({
      sort: nextSort,
      direction: nextDirection,
    });

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  }

  function handleSortChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    navigate(
      event.target.value as TaskSortOption,
      direction,
    );
  }

  function toggleDirection() {
    const nextDirection =
      direction === "asc" ? "desc" : "asc";

    navigate(sort, nextDirection);
  }

  const nextDirectionLabel =
    direction === "asc"
      ? "descending"
      : "ascending";

  return (
    <div
      className={styles.sortControls}
      aria-busy={isPending}
    >
      <label htmlFor="sort">Sort by</label>

      <select
        id="sort"
        className={styles.sortSelect}
        value={sort}
        onChange={handleSortChange}
        disabled={isPending}
      >
        {TASK_SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {SORT_LABELS[option]}
          </option>
        ))}
      </select>

      <button
        className={styles.directionButton}
        type="button"
        onClick={toggleDirection}
        disabled={isPending}
        aria-label={`Change to ${nextDirectionLabel} order`}
      >
        {direction === "asc" ? "Asc ↑" : "Desc ↓"}
      </button>
    </div>
  );
}
```

### What changed

The `useEffect` and duplicate local state have been removed. The validated `sort` and `direction` props are now the single source of truth. React recommends avoiding Effects when state is only being synchronized with props because it causes an unnecessary additional render. 

The navigation still begins immediately when the selection or direction changes. The controls remain disabled while the route transition is pending.

I also corrected these corrupted characters:

```text
Asc â†‘
Desc â†“
```

to:

```text
Asc ↑
Desc ↓
```

### Remove the Vitest warning

Rename the config file from `.ts` to `.mts`:

```powershell
Rename-Item vitest.config.ts vitest.config.mts
```

Do not change its contents. Vitest officially recognizes `vitest.config.mts`, and the extension explicitly marks the config as an ES module. 

Then run:

```powershell
npm test
npm run lint
npm run build
git status
```

Paste those results before committing.

## Prompt:
8/2/2026, 1:38:06 PM

alls good just need to cvommit

## Response:
8/2/2026, 1:38:12 PM

Since the sort-control lint fix is separate from the testing work, make **two coherent commits**. `Pasted text.txt`

First commit the lint correction:

```powershell
git add src/app/sort-controls.tsx
git commit -m "fix(tasks): remove redundant sort control state"
```

Then commit the automated-testing slice:

```powershell
git add package.json package-lock.json src/lib/tasks.ts src/lib/task-repository.ts tests vitest.config.mts
git commit -m "test(tasks): add automated task behaviour tests"
```

Push both commits:

```powershell
git push
```

Finally confirm:

```powershell
git status
git log --oneline --decorate -5
```

You should end with a clean working tree and `main` up to date with `origin/main`.

## Prompt:
8/2/2026, 1:39:42 PM

all good whats the next move or are we done

## Response:
8/2/2026, 1:39:49 PM

You’re **not fully done yet**, but the application functionality and automated tests are complete. `Pasted text.txt`

The next coherent slice is **final documentation**:

- Complete the README with clean-clone install, run, and test commands.
- Record the actual Node.js version.
- Document every installed package and why it is used.
- Verify `docs/database-design.md` still matches `database/schema.sql`.

Run and paste:

```powershell
node --version

Write-Output "`n--- README.md ---"
Get-Content README.md

Write-Output "`n--- database design ---"
Get-Content docs/database-design.md

Write-Output "`n--- schema ---"
Get-Content database/schema.sql

Write-Output "`n--- package.json ---"
Get-Content package.json
```

After that slice, only these final checks remain:

1. Test installation and startup from a clean clone using only the README.
2. Perform the complete seven-step functional walkthrough.
3. Run `npm test`, `npm run lint`, and `npm run build`.
4. Save the required AI usage transcripts.
5. Commit and push the final documentation and verification changes.

## Prompt:
8/2/2026, 1:40:40 PM

give me a handoff not including this last waht needs to be done

## Response:
8/2/2026, 1:40:43 PM

Here’s a clean handoff for a new chat, covering the current project state without the final “what remains” section. `Pasted text.txt`

**document: **

I am continuing development of a COMS3011A Lab 1 todo application. Treat everything below as the current project state. Do not scaffold a new project.

## How I want to work

Work in coherent feature slices.

- Explain what a slice changes and why.
- Give enough connected work per response to complete a meaningful slice.
- Do not split every small file change into separate confirmation steps.
- Wait for me to report whether the complete slice worked before moving on.
- Ask me about genuine design choices before deciding for me.
- Keep dependencies minimal.
- Use Conventional Commit messages.
- Do not implement unrelated features early.
- Do not create separate frontend and backend projects.
- This is one Next.js application using server-side Next.js code for SQLite access.
- Avoid adding an ORM unless there is a strong reason.
- Keep the project working after every commit.
- Do not claim something is committed, pushed, linted, built, or tested unless I confirm it.

## Brief

Build a local-first todo application using Next.js and SQLite.

The application:

- runs locally through Node.js and npm;
- will not be deployed to the web;
- has no user accounts;
- serves one user on the machine where it runs.

Required task functionality:

- create tasks;
- edit tasks;
- archive tasks;
- archived tasks must not be deleted and must remain viewable;
- every task carries:
  - title;
  - description;
  - due date;
  - topic;
- display tasks as a list;
- sort the list by:
  - topic;
  - status;
  - due date;
- statuses are fixed:
  - Todo;
  - In-Progress;
  - Complete;
- overdue tasks must be visibly indicated;
- overdue must not be a status;
- all information must persist after restarting the application.

The required functional walkthrough is:

1. Install and start the application using only the README.
2. Create a task with all four fields and show it in the list.
3. Edit a task and ensure the change survives a page reload.
4. Archive a task so it leaves the active list but remains viewable.
5. Sort tasks by topic, status and due date.
6. Visibly flag overdue tasks without making overdue a selectable status.
7. Stop and restart the application and confirm the data persists.

Testing requirements:

- at least three tests;
- one documented command must run all tests;
- tests must exercise real behaviour;
- at least one test must cover archiving or the overdue rule;
- tests must be deterministic;
- tests must use a throwaway database rather than the development database.

The database rubric expects:

- SQLite rather than JSON or in-memory persistence;
- a visible schema file or migrations;
- archived tasks represented by a flag or timestamp on the task;
- archived tasks must not be deleted or copied to another table;
- overdue must be derived from due date and status;
- overdue must not be stored as a column;
- shipped schema and documentation must match.

The submission also requires transcripts of AI usage covering planning, code generation and debugging.

## Project information

Project folder:

todo-app

Repository:

https://github.com/Muhammed-Bayat/todo-app.git

Git:

- branch: main;
- remote: origin;
- Conventional Commits are used;
- start by checking:
  - git status
  - git log --oneline --decorate -15

Technology:

- Next.js 16.2.12;
- TypeScript;
- App Router;
- src directory;
- npm;
- ESLint;
- normal CSS;
- no Tailwind;
- no React Compiler;
- no separate API server;
- SQLite through better-sqlite3;
- no ORM;
- Vitest for automated testing.

The project was originally created directly in the repository root with approximately:

npx create-next-app@latest . --typescript --eslint --app --src-dir --no-tailwind --no-react-compiler --use-npm --import-alias "@/*" --disable-git

The application uses one local Next.js Node.js server process.

Server Actions are used for task mutations. They run inside the Next.js server and call SQLite directly. There is no manually implemented REST endpoint for creating, editing or archiving tasks.

There is one explicit diagnostic API route:

GET /api/database-check

## Installed dependencies

Runtime dependencies:

- better-sqlite3
- next
- react
- react-dom

Development dependencies include:

- @types/better-sqlite3
- @types/node
- @types/react
- @types/react-dom
- eslint
- eslint-config-next
- typescript
- vitest

The package scripts include:

- npm run dev
- npm run build
- npm start
- npm run lint
- npm test

The test command runs:

vitest run

## Database design

There is one table:

tasks

There are no additional tables and no relationships.

Design decisions:

- topic is text stored directly on each task;
- description is optional to the user;
- an omitted description is stored as an empty string rather than NULL;
- every new task starts with status Todo;
- statuses are limited to Todo, In-Progress and Complete;
- archived_at is NULL for active tasks;
- archived_at stores a timestamp for archived tasks;
- tasks are never deleted when archived;
- archived tasks remain in the same table;
- overdue is never stored;
- overdue is derived from due date and status;
- a task is overdue when:
  - its due date is before today; and
  - its status is not Complete;
- a task due today is not overdue;
- due dates use YYYY-MM-DD;
- created_at, updated_at and archived_at are timestamps.

Schema file:

database/schema.sql

Current schema:

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,

    title TEXT NOT NULL
        CHECK (length(trim(title)) > 0),

    description TEXT NOT NULL DEFAULT '',

    due_date TEXT NOT NULL
        CHECK (
            length(due_date) = 10
            AND due_date GLOB
                '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'
        ),

    topic TEXT NOT NULL
        CHECK (length(trim(topic)) > 0),

    status TEXT NOT NULL DEFAULT 'Todo'
        CHECK (
            status IN ('Todo', 'In-Progress', 'Complete')
        ),

    archived_at TEXT DEFAULT NULL,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

## Production database connection

File:

src/lib/database.ts

It:

- imports server-only;
- opens database/todo.db using better-sqlite3;
- creates the database directory if needed;
- enables WAL mode;
- enables foreign keys;
- reads and executes database/schema.sql;
- reuses one connection through globalThis during development reloads;
- exports the connection as db.

Generated SQLite files are ignored:

database/*.db
database/*.db-*
database/*.sqlite
database/*.sqlite-*
database/*.sqlite3
database/*.sqlite3-*

The schema remains tracked.

## TypeScript task models

File:

src/types/task.ts

It defines:

- TASK_STATUSES:
  - Todo
  - In-Progress
  - Complete
- TaskStatus derived from that constant;
- TASK_SORT_OPTIONS:
  - dueDate
  - topic
  - status
- TaskSortOption derived from that constant;
- TASK_SORT_DIRECTIONS:
  - asc
  - desc
- TaskSortDirection derived from that constant;
- Task;
- CreateTaskInput;
- UpdateTaskInput.

The Task interface uses camelCase:

- id
- title
- description
- dueDate
- topic
- status
- archivedAt
- createdAt
- updatedAt

UpdateTaskInput includes:

- id;
- title;
- description;
- dueDate;
- topic;
- status.

## Task repository architecture

The database operations were refactored to support automated testing without opening or modifying the development database.

File:

src/lib/task-repository.ts

It contains:

- the TaskRow interface using SQLite snake_case names;
- mapping from TaskRow to Task;
- task-field normalization;
- real YYYY-MM-DD calendar-date validation;
- fixed sorting SQL mappings;
- the TaskRepository interface;
- createTaskRepository(database).

The repository factory receives a better-sqlite3 connection and returns:

- getActiveTasks(sort, direction)
- getArchivedTasks()
- getActiveTaskById(id)
- createTask(input)
- updateTask(input)
- archiveTask(id)

File:

src/lib/tasks.ts

This remains protected with:

import "server-only";

It imports the real db connection, creates the production repository and exports the repository operations.

Pages and Server Actions continue importing task operations from:

@/lib/tasks

Tests import the repository factory directly and inject a temporary test database.

## Repository behaviour

Active reads use:

archived_at IS NULL

Archived reads use:

archived_at IS NOT NULL

Archived tasks are ordered by archive timestamp.

Editing only works for active tasks.

Archiving sets:

- archived_at = CURRENT_TIMESTAMP
- updated_at = CURRENT_TIMESTAMP

Archiving does not delete or copy the row.

Create operations use SQLite defaults for:

- ID;
- Todo status;
- active archive state;
- timestamps.

Updates change:

- title;
- description;
- due date;
- topic;
- status;
- updated_at.

Title and topic are trimmed.

Description remains a string and preserves entered whitespace.

Due dates are validated as real calendar dates.

Sorting behaviour:

- dueDate ascending: earliest first;
- dueDate descending: latest first;
- topic ascending: A-Z, case-insensitive;
- topic descending: Z-A, case-insensitive;
- status ascending:
  - Todo
  - In-Progress
  - Complete
- status descending:
  - Complete
  - In-Progress
  - Todo

SQL ordering fragments come only from fixed internal mappings, not raw URL text.

## Overdue rule

File:

src/lib/task-rules.ts

It defines:

- getLocalDateString(date = new Date())
- isTaskOverdue(task, today = getLocalDateString())

The overdue helper:

- uses the local machine date;
- compares YYYY-MM-DD strings;
- returns true only when the due date is before today and status is not Complete;
- accepts an explicit today string so tests can be deterministic.

## Server Actions

File:

src/app/actions.ts

It defines:

- createTaskAction(formData)
- updateTaskAction(taskId, formData)
- archiveTaskAction(formData)

The actions:

- extract text safely from FormData;
- validate status against TASK_STATUSES;
- call the database operations;
- revalidate relevant routes;
- redirect to / after a successful edit.

## Routes and interface

### /

File:

src/app/page.tsx

This is an async Server Component and exports:

export const dynamic = "force-dynamic";

It:

- displays the create-task form;
- accepts title, description, due date and topic;
- reads active tasks from SQLite;
- displays title, topic, due date, description and status;
- displays Edit and Archive controls;
- displays an Archived tasks navigation link;
- validates sort and direction URL search parameters;
- defaults to:
  - sort = dueDate
  - direction = asc
- passes sorting to getActiveTasks();
- calculates overdue using one shared today value for the render;
- displays an Overdue badge, changed border and highlighted due date;
- never exposes Overdue as a selectable status.

### Sort controls

File:

src/app/sort-controls.tsx

This is a small Client Component.

It:

- uses the sort and direction props as the single source of truth;
- does not duplicate the props in local state;
- has no state-synchronizing useEffect;
- uses a Sort by select;
- updates sorting immediately when the selection changes;
- has no Apply button;
- has an Asc/Desc toggle button;
- uses router.replace() to update:
  - sort
  - direction;
- disables controls while navigation is pending;
- preserves sorting after reload because it is stored in the URL;
- displays proper arrow characters:
  - Asc ↑
  - Desc ↓

The local-state removal fixed the ESLint react-hooks/set-state-in-effect error.

Example URLs:

/?sort=dueDate&direction=asc
/?sort=topic&direction=desc
/?sort=status&direction=asc

### /tasks/[id]/edit

Files:

src/app/tasks/[id]/edit/page.tsx
src/app/tasks/[id]/edit/edit.module.css

The square-bracket folder is a dynamic route segment.

Examples:

/tasks/1/edit
/tasks/27/edit

The page:

- awaits the Next.js 16 params promise;
- parses and validates the task ID;
- loads only active tasks;
- calls notFound() for invalid, missing or archived tasks;
- prefills all existing fields;
- allows editing:
  - title
  - description
  - due date
  - topic
  - status
- offers exactly the three fixed statuses;
- saves through updateTaskAction;
- redirects back to /.

### /archived

File:

src/app/archived/page.tsx

It:

- reads archived tasks;
- displays archived tasks separately;
- displays all task data plus archived_at;
- links back to the active list;
- is read-only;
- does not restore tasks because restoration is not required by the brief.

### /api/database-check

File:

src/app/api/database-check/route.ts

It:

- runs in the Node.js runtime;
- checks sqlite_master for the tasks table;
- returns JSON confirming that SQLite is connected and the table exists.

It previously returned:

{
  "database": "connected",
  "tasksTableExists": true
}

## Automated tests

Vitest is configured in:

vitest.config.mts

The config:

- uses a Node test environment;
- recognises tests/**/*.test.ts;
- maps the @ alias to the src directory;
- uses the .mts extension so the configuration is explicitly treated as an ES module.

Temporary-database helper:

tests/helpers/create-test-database.ts

It:

- creates a unique temporary directory using the operating system temp location;
- creates a real SQLite test file inside that directory;
- reads and executes the shipped database/schema.sql;
- enables foreign keys;
- returns the database connection and a cleanup function;
- closes the connection after each test;
- recursively deletes the temporary directory afterward.

The tests never import src/lib/database.ts and therefore never open or modify database/todo.db.

Repository tests:

tests/task-repository.test.ts

They cover:

1. Creating a task:
   - stores all four fields;
   - starts with Todo status;
   - starts active with archivedAt equal to null;
   - can be read back from SQLite.

2. Updating a task:
   - persists changed title;
   - persists changed description;
   - persists changed due date;
   - persists changed topic;
   - persists changed status.

3. Archiving a task:
   - removes it from active results;
   - prevents it from being loaded as active;
   - keeps it in archived results;
   - keeps the row in the tasks table;
   - does not delete or copy it.

Overdue tests:

tests/task-rules.test.ts

They use an explicit fixed today value and cover:

- a past Todo task is overdue;
- a past In-Progress task is overdue;
- a past Complete task is not overdue;
- a task due today is not overdue;
- a future task is not overdue.

The most recently reported test result was:

- 2 test files passed;
- 8 tests passed.

The most recently reported production build completed successfully.

The lint error in sort-controls.tsx was corrected by removing redundant local state and the state-synchronizing effect.

The testing and lint-fix changes were reported committed and pushed using separate Conventional Commits.

## Styling

Main stylesheet:

src/app/page.module.css

It includes:

- responsive page and panel styling;
- accessible focus states;
- task list/cards;
- task status badges;
- archive and edit controls;
- immediate sort controls using:
  - sortControls
  - sortSelect
  - directionButton;
- overdue card, badge and due-date styling;
- mobile layout below 600px.

Edit-page styling remains separate in:

src/app/tasks/[id]/edit/edit.module.css

## Functionality reported working manually

The following have been tested manually and reported working:

- creating tasks with all four fields;
- new tasks starting as Todo;
- displaying active tasks;
- data surviving reload;
- data surviving application restart;
- editing every field;
- changing status;
- edits surviving reload;
- archiving active tasks;
- archived tasks disappearing from the active list;
- archived tasks remaining viewable at /archived;
- archived data surviving restart;
- archived tasks no longer being editable;
- sorting by due date;
- sorting by topic;
- sorting by status;
- immediate sorting without an Apply button;
- Asc/Desc toggling;
- sort settings staying in the URL;
- overdue Todo and In-Progress tasks being visibly flagged;
- Complete tasks not being marked overdue;
- tasks due today not being marked overdue;
- Overdue not appearing as a status option.

## Confirmed earlier Git history

Earlier commits included:

- chore: scaffold initial Next.js TypeScript project
- feat(database): add initial tasks schema
- build(database): add SQLite dependencies
- feat(database): add SQLite connection and schema check
- docs(database): document tasks schema and design decisions
- feat(tasks): add task models and database operations
- feat(tasks): add task creation and active task list
- feat(tasks): add task editing workflow
- feat(tasks): add task archiving and archived view
- feat(tasks): add sorting controls and overdue indicators

The following later commits were used for the testing work:

- fix(tasks): remove redundant sort control state
- test(tasks): add automated task behaviour tests

Do not assume the repository state from this handoff alone. Begin by running:

git status
git log --oneline --decorate -15



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)