# AI Usage Transcript 03: Initial Task Feature Development

## Scope and source

This phase covers TypeScript task models, database operations, creating/displaying tasks, editing, archiving, sorting, and overdue indicators.

Primary source: [ChatGPT-COMS3011A Todo App Development.md](<raw files/ChatGPT-COMS3011A Todo App Development.md>), dated 31 July 2026. The session began from a handover created by the setup chat.

## Development order

The feature work followed the lab's functional walkthrough:

1. Define task models and database operations.
2. Create and display tasks.
3. Edit a task.
4. Archive and view archived tasks.
5. Sort active tasks.
6. Show overdue tasks without changing status.

The user initially requested small steps, then later asked for more work per response once comfortable.

## TypeScript model decisions

The AI recommended camelCase TypeScript properties even though SQLite columns used snake_case. The user approved camelCase.

`src/types/task.ts` defined:

- `TaskStatus`;
- `Task`;
- `CreateTaskInput`;
- later `UpdateTaskInput`;
- sorting option and direction types.

The status values were kept aligned with SQLite:

```text
Todo
In-Progress
Complete
```

The `Task` interface mapped database values such as `due_date` and `archived_at` to `dueDate` and `archivedAt`.

Creation input excluded fields generated or defaulted by the system: ID, status, timestamps, and archive timestamp.

## Initial task database operations

The first task module was `src/lib/tasks.ts`. It included:

- a private row shape matching SQLite column names;
- a mapping function from a SQLite row to `Task`;
- active-task reads;
- task creation;
- validation and trimming.

The user asked the AI to reread the brief before selecting the frontend/backend communication style. The AI recommended Server Actions rather than a hand-written REST API because the brief required working persistence, not a separate API architecture.

The task model and operations were committed as:

```text
10f4dfe feat(tasks): add task models and database operations
```

## Server Action explanation

When task creation was implemented, the user asked what "Server Action" meant if there were no API endpoints.

The AI explained:

- `npm run dev` starts a Next.js Node server;
- a Server Action is a server-side function invoked by a React form;
- Next.js handles the network request internally;
- the implementation stays on the server and can access SQLite;
- there is no separate Express backend or manually written create-task API endpoint.

This became the main mutation architecture for the app.

## Task creation and active list

The first functional interface slice added:

- `createTaskAction` in `src/app/actions.ts`;
- a form with title, description, due date, and topic;
- a Server Component home page reading active tasks;
- CSS for the original simple layout;
- path revalidation after insertion.

The user manually created tasks, confirmed they appeared, and confirmed persistence.

Commit:

```text
b73d68b feat(tasks): add task creation and active task list
```

## Editing workflow

Editing added:

- an update input type;
- `getActiveTaskById`;
- the update SQL statement;
- `updateTaskAction`;
- Edit links;
- `src/app/tasks/[id]/edit/page.tsx`;
- edit-specific styling;
- 404 behaviour for invalid, missing, or archived task IDs.

The user asked why `[id]` used square brackets. The AI explained that Next.js App Router treats it as a dynamic route segment, allowing URLs such as `/tasks/27/edit`, with `27` provided as the `id` parameter.

The user tested creation and editing manually and confirmed saved changes survived reloads.

Commit:

```text
d34ecdc feat(tasks): add task editing workflow
```

## Archiving workflow

Archiving used an update rather than a delete:

```text
archived_at = CURRENT_TIMESTAMP
updated_at = CURRENT_TIMESTAMP
```

Active reads filtered with `archived_at IS NULL`; archived reads used `IS NOT NULL`.

The interface added:

- an Archive form action on each active task;
- an `/archived` page;
- a link between active and archived lists;
- archive timestamps in the archived list.

The user confirmed archived tasks disappeared from active view but remained visible and stored.

Commit:

```text
06922f9 feat(tasks): add task archiving and archived view
```

## Sorting and overdue behaviour

The original proposal covered sorting by:

- due date;
- topic;
- status.

Default sorting was due date ascending. Status ordering followed:

```text
Todo -> In-Progress -> Complete
```

The user rejected an Apply button:

> i dont want to have to click apply when i select the sort from the menu i want it to sort immedialty

The design changed to:

- immediately navigate when the sort select changes;
- use an Asc/Desc toggle button;
- store `sort` and `direction` in the URL;
- use a small Client Component only for the interactive controls;
- leave task reading and rendering on the server.

The overdue rule was placed in `src/lib/task-rules.ts`. It compared `YYYY-MM-DD` strings against the current local date and excluded `Complete` tasks.

The UI displayed an overdue badge and visual emphasis, but overdue never became a selectable or stored status.

The user supplied the current CSS and the AI returned a full replacement containing the sorting and overdue styles. The user confirmed the final behaviour worked.

Commit:

```text
b0da01d feat(tasks): add sorting controls and overdue indicators
```

## Checks used during feature development

After each major slice, the AI requested some combination of:

```powershell
npm run lint
npm run build
git status
```

The user also performed manual browser walkthroughs after creation, editing, archiving, and sorting changes.

Commits were intentionally kept feature-focused instead of making one large final commit.

## Handover to testing phase

At the user's request, the AI produced a new-chat handover containing:

- the project architecture;
- completed walkthrough steps;
- current commits;
- database behaviour;
- remaining testing and documentation work;
- the preference for step-by-step explanations.

The next chat began with a clean repository at `b0da01d`, with all main task behaviour working manually but automated tests not yet added.
