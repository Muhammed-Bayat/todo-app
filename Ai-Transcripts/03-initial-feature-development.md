# AI Usage Transcript 03: Initial Task Feature Development

This is a verbatim transcript. Prompt and response text is copied directly from the named raw source; spelling, grammar, timestamps, code, command output, and corrections are preserved. Added headings and source labels are editorial metadata only.

Source coverage: all exchanges in `raw files/ChatGPT-COMS3011A Todo App Development.md` (original exchanges 1-25).

## Exchange 1

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 1.

### User prompt

7/31/2026, 8:31:32 AM

I am continuing development of a COMS3011A Lab 1 todo application. Please treat the information below as the current project state and continue from it rather than scaffolding a new project.

## How I want to work

Work with me one step at a time.

- Do not give me the entire implementation at once.
- Explain what each step does and why before I run or add it.
- Wait for me to confirm that each step worked before continuing.
- Ask me about genuine design choices before deciding for me.
- Keep dependencies minimal.
- Use Conventional Commit messages.
- Do not implement unrelated features early.
- Do not create separate frontend and backend projects.
- This is one Next.js application using server-side Next.js code for SQLite access.
- Avoid adding an ORM unless there is a strong reason.
- Keep the project in a working state after each commit.

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
- tests must use a throwaway database rather than my development database.

Documentation requirements:

- Third-Party Code:
  - list every installed library/package;
  - give one line explaining why each was chosen.
- Database Design:
  - describe the tables and relationships;
  - ensure it matches the shipped schema.
- Running It:
  - state the Node version;
  - include exact commands to install, run and test from a clean clone.

The database rubric specifically expects:

- SQLite, not JSON or in-memory persistence;
- a visible schema file or migrations;
- archived tasks represented by a flag or timestamp on the task;
- archived tasks must not be deleted or copied to another table;
- overdue must be derived from due date and status;
- overdue must not be stored as a column;
- the shipped schema must match the database documentation.

## Current project setup

Project folder:

todo-app

Repository:

https://github.com/Muhammed-Bayat/todo-app.git

Git:

- branch: main;
- remote: origin;
- commits are already pushed;
- use Conventional Commits for future work.

Technology:

- Next.js;
- TypeScript;
- App Router;
- src directory;
- npm;
- ESLint;
- normal CSS;
- no Tailwind;
- no separate API server;
- SQLite through better-sqlite3.

The initial project was created directly in the repository root with approximately these options:

npx create-next-app@latest . --typescript --eslint --app --src-dir --no-tailwind --no-react-compiler --use-npm --import-alias "@/*" --disable-git

The following have already passed:

npm run dev
npm run lint
npm run build

## Installed SQLite dependencies

Runtime dependency:

better-sqlite3

Development dependency:

@types/better-sqlite3

No ORM has been installed.

## Current database design

There is one table:

tasks

There are no additional tables and currently no relationships.

The design decisions are:

- topic is stored directly as text on each task;
- description is optional for the user;
- description is stored as an empty string rather than NULL when omitted;
- every new task starts with status Todo;
- statuses are limited to Todo, In-Progress and Complete;
- archived_at is NULL for active tasks;
- archived_at contains a timestamp for archived tasks;
- tasks are never deleted when archived;
- overdue is not stored;
- overdue is derived when reading/displaying tasks;
- a task is overdue when:
  - its due date is before today; and
  - its status is not Complete;
- a task due today is not overdue;
- due dates are stored as YYYY-MM-DD;
- created_at, updated_at and archived_at are timestamps.

## Existing schema

File:

database/schema.sql

Contents:

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

## Existing database connection

File:

src/lib/database.ts

It currently:

- imports server-only;
- opens database/todo.db using better-sqlite3;
- creates the database directory when needed;
- enables WAL mode;
- enables foreign keys;
- reads and executes database/schema.sql;
- reuses one connection through globalThis during development reloads.

## Existing database check

File:

src/app/api/database-check/route.ts

It:

- runs in the Node.js runtime;
- imports the database connection;
- checks sqlite_master for the tasks table;
- returns JSON showing that the database is connected and the tasks table exists.

Opening:

http://localhost:3000/api/database-check

successfully returned:

{
  "database": "connected",
  "tasksTableExists": true
}

The database/todo.db file was created successfully.

## Git ignore state

Generated SQLite files are ignored, including:

database/*.db
database/*.db-*
database/*.sqlite
database/*.sqlite-*
database/*.sqlite3
database/*.sqlite3-*

The schema file remains tracked.

## Existing documentation

File:

docs/database-design.md

It documents:

- the single tasks table;
- every column and constraint;
- the fixed status design;
- archive using archived_at;
- overdue being derived;
- YYYY-MM-DD date storage;
- the fact that there are currently no relationships.

## Existing commits

Commits already made include work equivalent to:

- chore: scaffold initial Next.js TypeScript project
- feat(database): add initial tasks schema
- build(database): add SQLite dependencies
- feat(database): add SQLite connection and schema check
- docs(database): document tasks schema and design decisions

## Current stopping point

The setup and SQLite foundation are complete.

No real task features have been implemented yet.

The next development goal is the first functional slice:

- define the TypeScript task types;
- create the database operations needed to create and read tasks;
- then build the smallest interface that can create a task and display it.

Do not begin with editing, archiving, sorting or overdue UI yet.

Start by helping me define the TypeScript Task model so that it accurately matches the SQLite schema. Explain the choices first, and then wait for my confirmation before giving me the file contents.

### Assistant response

7/31/2026, 8:31:44 AM

The TypeScript model should mirror the schema without introducing behaviour that is not stored in SQLite.

### Recommended model choices

Create the shared model in:

`src/types/task.ts`

It should contain:

- **`TaskStatus`** as a string union:
  - `"Todo"`
  - `"In-Progress"`
  - `"Complete"`

  This gives TypeScript the same fixed set enforced by the SQLite `CHECK` constraint.

- **`Task`** with:
  - `id: number`
  - `title: string`
  - `description: string`
  - `dueDate: string`
  - `topic: string`
  - `status: TaskStatus`
  - `archivedAt: string | null`
  - `createdAt: string`
  - `updatedAt: string`

### Why these types

Dates should remain strings rather than JavaScript `Date` objects:

- `dueDate` is intentionally stored as `YYYY-MM-DD`.
- SQLite returns timestamp fields as text.
- Converting them automatically to `Date` objects could introduce timezone-related mistakes.
- We can parse or format them only where the UI actually needs it.

`description` should be `string`, not optional or nullable, because the database always stores an omitted description as `""`.

`archivedAt` must allow `null`, because `NULL` represents an active task.

The model should **not** contain an `overdue` database field. Overdue is derived from `dueDate` and `status`. Later, we can either calculate it in a helper or add it to a separate view-model type used by the interface.

### One design choice

I recommend using **camelCase in TypeScript** (`dueDate`, `archivedAt`) even though SQLite uses snake_case (`due_date`, `archived_at`). The database operations will map between the two formats. This keeps the React and TypeScript code idiomatic while preserving the existing schema.

The alternative is to use snake_case everywhere and return database rows directly, which requires less mapping but leaks database naming into the rest of the application.

Confirm whether you want the recommended **camelCase TypeScript model with explicit database mapping**, and then I’ll give you the contents of `src/types/task.ts`.

## Exchange 2

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 2.

### User prompt

7/31/2026, 8:35:09 AM

yes camelCase is fine

### Assistant response

7/31/2026, 8:35:21 AM

Create this file:

`src/types/task.ts`

```ts
export type TaskStatus = "Todo" | "In-Progress" | "Complete";

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
```

This file only describes a task after it has been read from the database. It does not yet define the data required to create a new task, because fields such as `id`, `status`, and timestamps are generated automatically.

After saving the file, run:

```powershell
npm run lint
```

Tell me whether it passes.

## Exchange 3

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 3.

### User prompt

7/31/2026, 8:36:20 AM

it does , continue

### Assistant response

7/31/2026, 8:36:41 AM

Next, define the input shape for creating a task.

I recommend adding a separate `CreateTaskInput` interface to `src/types/task.ts` with only the fields the user supplies:

- `title: string`
- `description: string`
- `dueDate: string`
- `topic: string`

It should not include:

- `id`, because SQLite generates it;
- `status`, because new tasks always start as `"Todo"`;
- `archivedAt`, because new tasks are active;
- timestamps, because SQLite generates them.

Keeping this separate from `Task` prevents database-generated fields from accidentally being required when creating a task.

I also recommend keeping `description` required at the TypeScript boundary, even though the form may allow it to be left blank. The form or database function will normalize an omitted value to `""`, matching the schema.

Confirm and I’ll give you the small update to `src/types/task.ts`.

## Exchange 4

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 4.

### User prompt

7/31/2026, 8:37:24 AM

sounds good

### Assistant response

7/31/2026, 8:37:29 AM

Update `src/types/task.ts` so it contains:

```ts
export type TaskStatus = "Todo" | "In-Progress" | "Complete";

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
```

`CreateTaskInput` represents only the values supplied when creating a task. The database will provide the ID, default status, archive state, and timestamps.

Run:

```powershell
npm run lint
```

Tell me whether it passes.

## Exchange 5

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 5.

### User prompt

7/31/2026, 8:37:59 AM

all good carry on

### Assistant response

7/31/2026, 8:38:07 AM

Next, we should create a small database module for task operations:

`src/lib/tasks.ts`

For the first step, I recommend that it contain:

- a private `TaskRow` interface matching SQLite’s snake_case column names;
- a private `mapTaskRow()` function that converts a database row into the camelCase `Task` model;
- a public `getActiveTasks()` function that reads tasks where `archived_at IS NULL`.

The query should order by `created_at DESC` for now. This is only a predictable default display order; the required topic, status, and due-date sorting will be added later.

Using a dedicated mapping function is useful because `better-sqlite3` returns untyped database rows. It also keeps SQLite naming contained inside the database layer.

For this first read function, I recommend returning only active tasks. Archived tasks will later get a separate function such as `getArchivedTasks()`, which makes the intended view explicit and avoids accidentally mixing archived tasks into the main list.

Confirm this structure, and I’ll give you the contents of `src/lib/tasks.ts`.

## Exchange 6

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 6.

### User prompt

7/31/2026, 8:38:41 AM

yes

### Assistant response

7/31/2026, 8:38:52 AM

I’m checking the existing database export so the new module matches your current code exactly, rather than guessing the import shape.

Create:

`src/lib/tasks.ts`

Your existing database module exports the connection as `db`, so this file imports that exact name. 

```ts
import "server-only";

import { db } from "@/lib/database";
import type { Task, TaskStatus } from "@/types/task";

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
```

### What this does

`TaskRow` represents the database result exactly, including its snake_case column names. It stays private because the rest of the application should use the camelCase `Task` interface.

`mapTaskRow()` is the boundary between SQLite data and application data. Any future database-to-TypeScript conversion can remain in this module.

`getActiveTasks()`:

- selects every task column explicitly;
- excludes archived tasks using `archived_at IS NULL`;
- shows newer tasks first;
- uses `id DESC` as a tie-breaker when tasks have the same timestamp;
- returns camelCase `Task[]`.

Run:

```powershell
npm run lint
```

Tell me whether it passes.

## Exchange 7

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 7.

### User prompt

7/31/2026, 8:40:31 AM

yes carry on

### Assistant response

7/31/2026, 8:40:32 AM

Next we’ll add the write path for creating a task, but first I’m verifying the current module signatures so the function fits your code without changing working pieces.

Next, we’ll add `createTask()` to `src/lib/tasks.ts`.

### Proposed behaviour

The function will:

1. Accept a `CreateTaskInput`.
2. Normalize user-entered text:
   - trim `title`;
   - trim `topic`;
   - keep `description` as entered, except normalize a missing value to `""`.
3. Validate that:
   - title is not empty;
   - topic is not empty;
   - due date is a real calendar date in `YYYY-MM-DD` format.
4. Insert only the user-controlled fields:
   - `title`;
   - `description`;
   - `due_date`;
   - `topic`.
5. Let SQLite supply:
   - the ID;
   - `"Todo"` status;
   - active archive state;
   - timestamps.
6. Return the newly created task as a camelCase `Task`.

Validating the due date in TypeScript is useful because the existing SQLite constraint checks its shape, but a value such as `2026-99-99` still matches that shape.

I recommend preserving whitespace inside the description rather than trimming it automatically, because spaces and line breaks may be intentional. Title and topic should be trimmed because leading or trailing spaces are unlikely to be meaningful.

The function will use SQLite’s `RETURNING` clause so creation and reading the generated task happen in one statement.

Confirm this behaviour, and I’ll provide the update to `src/lib/tasks.ts`.

## Exchange 8

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 8.

### User prompt

7/31/2026, 8:41:24 AM

sounds goof

### Assistant response

7/31/2026, 8:41:50 AM

Update `src/lib/tasks.ts` to:

```ts
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
```

A few details:

- `isValidDate()` rejects impossible dates such as `2026-02-30`.
- The insert omits `status`, `archived_at`, and timestamps so SQLite uses the schema defaults.
- `RETURNING` gives us the complete stored row immediately after insertion.
- The returned database row is converted into the camelCase `Task` model.

Run:

```powershell
npm run lint
```

Tell me whether it passes.

## Exchange 9

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 9.

### User prompt

7/31/2026, 8:42:42 AM

carry on

### Assistant response

7/31/2026, 8:42:53 AM

The database layer is now ready for the first interface slice.

The next step is choosing how the form sends task data to the server:

### Recommended: Next.js Server Action

A Server Action would:

- receive the form submission directly;
- call `createTask()`;
- refresh the page so `getActiveTasks()` shows the new task;
- avoid client-side `fetch`, React state, and an extra API endpoint;
- keep SQLite access entirely on the server.

The alternative is a `POST /api/tasks` route, but that would require more code: converting form data to JSON, calling `fetch`, handling the response, and refreshing the list manually. We can still introduce API endpoints later if the rubric explicitly requires CRUD endpoints, but they are unnecessary for this first functional slice.

I recommend creating a Server Action named `createTaskAction` first. It will validate the submitted form fields, call the database function, and use `revalidatePath("/")`.

Confirm that you’re happy to use a **Server Action** for task creation, and then I’ll provide that file.

## Exchange 10

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 10.

### User prompt

7/31/2026, 8:44:50 AM

read the brief again and based on it tell me whats the way forward... give a short summary of exactly what was done and then give me the commit message , using the correct and past convention

[Attachment: lab_one.pdf]

### Assistant response

7/31/2026, 8:44:51 AM

Based on the brief, a **Server Action is appropriate** for task creation. The brief requires working behaviour, SQLite persistence, tests, documentation, and a clean walkthrough; it does not require REST API endpoints. The immediate target should therefore be the smallest working slice that lets a user create a task with all four fields and see it in the active-task list. `lab_one.pdf`

## What has been completed

- Added `TaskStatus`, matching the three fixed database statuses.
- Added the camelCase `Task` model matching every column in `tasks`.
- Added `CreateTaskInput` containing only the four user-supplied fields.
- Added a private SQLite row type using snake_case.
- Added mapping from SQLite rows to the camelCase application model.
- Added `getActiveTasks()` to read non-archived tasks.
- Added `createTask()` with:
  - title and topic normalization;
  - real `YYYY-MM-DD` date validation;
  - SQLite defaults for status, archive state, ID, and timestamps;
  - return of the newly stored task.
- `npm run lint` passes.

No interface, Server Action, editing, archiving, sorting, overdue display, or tests have been implemented yet.

## Way forward

First commit this coherent database/task-model slice. Then:

1. Add a `createTaskAction`.
2. Build the smallest form containing title, description, due date, and topic.
3. Read active tasks in the home page and display them as a list.
4. Confirm creation, reload persistence, and restart persistence.
5. Commit that as the first complete functional slice.

Afterward, implement editing, archiving with an archived view, sorting, overdue indication, tests using a throwaway database, and the remaining README/documentation requirements. Those map directly to the walkthrough and rubric on pages 2-3. `lab_one.pdf`

Before committing, run:

```powershell
npm run lint
npm run build
```

Use this Conventional Commit message:

```text
feat(tasks): add task models and database operations
```

## Exchange 11

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 11.

### User prompt

7/31/2026, 8:47:16 AM

PS C:\Users\bayat\Desktop\todo-app> npm run build

> todo-app@0.1.0 build
> next build

▲ Next.js 16.2.12 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 2.3s
✓ Finished TypeScript in 1563ms    
✓ Collecting page data using 6 workers in 487ms    
✓ Generating static pages using 6 workers (5/5) in 489ms
✓ Finalizing page optimization in 16ms    

Route (app)
┌ ○ /
├ ○ /_not-found
└ ƒ /api/database-check


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

PS C:\Users\bayat\Desktop\todo-app>

### Assistant response

7/31/2026, 8:47:28 AM

The build passed, so this slice is in a working state.

Now run:

```powershell
git status
```

Paste the output here before staging anything, so we can confirm that only the intended task-model and database-operation files will be included.

## Exchange 12

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 12.

### User prompt

7/31/2026, 8:47:57 AM

yea ive commited and pushed lets move on , do more work per response from now on

### Assistant response

7/31/2026, 8:48:12 AM

## First functional slice: create and display tasks

This step adds three connected pieces:

- a **Server Action** that receives form data and calls `createTask()`;
- a **server-rendered home page** that reads active tasks with `getActiveTasks()`;
- a small accessible interface containing all four required task fields.

The page is marked `force-dynamic` so it reads the local SQLite database when requested instead of being frozen as static build output.

### 1. Create `src/app/actions.ts`

```ts
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
```

The helper prevents missing or unexpected form values from becoming strings such as `"null"`.

`revalidatePath("/")` tells Next.js to refresh the task list after the database insert succeeds.

---

### 2. Replace `src/app/page.tsx`

```tsx
import styles from "./page.module.css";

import { createTaskAction } from "@/app/actions";
import { getActiveTasks } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export default function Home() {
  const tasks = getActiveTasks();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Todo</h1>
          <p>Create tasks and keep track of what needs to be done.</p>
        </header>

        <section className={styles.panel} aria-labelledby="create-task-heading">
          <h2 id="create-task-heading">Create a task</h2>

          <form action={createTaskAction} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={200}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="topic">Topic</label>
              <input
                id="topic"
                name="topic"
                type="text"
                required
                maxLength={100}
              />
            </div>

            <button className={styles.button} type="submit">
              Create task
            </button>
          </form>
        </section>

        <section className={styles.panel} aria-labelledby="active-tasks-heading">
          <div className={styles.sectionHeading}>
            <h2 id="active-tasks-heading">Active tasks</h2>
            <span>
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {tasks.length === 0 ? (
            <p className={styles.emptyState}>
              No active tasks yet. Create your first task above.
            </p>
          ) : (
            <ul className={styles.taskList}>
              {tasks.map((task) => (
                <li className={styles.task} key={task.id}>
                  <div className={styles.taskHeading}>
                    <h3>{task.title}</h3>
                    <span className={styles.status}>{task.status}</span>
                  </div>

                  <dl className={styles.taskDetails}>
                    <div>
                      <dt>Topic</dt>
                      <dd>{task.topic}</dd>
                    </div>

                    <div>
                      <dt>Due date</dt>
                      <dd>{task.dueDate}</dd>
                    </div>
                  </dl>

                  {task.description.length > 0 && (
                    <p className={styles.description}>{task.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
```

This page deliberately does not include editing, archiving, sorting, or overdue styling yet.

---

### 3. Replace `src/app/page.module.css`

```css
.page {
  min-height: 100vh;
  padding: 48px 20px;
  background: #f4f6f8;
  color: #1f2933;
}

.main {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
}

.header {
  margin-bottom: 32px;
}

.header h1 {
  margin: 0 0 8px;
  font-size: 2.5rem;
}

.header p {
  margin: 0;
  color: #52606d;
}

.panel {
  margin-bottom: 24px;
  padding: 24px;
  border: 1px solid #d9e2ec;
  border-radius: 12px;
  background: #ffffff;
}

.panel h2 {
  margin-top: 0;
}

.form {
  display: grid;
  gap: 18px;
}

.field {
  display: grid;
  gap: 6px;
}

.field label {
  font-weight: 600;
}

.field input,
.field textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #9fb3c8;
  border-radius: 6px;
  background: #ffffff;
  color: inherit;
  font: inherit;
}

.field textarea {
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  outline: 3px solid #bcccdc;
  outline-offset: 1px;
  border-color: #486581;
}

.button {
  width: fit-content;
  padding: 10px 18px;
  border: 0;
  border-radius: 6px;
  background: #243b53;
  color: #ffffff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.button:hover {
  background: #334e68;
}

.button:focus-visible {
  outline: 3px solid #829ab1;
  outline-offset: 2px;
}

.sectionHeading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

.sectionHeading span {
  color: #52606d;
}

.emptyState {
  margin-bottom: 0;
  color: #52606d;
}

.taskList {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.task {
  padding: 18px;
  border: 1px solid #d9e2ec;
  border-radius: 8px;
}

.taskHeading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.taskHeading h3 {
  margin: 0;
}

.status {
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 999px;
  background: #e4e7eb;
  font-size: 0.875rem;
  font-weight: 600;
}

.taskDetails {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  margin: 16px 0 0;
}

.taskDetails div {
  display: grid;
  gap: 2px;
}

.taskDetails dt {
  color: #52606d;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.taskDetails dd {
  margin: 0;
}

.description {
  margin: 16px 0 0;
  white-space: pre-wrap;
}

@media (max-width: 600px) {
  .page {
    padding: 24px 12px;
  }

  .panel {
    padding: 18px;
  }

  .taskHeading,
  .sectionHeading {
    align-items: flex-start;
    flex-direction: column;
  }
}
```

## Verify the slice

Run:

```powershell
npm run lint
npm run build
npm run dev
```

Then check:

1. Open `http://localhost:3000`.
2. Create a task using all four fields.
3. Confirm it appears under **Active tasks** with status `Todo`.
4. Reload the page and confirm it remains.
5. Stop the development server with `Ctrl+C`.
6. Run `npm run dev` again and confirm the task still exists.

Tell me what happened, including any terminal or browser error.

## Exchange 13

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 13.

### User prompt

7/31/2026, 8:52:58 AM

nope alls good and working

### Assistant response

7/31/2026, 8:53:13 AM

Great. This completes walkthrough step 2: a task can be created with all four fields, appears in the list, and persists through reloads and restarts. `lab_one.pdf`

Commit and push this slice:

```powershell
git add src/app/actions.ts src/app/page.tsx src/app/page.module.css
git commit -m "feat(tasks): add task creation and active task list"
git push
```

## Next slice: edit tasks

The next requirement is editing an existing task and confirming that the change survives a page reload.

I recommend:

- adding `getTaskById()` and `updateTask()` to `src/lib/tasks.ts`;
- adding an **Edit** link beside each task;
- creating `/tasks/[id]/edit`;
- rendering a server-side form prefilled with the existing values;
- submitting through a Server Action;
- redirecting back to `/` after saving.

A separate edit page is simpler than inline editing because it avoids client-side state, keeps JavaScript minimal, and gives the form a clear accessible page and URL.

The status field should also be editable there, because the application must eventually allow tasks to move between `Todo`, `In-Progress`, and `Complete`.

Confirm the separate edit-page approach, and I’ll give you the complete editing slice.

## Exchange 14

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 14.

### User prompt

7/31/2026, 8:55:15 AM

just before that when you say server action we dont actaully have a server with api end points right so what exactly do you mean

### Assistant response

7/31/2026, 8:55:36 AM

You **do have a server**, but you do **not have a separate backend project or manually created API endpoint** for task creation.

When you run:

```powershell
npm run dev
```

Next.js starts a Node.js server on your machine. That one process handles:

- rendering server components;
- running Server Actions;
- accessing SQLite;
- serving the browser interface;
- handling any explicit API routes such as `/api/database-check`.

### What a Server Action is

This code:

```ts
"use server";

export async function createTaskAction(formData: FormData) {
  createTask(...);
  revalidatePath("/");
}
```

is a function that can only execute inside the Next.js server process.

When the form contains:

```tsx
<form action={createTaskAction}>
```

the flow is approximately:

```text
Browser form
    ↓ POST request managed by Next.js
Next.js Server Action
    ↓
createTask()
    ↓
SQLite database/todo.db
    ↓
Page is refreshed with the updated task list
```

Next.js internally creates the networking mechanism needed to call the action. We do not manually define something like:

```text
POST /api/tasks
```

or write a `fetch()` call.

### What your project currently has

You have:

- **one Next.js application**;
- **one local Node.js server process**;
- **one explicit API endpoint**, `/api/database-check`;
- **one Server Action**, `createTaskAction`;
- SQLite access that runs only on the server side.

You do not have:

- a separate Express backend;
- a separate frontend project;
- a separate API server;
- a public REST endpoint for creating tasks.

### Server Action versus API endpoint

An API endpoint would look like:

```text
POST /api/tasks
```

The browser would call it manually:

```ts
fetch("/api/tasks", {
  method: "POST",
  body: JSON.stringify(task),
});
```

A Server Action lets Next.js manage that request for us:

```tsx
<form action={createTaskAction}>
```

Both approaches still involve communication between the browser and the local Next.js server. The difference is that Server Actions hide most of the request-handling boilerplate.

For this lab, Server Actions are a sensible choice because the brief requires working task behaviour and SQLite persistence, not a REST API. The database remains safely server-side while everything stays inside one Next.js project.

## Exchange 15

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 15.

### User prompt

7/31/2026, 8:57:02 AM

okay i see , then continue with what you recomended for editiing tasks

### Assistant response

7/31/2026, 8:57:03 AM

This slice implements the brief’s third walkthrough requirement: edit an existing task and ensure the change survives a reload. `lab_one.pdf`

We’ll add:

- an update input type;
- database read/update operations;
- an update Server Action;
- an Edit link on each active task;
- a dedicated `/tasks/[id]/edit` page.

In Next.js 16, dynamic route parameters are asynchronous, so the edit page must await `params`. The form can bind the task ID to a Server Action, which updates SQLite, revalidates the home page, and redirects back. 

## 1. Update `src/types/task.ts`

Replace it with:

```ts
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
```

`TASK_STATUSES` now gives us one shared runtime list for the edit form and validation, while `TaskStatus` is still derived from those exact values.

---

## 2. Replace `src/lib/tasks.ts`

```ts
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
```

Important points:

- `normalizeTaskFields()` is reused for creation and editing.
- `getActiveTaskById()` does not return archived tasks.
- `updateTask()` changes the four task fields, status, and `updated_at`.
- The update does not alter `created_at` or `archived_at`.
- No task can be deleted through this operation.

---

## 3. Replace `src/app/actions.ts`

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createTask, updateTask } from "@/lib/tasks";
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
```

After a successful update, the action redirects back to the active-task list.

---

## 4. Add the Edit link to `src/app/page.tsx`

Add this import at the top:

```tsx
import Link from "next/link";
```

Find this existing block:

```tsx
<div className={styles.taskHeading}>
  <h3>{task.title}</h3>
  <span className={styles.status}>{task.status}</span>
</div>
```

Replace it with:

```tsx
<div className={styles.taskHeading}>
  <h3>{task.title}</h3>

  <div className={styles.taskActions}>
    <span className={styles.status}>{task.status}</span>

    <Link
      className={styles.editLink}
      href={`/tasks/${task.id}/edit`}
    >
      Edit
    </Link>
  </div>
</div>
```

Then add these classes to the end of `src/app/page.module.css`:

```css
.taskActions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.editLink {
  color: #243b53;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.editLink:hover {
  color: #486581;
}

.editLink:focus-visible {
  border-radius: 3px;
  outline: 3px solid #bcccdc;
  outline-offset: 3px;
}
```

---

## 5. Create the edit page

Create this folder structure:

```text
src/app/tasks/[id]/edit/
```

Then create:

`src/app/tasks/[id]/edit/page.tsx`

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateTaskAction } from "@/app/actions";
import { getActiveTaskById } from "@/lib/tasks";
import { TASK_STATUSES } from "@/types/task";

import styles from "./edit.module.css";

export const dynamic = "force-dynamic";

interface EditTaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTaskPage({
  params,
}: EditTaskPageProps) {
  const { id } = await params;
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    notFound();
  }

  const task = getActiveTaskById(taskId);

  if (!task) {
    notFound();
  }

  const updateTaskWithId = updateTaskAction.bind(
    null,
    task.id,
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <Link className={styles.backLink} href="/">
            ← Back to tasks
          </Link>

          <h1>Edit task</h1>
          <p>Update the task details or change its status.</p>
        </header>

        <section
          className={styles.panel}
          aria-labelledby="edit-task-heading"
        >
          <h2 id="edit-task-heading">{task.title}</h2>

          <form action={updateTaskWithId} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={task.title}
                required
                maxLength={200}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={task.description}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                defaultValue={task.dueDate}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="topic">Topic</label>
              <input
                id="topic"
                name="topic"
                type="text"
                defaultValue={task.topic}
                required
                maxLength={100}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                defaultValue={task.status}
                required
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formActions}>
              <button className={styles.button} type="submit">
                Save changes
              </button>

              <Link className={styles.cancelLink} href="/">
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
```

---

## 6. Create the edit-page CSS

Create:

`src/app/tasks/[id]/edit/edit.module.css`

```css
.page {
  min-height: 100vh;
  padding: 48px 20px;
  background: #f4f6f8;
  color: #1f2933;
}

.main {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
}

.header {
  margin-bottom: 32px;
}

.header h1 {
  margin: 20px 0 8px;
  font-size: 2.5rem;
}

.header p {
  margin: 0;
  color: #52606d;
}

.backLink,
.cancelLink {
  color: #243b53;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.backLink:hover,
.cancelLink:hover {
  color: #486581;
}

.backLink:focus-visible,
.cancelLink:focus-visible {
  border-radius: 3px;
  outline: 3px solid #bcccdc;
  outline-offset: 3px;
}

.panel {
  padding: 24px;
  border: 1px solid #d9e2ec;
  border-radius: 12px;
  background: #ffffff;
}

.panel h2 {
  margin-top: 0;
}

.form {
  display: grid;
  gap: 18px;
}

.field {
  display: grid;
  gap: 6px;
}

.field label {
  font-weight: 600;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #9fb3c8;
  border-radius: 6px;
  background: #ffffff;
  color: inherit;
  font: inherit;
}

.field textarea {
  resize: vertical;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: #486581;
  outline: 3px solid #bcccdc;
  outline-offset: 1px;
}

.formActions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.button {
  padding: 10px 18px;
  border: 0;
  border-radius: 6px;
  background: #243b53;
  color: #ffffff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.button:hover {
  background: #334e68;
}

.button:focus-visible {
  outline: 3px solid #829ab1;
  outline-offset: 2px;
}

@media (max-width: 600px) {
  .page {
    padding: 24px 12px;
  }

  .panel {
    padding: 18px;
  }

  .formActions {
    align-items: flex-start;
    flex-direction: column;
  }
}
```

## Verify the editing slice

Run:

```powershell
npm run lint
npm run build
npm run dev
```

Then:

1. Open the home page.
2. Click **Edit** on an existing task.
3. Confirm all existing values are prefilled.
4. Change the title, description, due date, topic, and status.
5. Click **Save changes**.
6. Confirm you return to `/` and see the updated values.
7. Reload the browser and confirm the changes remain.
8. Stop and restart `npm run dev`, then confirm they still remain.

Send me the result or the complete error output before committing.

## Exchange 16

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 16.

### User prompt

7/31/2026, 9:05:25 AM

just quickly why the [id] like that with the square brackets

### Assistant response

7/31/2026, 9:05:30 AM

In the Next.js App Router, square brackets mean a **dynamic route segment**.

So this folder:

```text
src/app/tasks/[id]/edit/
```

matches URLs like:

```text
/tasks/1/edit
/tasks/27/edit
/tasks/105/edit
```

The value in that position becomes the route parameter named `id`.

For:

```text
/tasks/27/edit
```

Next.js gives the page:

```ts
params.id === "27"
```

We then convert it to a number:

```ts
const taskId = Number(id);
```

That lets the edit page load task `27` from SQLite.

Without square brackets, a folder named `id` would only match the literal URL:

```text
/tasks/id/edit
```

So `[id]` means: **“this part of the URL varies, and call its value `id`.”**

## Exchange 17

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 17.

### User prompt

7/31/2026, 9:06:25 AM

can i test it out like add tasks and edit?

### Assistant response

7/31/2026, 9:06:29 AM

Yes. After you add the editing files and changes, run:

```powershell
npm run dev
```

Then test this flow:

1. Open `http://localhost:3000`.
2. Create two or three tasks using all four fields.
3. Confirm each new task appears with status `Todo`.
4. Click **Edit** on one task.
5. Change its title, description, due date, topic, and status.
6. Click **Save changes**.
7. Confirm the updated values appear on the home page.
8. Reload the browser and confirm the changes remain.
9. Stop the server with `Ctrl+C`, restart with `npm run dev`, and confirm the tasks and edits still remain.

Also test the three status options:

```text
Todo
In-Progress
Complete
```

Do not manually edit or delete `database/todo.db`; the tasks you create are useful development data and should persist locally.

## Exchange 18

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 18.

### User prompt

7/31/2026, 9:13:00 AM

yea working good

### Assistant response

7/31/2026, 9:13:12 AM

Great - editing is now working and satisfies walkthrough step 3: an existing task can be changed and the update survives reloads. `lab_one.pdf`

Run one final check:

```powershell
npm run lint
npm run build
```

Then commit and push:

```powershell
git add src/types/task.ts src/lib/tasks.ts src/app/actions.ts src/app/page.tsx src/app/page.module.css "src/app/tasks/[id]/edit/page.tsx" "src/app/tasks/[id]/edit/edit.module.css"

git commit -m "feat(tasks): add task editing workflow"

git push
```

## Next slice: archiving

The brief requires an archived task to:

- leave the active list;
- remain stored in the same `tasks` table;
- remain viewable;
- never be deleted.

I recommend:

- an **Archive** button on each active task;
- `archiveTask()` setting `archived_at = CURRENT_TIMESTAMP`;
- a Server Action for archiving;
- a separate `/archived` page listing archived tasks;
- a link between the active and archived views.

A separate archived page keeps the main list focused and clearly demonstrates during marking that archived tasks still exist.

Confirm that layout and I’ll provide the complete archiving slice.

## Exchange 19

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 19.

### User prompt

7/31/2026, 9:15:05 AM

sounds good

### Assistant response

7/31/2026, 9:15:47 AM

This slice archives a task by setting its existing `archived_at` timestamp. It does **not** delete the row or copy it elsewhere. The task disappears from the active list and remains visible at `/archived`, matching the walkthrough and database rubric. `lab_one.pdf`

No schema or TypeScript model changes are needed.

## 1. Add archived database operations

In `src/lib/tasks.ts`, add this function immediately after `getActiveTasks()`:

```ts
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
```

Then add this function after `updateTask()`:

```ts
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
```

`WHERE archived_at IS NULL` ensures an already archived task cannot accidentally be archived again.

---

## 2. Replace `src/app/actions.ts`

```ts
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
```

The task ID is sent through a hidden form field. `archiveTask()` still validates it before updating SQLite.

---

## 3. Replace `src/app/page.tsx`

```tsx
import Link from "next/link";

import styles from "./page.module.css";

import {
  archiveTaskAction,
  createTaskAction,
} from "@/app/actions";
import { getActiveTasks } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export default function Home() {
  const tasks = getActiveTasks();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1>Todo</h1>
              <p>
                Create tasks and keep track of what needs to be
                done.
              </p>
            </div>

            <Link className={styles.navLink} href="/archived">
              Archived tasks
            </Link>
          </div>
        </header>

        <section
          className={styles.panel}
          aria-labelledby="create-task-heading"
        >
          <h2 id="create-task-heading">Create a task</h2>

          <form action={createTaskAction} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={200}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="topic">Topic</label>
              <input
                id="topic"
                name="topic"
                type="text"
                required
                maxLength={100}
              />
            </div>

            <button className={styles.button} type="submit">
              Create task
            </button>
          </form>
        </section>

        <section
          className={styles.panel}
          aria-labelledby="active-tasks-heading"
        >
          <div className={styles.sectionHeading}>
            <h2 id="active-tasks-heading">Active tasks</h2>
            <span>
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {tasks.length === 0 ? (
            <p className={styles.emptyState}>
              No active tasks yet. Create your first task above.
            </p>
          ) : (
            <ul className={styles.taskList}>
              {tasks.map((task) => (
                <li className={styles.task} key={task.id}>
                  <div className={styles.taskHeading}>
                    <h3>{task.title}</h3>

                    <div className={styles.taskActions}>
                      <span className={styles.status}>
                        {task.status}
                      </span>

                      <Link
                        className={styles.editLink}
                        href={`/tasks/${task.id}/edit`}
                      >
                        Edit
                      </Link>

                      <form
                        action={archiveTaskAction}
                        className={styles.archiveForm}
                      >
                        <input
                          name="taskId"
                          type="hidden"
                          value={task.id}
                        />

                        <button
                          className={styles.archiveButton}
                          type="submit"
                        >
                          Archive
                        </button>
                      </form>
                    </div>
                  </div>

                  <dl className={styles.taskDetails}>
                    <div>
                      <dt>Topic</dt>
                      <dd>{task.topic}</dd>
                    </div>

                    <div>
                      <dt>Due date</dt>
                      <dd>{task.dueDate}</dd>
                    </div>
                  </dl>

                  {task.description.length > 0 && (
                    <p className={styles.description}>
                      {task.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
```

---

## 4. Create the archived-task page

Create:

`src/app/archived/page.tsx`

```tsx
import Link from "next/link";

import { getArchivedTasks } from "@/lib/tasks";

import styles from "../page.module.css";

export const dynamic = "force-dynamic";

export default function ArchivedTasksPage() {
  const tasks = getArchivedTasks();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1>Archived tasks</h1>
              <p>
                These tasks remain stored but are no longer active.
              </p>
            </div>

            <Link className={styles.navLink} href="/">
              Active tasks
            </Link>
          </div>
        </header>

        <section
          className={styles.panel}
          aria-labelledby="archived-tasks-heading"
        >
          <div className={styles.sectionHeading}>
            <h2 id="archived-tasks-heading">Archive</h2>
            <span>
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {tasks.length === 0 ? (
            <p className={styles.emptyState}>
              No tasks have been archived.
            </p>
          ) : (
            <ul className={styles.taskList}>
              {tasks.map((task) => (
                <li className={styles.task} key={task.id}>
                  <div className={styles.taskHeading}>
                    <h3>{task.title}</h3>

                    <span className={styles.status}>
                      {task.status}
                    </span>
                  </div>

                  <dl className={styles.taskDetails}>
                    <div>
                      <dt>Topic</dt>
                      <dd>{task.topic}</dd>
                    </div>

                    <div>
                      <dt>Due date</dt>
                      <dd>{task.dueDate}</dd>
                    </div>

                    <div>
                      <dt>Archived at</dt>
                      <dd>{task.archivedAt ?? "Unknown"}</dd>
                    </div>
                  </dl>

                  {task.description.length > 0 && (
                    <p className={styles.description}>
                      {task.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
```

This page is read-only for now. Restoring archived tasks is not required by the brief, so we are not adding it early.

---

## 5. Update `src/app/page.module.css`

Add this after the existing `.header` rules:

```css
.headerTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.navLink {
  flex-shrink: 0;
  color: #243b53;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.navLink:hover {
  color: #486581;
}

.navLink:focus-visible {
  border-radius: 3px;
  outline: 3px solid #bcccdc;
  outline-offset: 3px;
}
```

Replace the existing `.taskActions` rule with:

```css
.taskActions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
```

Add these rules after `.editLink:focus-visible`:

```css
.archiveForm {
  margin: 0;
}

.archiveButton {
  padding: 0;
  border: 0;
  background: transparent;
  color: #7c2d12;
  font: inherit;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.archiveButton:hover {
  color: #9a3412;
}

.archiveButton:focus-visible {
  border-radius: 3px;
  outline: 3px solid #fed7aa;
  outline-offset: 3px;
}
```

Inside the existing mobile media query, change:

```css
.taskHeading,
.sectionHeading {
```

to:

```css
.headerTop,
.taskHeading,
.sectionHeading {
```

That keeps the header navigation responsive on smaller screens.

## Test the slice

Run:

```powershell
npm run lint
npm run build
npm run dev
```

Then verify:

1. Create a new task.
2. Click **Archive**.
3. Confirm it immediately leaves the active list.
4. Open **Archived tasks**.
5. Confirm the same title, description, due date, topic, and status are still visible.
6. Reload both pages.
7. Stop and restart the application.
8. Confirm the task remains archived and viewable.
9. Confirm visiting its old edit URL now shows the not-found page rather than allowing it to be edited.

## Exchange 20

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 20.

### User prompt

7/31/2026, 9:27:31 AM

all works

### Assistant response

7/31/2026, 9:27:46 AM

Great - the archiving requirement is now working: archived tasks leave the active list but remain stored and viewable, as required by the walkthrough. `lab_one.pdf`

Run:

```powershell
npm run lint
npm run build
```

Then commit and push:

```powershell
git add src/lib/tasks.ts src/app/actions.ts src/app/page.tsx src/app/page.module.css src/app/archived/page.tsx

git commit -m "feat(tasks): add task archiving and archived view"

git push
```

## Next slice: sorting and overdue indication

I recommend implementing these together because they both affect how active tasks are read and displayed.

The design would be:

- a **Sort by** control with:
  - Due date
  - Topic
  - Status
- sorting stored in the URL, for example:
  - `/?sort=dueDate`
  - `/?sort=topic`
  - `/?sort=status`
- SQLite performs the sorting;
- overdue is calculated using a helper, never stored in the database;
- a task is overdue only when:
  - `dueDate` is before today;
  - status is not `Complete`;
- due today is not overdue;
- overdue tasks receive a visible label such as **Overdue** and distinct styling.

For deterministic future testing, the overdue helper should accept an optional “today” value rather than always reading the current clock internally.

The only genuine design choice is the default sort. I recommend **due date ascending**, so the most urgent tasks appear first. Confirm that default and I’ll provide the complete sorting and overdue slice.

## Exchange 21

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 21.

### User prompt

7/31/2026, 9:29:19 AM

sounds good knock urself out

### Assistant response

7/31/2026, 9:30:07 AM

This slice completes the remaining list behaviour from the walkthrough: sorting by topic, status, and due date, plus a visible overdue indicator that is not a status. `lab_one.pdf`

The default order will be **due date ascending**. Status sorting will follow the workflow order:

```text
Todo → In-Progress → Complete
```

## 1. Add sorting types

Update `src/types/task.ts` to:

```ts
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
```

`TASK_SORT_OPTIONS` acts as both:

- a runtime list for validating the URL;
- the source of the `TaskSortOption` TypeScript type.

---

## 2. Add the overdue rule helper

Create:

`src/lib/task-rules.ts`

```ts
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
```

Because the stored dates use `YYYY-MM-DD`, they can be compared alphabetically:

```text
2026-07-30 < 2026-07-31
```

The helper accepts an explicit `today` value so a future test can say:

```ts
isTaskOverdue(task, "2026-07-31")
```

That makes the test deterministic rather than depending on the actual date when it runs.

The helper uses the machine’s local date, which is appropriate because this is a local-first application running on the user’s computer.

---

## 3. Update active-task database sorting

In `src/lib/tasks.ts`, add `TaskSortOption` to the imported types:

```ts
import {
  TASK_STATUSES,
  type CreateTaskInput,
  type Task,
  type TaskSortOption,
  type TaskStatus,
  type UpdateTaskInput,
} from "@/types/task";
```

Add this immediately after `taskColumns`:

```ts
const activeTaskOrderBy: Record<TaskSortOption, string> = {
  dueDate: `
    due_date ASC,
    created_at DESC,
    id DESC
  `,
  topic: `
    topic COLLATE NOCASE ASC,
    due_date ASC,
    id DESC
  `,
  status: `
    CASE status
      WHEN 'Todo' THEN 1
      WHEN 'In-Progress' THEN 2
      WHEN 'Complete' THEN 3
    END ASC,
    due_date ASC,
    id DESC
  `,
};
```

Then replace the existing `getActiveTasks()` with:

```ts
export function getActiveTasks(
  sort: TaskSortOption = "dueDate",
): Task[] {
  const orderBy =
    activeTaskOrderBy[sort] ?? activeTaskOrderBy.dueDate;

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
```

This dynamic SQL remains safe because the `ORDER BY` text comes only from our fixed mapping. User input is never inserted directly into the SQL.

The sorting behaviour is:

- **Due date:** earliest first.
- **Topic:** alphabetical, ignoring uppercase/lowercase differences.
- **Status:** Todo, In-Progress, Complete.
- Secondary sorting uses due date and ID to keep results predictable.

---

## 4. Replace `src/app/page.tsx`

```tsx
import Link from "next/link";

import styles from "./page.module.css";

import {
  archiveTaskAction,
  createTaskAction,
} from "@/app/actions";
import { isTaskOverdue } from "@/lib/task-rules";
import { getActiveTasks } from "@/lib/tasks";
import {
  TASK_SORT_OPTIONS,
  type TaskSortOption,
} from "@/types/task";

export const dynamic = "force-dynamic";

const SORT_LABELS: Record<TaskSortOption, string> = {
  dueDate: "Due date",
  topic: "Topic",
  status: "Status",
};

interface HomePageProps {
  searchParams: Promise<{
    sort?: string | string[];
  }>;
}

function getSortOption(
  value: string | string[] | undefined,
): TaskSortOption {
  if (
    typeof value === "string" &&
    TASK_SORT_OPTIONS.includes(value as TaskSortOption)
  ) {
    return value as TaskSortOption;
  }

  return "dueDate";
}

export default async function Home({
  searchParams,
}: HomePageProps) {
  const { sort: requestedSort } = await searchParams;
  const sort = getSortOption(requestedSort);
  const tasks = getActiveTasks(sort);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1>Todo</h1>
              <p>
                Create tasks and keep track of what needs to be
                done.
              </p>
            </div>

            <Link className={styles.navLink} href="/archived">
              Archived tasks
            </Link>
          </div>
        </header>

        <section
          className={styles.panel}
          aria-labelledby="create-task-heading"
        >
          <h2 id="create-task-heading">Create a task</h2>

          <form action={createTaskAction} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={200}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="topic">Topic</label>
              <input
                id="topic"
                name="topic"
                type="text"
                required
                maxLength={100}
              />
            </div>

            <button className={styles.button} type="submit">
              Create task
            </button>
          </form>
        </section>

        <section
          className={styles.panel}
          aria-labelledby="active-tasks-heading"
        >
          <div className={styles.sectionHeading}>
            <div className={styles.headingGroup}>
              <h2 id="active-tasks-heading">Active tasks</h2>
              <span>
                {tasks.length}{" "}
                {tasks.length === 1 ? "task" : "tasks"}
              </span>
            </div>

            <form className={styles.sortForm} method="get">
              <label htmlFor="sort">Sort by</label>

              <select
                id="sort"
                name="sort"
                defaultValue={sort}
              >
                {TASK_SORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {SORT_LABELS[option]}
                  </option>
                ))}
              </select>

              <button
                className={styles.sortButton}
                type="submit"
              >
                Apply
              </button>
            </form>
          </div>

          {tasks.length === 0 ? (
            <p className={styles.emptyState}>
              No active tasks yet. Create your first task above.
            </p>
          ) : (
            <ul className={styles.taskList}>
              {tasks.map((task) => {
                const overdue = isTaskOverdue(task);

                return (
                  <li
                    className={`${styles.task} ${
                      overdue ? styles.overdueTask : ""
                    }`}
                    key={task.id}
                  >
                    <div className={styles.taskHeading}>
                      <h3>{task.title}</h3>

                      <div className={styles.taskActions}>
                        <span className={styles.status}>
                          {task.status}
                        </span>

                        {overdue && (
                          <span className={styles.overdueBadge}>
                            Overdue
                          </span>
                        )}

                        <Link
                          className={styles.editLink}
                          href={`/tasks/${task.id}/edit`}
                        >
                          Edit
                        </Link>

                        <form
                          action={archiveTaskAction}
                          className={styles.archiveForm}
                        >
                          <input
                            name="taskId"
                            type="hidden"
                            value={task.id}
                          />

                          <button
                            className={styles.archiveButton}
                            type="submit"
                          >
                            Archive
                          </button>
                        </form>
                      </div>
                    </div>

                    <dl className={styles.taskDetails}>
                      <div>
                        <dt>Topic</dt>
                        <dd>{task.topic}</dd>
                      </div>

                      <div>
                        <dt>Due date</dt>
                        <dd
                          className={
                            overdue
                              ? styles.overdueDate
                              : undefined
                          }
                        >
                          {task.dueDate}
                        </dd>
                      </div>
                    </dl>

                    {task.description.length > 0 && (
                      <p className={styles.description}>
                        {task.description}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
```

The sort selection is stored in the URL:

```text
/?sort=dueDate
/?sort=topic
/?sort=status
```

Using the URL means sorting works without client-side React state and survives a page reload.

---

## 5. Update `src/app/page.module.css`

Replace the existing `.sectionHeading` rule with:

```css
.sectionHeading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
```

Add these rules after it:

```css
.headingGroup {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.headingGroup h2 {
  margin-bottom: 0;
}

.sortForm {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.sortForm label {
  font-weight: 600;
}

.sortForm select {
  padding: 8px 10px;
  border: 1px solid #9fb3c8;
  border-radius: 6px;
  background: #ffffff;
  color: inherit;
  font: inherit;
}

.sortForm select:focus {
  border-color: #486581;
  outline: 3px solid #bcccdc;
  outline-offset: 1px;
}

.sortButton {
  padding: 8px 12px;
  border: 1px solid #486581;
  border-radius: 6px;
  background: #ffffff;
  color: #243b53;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.sortButton:hover {
  background: #f0f4f8;
}

.sortButton:focus-visible {
  outline: 3px solid #bcccdc;
  outline-offset: 2px;
}
```

Add these rules after the existing `.task` rule:

```css
.overdueTask {
  border-color: #c2410c;
  box-shadow: inset 4px 0 0 #c2410c;
}

.overdueBadge {
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 999px;
  background: #ffedd5;
  color: #9a3412;
  font-size: 0.875rem;
  font-weight: 700;
}

.overdueDate {
  color: #9a3412;
  font-weight: 700;
}
```

Inside the existing mobile media query, use:

```css
@media (max-width: 600px) {
  .page {
    padding: 24px 12px;
  }

  .panel {
    padding: 18px;
  }

  .headerTop,
  .taskHeading,
  .sectionHeading {
    align-items: flex-start;
    flex-direction: column;
  }

  .headingGroup {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .sortForm {
    align-items: flex-start;
  }
}
```

Replace the existing media-query block rather than adding a second duplicate one.

## Test the complete slice

Run:

```powershell
npm run lint
npm run build
npm run dev
```

Today is **31 July 2026** in your local timezone, so these test cases are useful:

### Overdue tests

Create or edit tasks with:

| Due date | Status | Expected |
|---|---|---|
| `2026-07-30` | Todo | Overdue |
| `2026-07-30` | In-Progress | Overdue |
| `2026-07-30` | Complete | Not overdue |
| `2026-07-31` | Todo | Not overdue |
| `2026-08-01` | Todo | Not overdue |

Confirm that **Overdue** never appears in the status dropdown.

### Sorting tests

Create tasks with different topics, statuses, and dates, then verify:

- **Due date** places the earliest date first.
- **Topic** sorts alphabetically.
- **Status** orders tasks as Todo, In-Progress, Complete.
- Reloading keeps the selected sort because it remains in the URL.

After everything passes, commit and push:

```powershell
git add src/types/task.ts src/lib/tasks.ts src/lib/task-rules.ts src/app/page.tsx src/app/page.module.css

git commit -m "feat(tasks): add sorting and overdue indicators"

git push
```

## Exchange 22

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 22.

### User prompt

7/31/2026, 9:42:51 AM

wait first i dont want to have to click apply when i select the sort from the menu i want it to sort immedialty , instead of the apply button id like to have an Asc/Desc button thatll just switch whenever its sorting by one of those ways

### Assistant response

7/31/2026, 9:42:53 AM

That interaction is better:

- changing **Sort by** updates the list immediately;
- there is no Apply button;
- a separate **Asc / Desc** button reverses the selected ordering;
- both choices remain in the URL, such as `/?sort=topic&direction=desc`.

We’ll use a very small Client Component only for the interactive controls. It changes the URL through `router.replace()`, while the page remains a Server Component and SQLite sorting still happens server-side. This is the intended App Router separation: event-driven UI belongs in a Client Component, while the page can read its asynchronous `searchParams` and fetch server-side data. 

Use this revised slice instead of the previous sorting instructions.

## 1. Update `src/types/task.ts`

```ts
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
```

---

## 2. Create the overdue-rule helper

Create:

`src/lib/task-rules.ts`

```ts
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
```

Overdue remains derived rather than stored. Passing `today` explicitly will later make the overdue tests deterministic.

---

## 3. Update sorting in `src/lib/tasks.ts`

Add `TaskSortDirection` and `TaskSortOption` to the existing imports:

```ts
import {
  TASK_STATUSES,
  type CreateTaskInput,
  type Task,
  type TaskSortDirection,
  type TaskSortOption,
  type TaskStatus,
  type UpdateTaskInput,
} from "@/types/task";
```

Add this immediately after `taskColumns`:

```ts
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
```

Replace the existing `getActiveTasks()` function with:

```ts
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
```

The SQL fragments come only from our fixed mapping. Values from the URL are not inserted directly into SQL.

The directions mean:

- Due date ascending: earliest first.
- Due date descending: latest first.
- Topic ascending: A-Z.
- Topic descending: Z-A.
- Status ascending: Todo → In-Progress → Complete.
- Status descending: Complete → In-Progress → Todo.

---

## 4. Create the immediate sort controls

Create:

`src/app/sort-controls.tsx`

```tsx
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
        {selectedDirection === "asc" ? "Asc ↑" : "Desc ↓"}
      </button>
    </div>
  );
}
```

Selecting a field changes the URL immediately. The direction is retained when changing fields. For example, switching from topic descending to status keeps descending selected.

`router.replace()` avoids creating a separate browser-history entry for every sort adjustment.

---

## 5. Replace `src/app/page.tsx`

```tsx
import Link from "next/link";

import styles from "./page.module.css";

import {
  archiveTaskAction,
  createTaskAction,
} from "@/app/actions";
import {
  getLocalDateString,
  isTaskOverdue,
} from "@/lib/task-rules";
import { getActiveTasks } from "@/lib/tasks";
import { SortControls } from "@/app/sort-controls";
import {
  TASK_SORT_DIRECTIONS,
  TASK_SORT_OPTIONS,
  type TaskSortDirection,
  type TaskSortOption,
} from "@/types/task";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{
    sort?: string | string[];
    direction?: string | string[];
  }>;
}

function getSortOption(
  value: string | string[] | undefined,
): TaskSortOption {
  if (
    typeof value === "string" &&
    TASK_SORT_OPTIONS.includes(value as TaskSortOption)
  ) {
    return value as TaskSortOption;
  }

  return "dueDate";
}

function getSortDirection(
  value: string | string[] | undefined,
): TaskSortDirection {
  if (
    typeof value === "string" &&
    TASK_SORT_DIRECTIONS.includes(
      value as TaskSortDirection,
    )
  ) {
    return value as TaskSortDirection;
  }

  return "asc";
}

export default async function Home({
  searchParams,
}: HomePageProps) {
  const {
    sort: requestedSort,
    direction: requestedDirection,
  } = await searchParams;

  const sort = getSortOption(requestedSort);
  const direction = getSortDirection(requestedDirection);
  const tasks = getActiveTasks(sort, direction);
  const today = getLocalDateString();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1>Todo</h1>
              <p>
                Create tasks and keep track of what needs to be
                done.
              </p>
            </div>

            <Link className={styles.navLink} href="/archived">
              Archived tasks
            </Link>
          </div>
        </header>

        <section
          className={styles.panel}
          aria-labelledby="create-task-heading"
        >
          <h2 id="create-task-heading">Create a task</h2>

          <form action={createTaskAction} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={200}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="topic">Topic</label>
              <input
                id="topic"
                name="topic"
                type="text"
                required
                maxLength={100}
              />
            </div>

            <button className={styles.button} type="submit">
              Create task
            </button>
          </form>
        </section>

        <section
          className={styles.panel}
          aria-labelledby="active-tasks-heading"
        >
          <div className={styles.sectionHeading}>
            <div className={styles.headingGroup}>
              <h2 id="active-tasks-heading">Active tasks</h2>
              <span>
                {tasks.length}{" "}
                {tasks.length === 1 ? "task" : "tasks"}
              </span>
            </div>

            <SortControls
              sort={sort}
              direction={direction}
            />
          </div>

          {tasks.length === 0 ? (
            <p className={styles.emptyState}>
              No active tasks yet. Create your first task above.
            </p>
          ) : (
            <ul className={styles.taskList}>
              {tasks.map((task) => {
                const overdue = isTaskOverdue(task, today);

                return (
                  <li
                    className={`${styles.task} ${
                      overdue ? styles.overdueTask : ""
                    }`}
                    key={task.id}
                  >
                    <div className={styles.taskHeading}>
                      <h3>{task.title}</h3>

                      <div className={styles.taskActions}>
                        <span className={styles.status}>
                          {task.status}
                        </span>

                        {overdue && (
                          <span className={styles.overdueBadge}>
                            Overdue
                          </span>
                        )}

                        <Link
                          className={styles.editLink}
                          href={`/tasks/${task.id}/edit`}
                        >
                          Edit
                        </Link>

                        <form
                          action={archiveTaskAction}
                          className={styles.archiveForm}
                        >
                          <input
                            name="taskId"
                            type="hidden"
                            value={task.id}
                          />

                          <button
                            className={styles.archiveButton}
                            type="submit"
                          >
                            Archive
                          </button>
                        </form>
                      </div>
                    </div>

                    <dl className={styles.taskDetails}>
                      <div>
                        <dt>Topic</dt>
                        <dd>{task.topic}</dd>
                      </div>

                      <div>
                        <dt>Due date</dt>
                        <dd
                          className={
                            overdue
                              ? styles.overdueDate
                              : undefined
                          }
                        >
                          {task.dueDate}
                        </dd>
                      </div>
                    </dl>

                    {task.description.length > 0 && (
                      <p className={styles.description}>
                        {task.description}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
```

---

## 6. Update `src/app/page.module.css`

Replace the existing `.sectionHeading` rule with:

```css
.sectionHeading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
```

Add:

```css
.headingGroup {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.headingGroup h2 {
  margin-bottom: 0;
}

.sortControls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.sortControls label {
  font-weight: 600;
}

.sortSelect {
  padding: 8px 10px;
  border: 1px solid #9fb3c8;
  border-radius: 6px;
  background: #ffffff;
  color: inherit;
  font: inherit;
}

.sortSelect:focus {
  border-color: #486581;
  outline: 3px solid #bcccdc;
  outline-offset: 1px;
}

.directionButton {
  min-width: 76px;
  padding: 8px 12px;
  border: 1px solid #486581;
  border-radius: 6px;
  background: #ffffff;
  color: #243b53;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.directionButton:hover:not(:disabled) {
  background: #f0f4f8;
}

.directionButton:focus-visible {
  outline: 3px solid #bcccdc;
  outline-offset: 2px;
}

.sortSelect:disabled,
.directionButton:disabled {
  cursor: wait;
  opacity: 0.65;
}
```

Add these overdue styles after the existing `.task` rule:

```css
.overdueTask {
  border-color: #c2410c;
  box-shadow: inset 4px 0 0 #c2410c;
}

.overdueBadge {
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 999px;
  background: #ffedd5;
  color: #9a3412;
  font-size: 0.875rem;
  font-weight: 700;
}

.overdueDate {
  color: #9a3412;
  font-weight: 700;
}
```

Replace the existing mobile media query with:

```css
@media (max-width: 600px) {
  .page {
    padding: 24px 12px;
  }

  .panel {
    padding: 18px;
  }

  .headerTop,
  .taskHeading,
  .sectionHeading {
    align-items: flex-start;
    flex-direction: column;
  }

  .headingGroup {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .sortControls {
    align-items: flex-start;
  }
}
```

## Test it

Run:

```powershell
npm run lint
npm run build
npm run dev
```

Check that:

1. Changing the dropdown immediately reorders the tasks.
2. No Apply button appears.
3. Clicking **Asc ↑** changes it to **Desc ↓** and reverses the list.
4. Clicking it again restores ascending order.
5. The URL updates with both settings.
6. Reloading preserves the chosen sorting.
7. Overdue Todo and In-Progress tasks are flagged.
8. Complete tasks are never flagged overdue.
9. A task due today is not overdue.

## Exchange 23

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 23.

### User prompt

7/31/2026, 9:49:29 AM

.page {
  min-height: 100vh;
  padding: 48px 20px;
  background: #f4f6f8;
  color: #1f2933;
}

.main {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
}

.header {
  margin-bottom: 32px;
}

.header h1 {
  margin: 0 0 8px;
  font-size: 2.5rem;
}

.header p {
  margin: 0;
  color: #52606d;
}

.headerTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.navLink {
  flex-shrink: 0;
  color: #243b53;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.navLink:hover {
  color: #486581;
}

.navLink:focus-visible {
  border-radius: 3px;
  outline: 3px solid #bcccdc;
  outline-offset: 3px;
}

.panel {
  margin-bottom: 24px;
  padding: 24px;
  border: 1px solid #d9e2ec;
  border-radius: 12px;
  background: #ffffff;
}

.panel h2 {
  margin-top: 0;
}

.form {
  display: grid;
  gap: 18px;
}

.field {
  display: grid;
  gap: 6px;
}

.field label {
  font-weight: 600;
}

.field input,
.field textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #9fb3c8;
  border-radius: 6px;
  background: #ffffff;
  color: inherit;
  font: inherit;
}

.field textarea {
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  outline: 3px solid #bcccdc;
  outline-offset: 1px;
  border-color: #486581;
}

.button {
  width: fit-content;
  padding: 10px 18px;
  border: 0;
  border-radius: 6px;
  background: #243b53;
  color: #ffffff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.button:hover {
  background: #334e68;
}

.button:focus-visible {
  outline: 3px solid #829ab1;
  outline-offset: 2px;
}

.sectionHeading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.headingGroup {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.headingGroup h2 {
  margin-bottom: 0;
}

.sortForm {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.sortForm label {
  font-weight: 600;
}

.sortForm select {
  padding: 8px 10px;
  border: 1px solid #9fb3c8;
  border-radius: 6px;
  background: #ffffff;
  color: inherit;
  font: inherit;
}

.sortForm select:focus {
  border-color: #486581;
  outline: 3px solid #bcccdc;
  outline-offset: 1px;
}

.sortButton {
  padding: 8px 12px;
  border: 1px solid #486581;
  border-radius: 6px;
  background: #ffffff;
  color: #243b53;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.sortButton:hover {
  background: #f0f4f8;
}

.sortButton:focus-visible {
  outline: 3px solid #bcccdc;
  outline-offset: 2px;
}

.sectionHeading span {
  color: #52606d;
}

.emptyState {
  margin-bottom: 0;
  color: #52606d;
}

.taskList {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.task {
  padding: 18px;
  border: 1px solid #d9e2ec;
  border-radius: 8px;
}

.overdueTask {
  border-color: #c2410c;
  box-shadow: inset 4px 0 0 #c2410c;
}

.overdueBadge {
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 999px;
  background: #ffedd5;
  color: #9a3412;
  font-size: 0.875rem;
  font-weight: 700;
}

.overdueDate {
  color: #9a3412;
  font-weight: 700;
}

.taskHeading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.taskHeading h3 {
  margin: 0;
}

.status {
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 999px;
  background: #e4e7eb;
  font-size: 0.875rem;
  font-weight: 600;
}

.taskDetails {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  margin: 16px 0 0;
}

.taskDetails div {
  display: grid;
  gap: 2px;
}

.taskDetails dt {
  color: #52606d;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.taskDetails dd {
  margin: 0;
}

.description {
  margin: 16px 0 0;
  white-space: pre-wrap;
}

@media (max-width: 600px) {
  .page {
    padding: 24px 12px;
  }

  .panel {
    padding: 18px;
  }

  .headerTop,
  .taskHeading,
  .sectionHeading {
    align-items: flex-start;
    flex-direction: column;
  }

  .headingGroup {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .sortForm {
    align-items: flex-start;
  }
}

.taskActions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.editLink {
  color: #243b53;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.editLink:hover {
  color: #486581;
}

.editLink:focus-visible {
  border-radius: 3px;
  outline: 3px solid #bcccdc;
  outline-offset: 3px;
}

.archiveForm {
  margin: 0;
}

.archiveButton {
  padding: 0;
  border: 0;
  background: transparent;
  color: #7c2d12;
  font: inherit;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.archiveButton:hover {
  color: #9a3412;
}

.archiveButton:focus-visible {
  border-radius: 3px;
  outline: 3px solid #fed7aa;
  outline-offset: 3px;
}

this is the current css..give me the full updated one

### Assistant response

7/31/2026, 9:49:37 AM

Replace the entire contents of `src/app/page.module.css` with:

```css
.page {
  min-height: 100vh;
  padding: 48px 20px;
  background: #f4f6f8;
  color: #1f2933;
}

.main {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
}

.header {
  margin-bottom: 32px;
}

.header h1 {
  margin: 0 0 8px;
  font-size: 2.5rem;
}

.header p {
  margin: 0;
  color: #52606d;
}

.headerTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.navLink {
  flex-shrink: 0;
  color: #243b53;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.navLink:hover {
  color: #486581;
}

.navLink:focus-visible {
  border-radius: 3px;
  outline: 3px solid #bcccdc;
  outline-offset: 3px;
}

.panel {
  margin-bottom: 24px;
  padding: 24px;
  border: 1px solid #d9e2ec;
  border-radius: 12px;
  background: #ffffff;
}

.panel h2 {
  margin-top: 0;
}

.form {
  display: grid;
  gap: 18px;
}

.field {
  display: grid;
  gap: 6px;
}

.field label {
  font-weight: 600;
}

.field input,
.field textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #9fb3c8;
  border-radius: 6px;
  background: #ffffff;
  color: inherit;
  font: inherit;
}

.field textarea {
  resize: vertical;
}

.field input:focus,
.field textarea:focus {
  border-color: #486581;
  outline: 3px solid #bcccdc;
  outline-offset: 1px;
}

.button {
  width: fit-content;
  padding: 10px 18px;
  border: 0;
  border-radius: 6px;
  background: #243b53;
  color: #ffffff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.button:hover {
  background: #334e68;
}

.button:focus-visible {
  outline: 3px solid #829ab1;
  outline-offset: 2px;
}

.sectionHeading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.sectionHeading span {
  color: #52606d;
}

.headingGroup {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.headingGroup h2 {
  margin-bottom: 0;
}

.sortControls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.sortControls label {
  font-weight: 600;
}

.sortSelect {
  padding: 8px 10px;
  border: 1px solid #9fb3c8;
  border-radius: 6px;
  background: #ffffff;
  color: inherit;
  font: inherit;
}

.sortSelect:focus {
  border-color: #486581;
  outline: 3px solid #bcccdc;
  outline-offset: 1px;
}

.directionButton {
  min-width: 76px;
  padding: 8px 12px;
  border: 1px solid #486581;
  border-radius: 6px;
  background: #ffffff;
  color: #243b53;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.directionButton:hover:not(:disabled) {
  background: #f0f4f8;
}

.directionButton:focus-visible {
  outline: 3px solid #bcccdc;
  outline-offset: 2px;
}

.sortSelect:disabled,
.directionButton:disabled {
  cursor: wait;
  opacity: 0.65;
}

.emptyState {
  margin-bottom: 0;
  color: #52606d;
}

.taskList {
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.task {
  padding: 18px;
  border: 1px solid #d9e2ec;
  border-radius: 8px;
}

.overdueTask {
  border-color: #c2410c;
  box-shadow: inset 4px 0 0 #c2410c;
}

.taskHeading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.taskHeading h3 {
  margin: 0;
}

.taskActions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.status {
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 999px;
  background: #e4e7eb;
  font-size: 0.875rem;
  font-weight: 600;
}

.overdueBadge {
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 999px;
  background: #ffedd5;
  color: #9a3412;
  font-size: 0.875rem;
  font-weight: 700;
}

.editLink {
  color: #243b53;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.editLink:hover {
  color: #486581;
}

.editLink:focus-visible {
  border-radius: 3px;
  outline: 3px solid #bcccdc;
  outline-offset: 3px;
}

.archiveForm {
  margin: 0;
}

.archiveButton {
  padding: 0;
  border: 0;
  background: transparent;
  color: #7c2d12;
  font: inherit;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.archiveButton:hover {
  color: #9a3412;
}

.archiveButton:focus-visible {
  border-radius: 3px;
  outline: 3px solid #fed7aa;
  outline-offset: 3px;
}

.taskDetails {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 32px;
  margin: 16px 0 0;
}

.taskDetails div {
  display: grid;
  gap: 2px;
}

.taskDetails dt {
  color: #52606d;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.taskDetails dd {
  margin: 0;
}

.overdueDate {
  color: #9a3412;
  font-weight: 700;
}

.description {
  margin: 16px 0 0;
  white-space: pre-wrap;
}

@media (max-width: 600px) {
  .page {
    padding: 24px 12px;
  }

  .panel {
    padding: 18px;
  }

  .headerTop,
  .taskHeading,
  .sectionHeading {
    align-items: flex-start;
    flex-direction: column;
  }

  .headingGroup {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .sortControls {
    align-items: flex-start;
  }
}
```

This removes the old `.sortForm` and `.sortButton` rules and replaces them with the classes used by `SortControls`:

- `.sortControls`
- `.sortSelect`
- `.directionButton`

## Exchange 24

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 24.

### User prompt

7/31/2026, 9:52:48 AM

yea alls good

### Assistant response

7/31/2026, 9:53:14 AM

Great - sorting now updates immediately, ascending/descending works, and overdue is derived rather than stored.

Run the final checks:

```powershell
npm run lint
npm run build
```

Then commit and push:

```powershell
git add src/types/task.ts src/lib/tasks.ts src/lib/task-rules.ts src/app/page.tsx src/app/page.module.css src/app/sort-controls.tsx

git commit -m "feat(tasks): add sorting controls and overdue indicators"

git push
```

This completes walkthrough steps 5 and 6: sorting by topic, status, and due date, plus visibly flagging overdue tasks without adding an overdue status. `lab_one.pdf`

## Next: automated tests

Testing should be the next slice because the brief requires at least three deterministic tests, one command that runs all tests, and a throwaway database rather than `database/todo.db`. `lab_one.pdf`

I recommend using **Vitest** as one development dependency. It works cleanly with TypeScript and allows us to test the real database functions without compiling separate test files manually.

The planned tests are:

1. Creating a task stores all fields and applies the default `Todo` status.
2. Updating a task persists the changed fields and status.
3. Archiving removes the task from active results but keeps it in archived results.
4. The overdue helper handles past, today, future, and completed tasks deterministically.

We’ll also make `src/lib/database.ts` accept a test-only database path through an environment variable. Normal application use will still default to `database/todo.db`, while the tests will create and remove a temporary SQLite file automatically.

Confirm Vitest is acceptable, and I’ll give you the complete testing setup and tests.

## Exchange 25

Source: `raw files/ChatGPT-COMS3011A Todo App Development.md` - original exchange 25.

### User prompt

7/31/2026, 9:55:07 AM

lets stop here for now give a handover for a new chat similar to the one you recived

### Assistant response

7/31/2026, 9:55:24 AM

The handover below preserves the project state and the brief’s walkthrough, testing, documentation, database, commit-history, and AI-transcript requirements. `lab_one.pdf`

Copy this into the new chat:

```text
I am continuing development of a COMS3011A Lab 1 todo application. Treat the information below as the current project state. Do not scaffold a new project.

## How I want to work

Work in coherent feature slices.

- Explain what a slice changes and why.
- Give enough connected work per response to complete a meaningful slice.
- Do not split every tiny file change into a separate confirmation step.
- Wait for me to report whether the complete slice worked before moving on.
- Ask me about genuine design choices before deciding for me.
- Keep dependencies minimal.
- Use Conventional Commit messages.
- Do not implement unrelated features early.
- Do not create separate frontend and backend projects.
- This is one Next.js application using server-side Next.js code for SQLite access.
- Avoid adding an ORM unless there is a strong reason.
- Keep the project working after every commit.
- Do not claim something is committed, pushed, linted, or built unless I confirm it.

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
- tests must use a throwaway database rather than my development database.

Documentation requirements:

- Third-Party Code:
  - list every installed library/package;
  - give one line explaining why each was chosen.
- Database Design:
  - describe the tables and relationships;
  - ensure it matches the shipped schema.
- Running It:
  - state the Node version;
  - include exact commands to install, run and test from a clean clone.

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
- check `git status` and `git log --oneline` before making assumptions about what is committed.

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
- no ORM.

The initial project was created directly in the repository root with approximately:

npx create-next-app@latest . --typescript --eslint --app --src-dir --no-tailwind --no-react-compiler --use-npm --import-alias "@/*" --disable-git

The application uses one local Next.js Node.js server process.

Server Actions are used for task mutations. They run inside the Next.js server and call SQLite directly. There is no manually implemented REST endpoint for task creation, editing or archiving.

There is still one explicit diagnostic API route:

GET /api/database-check

## Installed SQLite dependencies

Runtime:

better-sqlite3

Development:

@types/better-sqlite3

No test framework has been installed yet.

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
- archived tasks stay in the same table;
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

## Database connection

File:

src/lib/database.ts

It currently:

- imports server-only;
- opens database/todo.db using better-sqlite3;
- creates the database directory if needed;
- enables WAL mode;
- enables foreign keys;
- reads and executes database/schema.sql;
- reuses one connection through globalThis during development reloads;
- exports the connection as `db`.

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

## Task database operations

File:

src/lib/tasks.ts

It currently contains:

- a private TaskRow interface using SQLite snake_case names;
- a private mapping function from TaskRow to Task;
- shared task-column SQL;
- shared normalization and validation;
- validation of real YYYY-MM-DD calendar dates;
- fixed ORDER BY mappings for each supported sort and direction.

Public operations:

- getActiveTasks(sort, direction)
- getArchivedTasks()
- getActiveTaskById(id)
- createTask(input)
- updateTask(input)
- archiveTask(id)

Behaviour:

- active reads use `archived_at IS NULL`;
- archived reads use `archived_at IS NOT NULL`;
- archived tasks are ordered by archive timestamp;
- editing only works for active tasks;
- archiving sets:
  - archived_at = CURRENT_TIMESTAMP
  - updated_at = CURRENT_TIMESTAMP
- archiving does not delete or copy the row;
- create uses SQLite defaults for ID, Todo status, active archive state and timestamps;
- update changes the four fields, status and updated_at;
- title and topic are trimmed;
- description remains a string and preserves entered whitespace;
- due dates are validated as real calendar dates.

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
- SQL ordering fragments come only from fixed internal mappings, not raw URL text.

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
- accepts an explicit `today` string so tests can be deterministic.

## Server Actions

File:

src/app/actions.ts

It currently defines:

- createTaskAction(formData)
- updateTaskAction(taskId, formData)
- archiveTaskAction(formData)

The actions:

- extract text safely from FormData;
- validate status against TASK_STATUSES;
- call the database operations;
- revalidate relevant routes;
- redirect to `/` after a successful edit.

## Routes and interface

### `/`

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
- validates `sort` and `direction` URL search parameters;
- defaults to:
  - sort = dueDate
  - direction = asc
- passes sorting to getActiveTasks();
- calculates overdue using one shared `today` value for the render;
- displays an Overdue badge, changed border and highlighted due date;
- never exposes Overdue as a selectable status.

### Sort controls

File:

src/app/sort-controls.tsx

This is a small Client Component.

It:

- uses a Sort by select;
- updates sorting immediately when the selection changes;
- has no Apply button;
- has an Asc/Desc toggle button;
- uses router.replace() to update:
  - sort
  - direction
- preserves the selected direction when the sort field changes;
- disables controls briefly while navigation is pending;
- preserves sorting after reload because it is stored in the URL.

Example URLs:

/?sort=dueDate&direction=asc
/?sort=topic&direction=desc
/?sort=status&direction=asc

### `/tasks/[id]/edit`

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
- redirects back to `/`.

### `/archived`

File:

src/app/archived/page.tsx

It:

- reads archived tasks;
- displays archived tasks separately;
- displays all task data plus archived_at;
- links back to the active list;
- is read-only;
- does not restore tasks because restoration is not required by the brief.

### `/api/database-check`

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
  - directionButton
- overdue card, badge and due-date styling;
- mobile layout below 600px.

The old sortForm, sortButton and Apply-button styles were removed.

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
- archived tasks remaining viewable at `/archived`;
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

## Documentation currently present

File:

docs/database-design.md

It documents:

- the single tasks table;
- every column and constraint;
- the fixed status design;
- archived_at;
- derived overdue behaviour;
- YYYY-MM-DD storage;
- no current relationships.

The complete final documentation is not finished.

Still required:

- accurate Third-Party Code documentation;
- complete Running It documentation;
- Node version;
- exact clean-clone install, run and test commands;
- verification that the README alone starts the application;
- confirmation that the database design documentation still exactly matches the final shipped schema.

Do not invent the Node version. Run:

node --version

and document the real result later.

## Git history

Initial commits already made include work equivalent to:

- chore: scaffold initial Next.js TypeScript project
- feat(database): add initial tasks schema
- build(database): add SQLite dependencies
- feat(database): add SQLite connection and schema check
- docs(database): document tasks schema and design decisions
- feat(tasks): add task models and database operations

The task-model/database-operation commit was explicitly confirmed committed and pushed.

Later expected feature commits use or were recommended to use:

- feat(tasks): add task creation and active task list
- feat(tasks): add task editing workflow
- feat(tasks): add task archiving and archived view
- feat(tasks): add sorting controls and overdue indicators

Do not assume all later slices are committed or pushed. Start by running:

git status
git log --oneline --decorate -15

The latest sorting/overdue slice was reported working, but the final `npm run lint`, `npm run build`, commit and push were not explicitly confirmed in the previous chat.

If that slice is still uncommitted, verify it with:

npm run lint
npm run build

Then use:

git add src/types/task.ts src/lib/tasks.ts src/lib/task-rules.ts src/app/page.tsx src/app/page.module.css src/app/sort-controls.tsx
git commit -m "feat(tasks): add sorting controls and overdue indicators"
git push

Only do that after reviewing `git status`.

## Current stopping point

All required application functionality appears to be implemented and manually working.

No automated tests have been added yet.

The next development goal is the complete testing slice.

## Recommended next slice: automated tests

Use Vitest unless inspection reveals a strong reason not to.

Requirements for the slice:

- install only the necessary testing dependency or dependencies;
- add one documented npm command that runs every test;
- create at least three tests that exercise real behaviour;
- use a throwaway SQLite database;
- never read or modify database/todo.db during tests;
- make tests deterministic;
- include archiving or overdue coverage.

Recommended behaviour tests:

1. Creating a task stores all four fields and gives it Todo status.
2. Updating a task persists changed fields and status.
3. Archiving removes a task from active results but keeps it in archived results.
4. The overdue helper correctly handles:
   - a past Todo task;
   - a past In-Progress task;
   - a past Complete task;
   - a task due today;
   - a future task.

Before writing code, inspect the current database module and choose a clean testability approach.

Likely options include:

- allowing a test-only database path through an environment variable; or
- extracting a database factory/repository that accepts a better-sqlite3 connection.

The test architecture must avoid contamination from the global development connection.

Also verify how the `server-only` imports behave under Vitest. Do not remove server-only protection from production code merely to make tests pass without first considering a Vitest alias/no-op or a cleaner separation of pure database logic.

After tests, the remaining work should be:

1. Complete Third-Party Code documentation.
2. Complete Running It documentation with the actual Node version.
3. Update README with exact clean-clone commands.
4. Verify all tests from one command.
5. Perform the full seven-step walkthrough from a clean clone.
6. Confirm schema and database documentation still match.
7. Save/export the AI usage transcripts required for submission.
8. Run final:
   - npm run lint
   - npm run build
   - npm test
9. Commit each coherent remaining slice with Conventional Commits.

Begin by asking me to paste the output of:

git status
git log --oneline --decorate -15

Then continue with the complete automated-testing slice.
```



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)

AI Declaration: The preceding document was generated and organised with the assistance of ChatGPT-Web[GPT-5.6 Sol (high)] and Codex[GPT-5.6 Sol (high)].

