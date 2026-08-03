# AI Usage Transcript 04: Single-Page UI Redesign and Demo Data

## Scope and source

This phase records the later Codex-assisted redesign of the working Todo App into a cream-and-emerald single-page workspace. It also records local demo-data population, corrections made after user feedback, verification, and publication.

Source: the Codex conversation on 2 August 2026 and repository diff for commit `6eaeeb9`.

## Repository inspection before design work

The user first requested a read-only explanation of the repository. Codex inspected the routes, components, Server Actions, SQLite layer, tests, CI workflow, documentation, and Git status.

Important conclusions were:

- Server Components read SQLite directly on the server;
- form changes used Server Actions;
- there was no separate backend application;
- archive and overdue behaviour were already complete;
- the tracked working tree was clean;
- default Create Next App metadata and basic styling remained obvious UI-polish gaps.

Because `AGENTS.md` warned that the installed Next.js had breaking changes, Codex read the bundled Next.js 16 documentation before changing code.

## User's redesign brief

The user requested:

> i want it to be like a single page application

The detailed requirements were:

- the task list should be the main interface;
- tasks should be filterable/sortable by status tags;
- a New task button should open a panel from the left;
- editing should use the same kind of left panel;
- archived tasks should appear in the same style as active tasks;
- status should be editable from the task tile;
- the aesthetic should be clean, cream, and emerald green;
- no Git commit should be made during implementation.

## Architecture selected

Codex read the installed Next.js guides for Server/Client Components and Server Actions.

The resulting split was:

```text
src/app/page.tsx
  Server Component
  reads active tasks, archived tasks, and today's date
  passes serialisable data to the workspace

src/app/task-workspace.tsx
  Client Component
  owns view, filter, and drawer state
  invokes existing Server Actions
```

SQLite access remained server-side.

## Abandoned dedicated status backend method

Codex initially started adding a dedicated `updateTaskStatus` repository method and test.

The user immediately narrowed the scope:

> dont make any changes to like the backend just to simplify the UI

Codex removed that new method and reused the existing full task update path. The inline status form sends hidden fields for the task's current title, description, due date, and topic together with the selected status.

The user later clarified that small supporting backend changes were acceptable if required. The only intentional supporting action change was removing `redirect("/")` from `updateTaskAction`, allowing updates to revalidate without navigating away from the SPA-style workspace.

This sequence is retained for transparency: the first implementation direction exceeded the user's desired scope and was corrected.

## Interrupted restore attempts

Reversing the initial status-method work left harmless newline-only diffs in several backend/test files. Codex twice attempted a targeted `git restore` to remove those cosmetic differences.

The user interrupted and asked why a restore was being run. Codex explained that the command targeted only accidental backend/test differences, not the UI. The user then said small backend changes could remain and that no restore was necessary.

Codex stopped attempting restores and continued. No commit was made during these interruptions.

## Workspace behaviour

The new `TaskWorkspace` added:

- an active/archived view toggle;
- archived-task count in the header;
- status filters for All, Todo, In progress, and Complete;
- counts on each filter;
- responsive task cards;
- an empty state;
- left-side create/edit drawer state;
- inline status forms;
- card-level Edit and Archive controls.

## Create and edit drawer

One reusable form serves both create and edit modes.

Fields:

- task title;
- description;
- due date;
- topic;
- status in edit mode.

The drawer includes a close button, Cancel button, dismissible overlay, pending save text, and dialog accessibility attributes. Successful creates and edits close the drawer while Next.js revalidates the task data.

## Inline task status

Each active card contains a status `select`. When the selection changes, `requestSubmit()` submits the form immediately.

The existing update action validates and persists the selected value. Archived cards show a static status pill instead of an editable control.

## Archived tasks in the SPA

Archived tasks are loaded with the initial server render and displayed by changing client-side view state. They reuse the same card system but show archive time and omit edit/archive controls.

The legacy `/archived` route redirects to `/`, keeping the main user journey in one workspace.

## Visual design

`page.module.css` was rebuilt with:

- cream `#f7f4eb`-style backgrounds;
- emerald primary controls;
- serif display headings;
- rounded task cards;
- light borders and restrained shadows;
- status-specific pills;
- overdue colouring;
- two columns on desktop and one on mobile;
- sticky translucent header;
- animated left drawer;
- keyboard focus rings;
- reduced-motion handling.

Global CSS was simplified to match the new theme. App metadata changed from Create Next App defaults to:

```text
Taskly — Make today count
A calm, local-first task manager.
```

## Verification

Codex ran:

```text
npm run lint
npm test
npm run build
git diff --check
```

Results:

- lint passed;
- 2 test files passed;
- all 8 tests passed;
- TypeScript/build passed;
- all Next.js routes compiled;
- the diff contained no whitespace errors.

## Local demo-data request

The user asked Codex to populate SQLite so the interface was easy to demonstrate.

Codex first opened `database/todo.db` with `{ readonly: true }` and selected existing task summaries. The user asked for more explanation rather than only progress statements. From then on, Codex explained each database command:

- `better-sqlite3` was the existing driver;
- readonly mode prevented changes during inspection;
- prepared `?` placeholders separated values from SQL;
- a transaction made the insert set atomic;
- title checks made sample insertion safe to retry;
- no existing row would be updated or deleted.

Eight polished examples were added across Todo, In-Progress, Complete, overdue, due-today, future, and archived scenarios.

The user then requested at least two tasks for every scenario. A read-only aggregate query counted each scenario. One query initially failed because PowerShell interpreted JavaScript backticks; it made no database change. The retry used SQL parameters successfully.

Only due-today active tasks and archived Todo tasks were short of two, so two more examples were added.

Final local totals were:

```text
17 tasks total
11 active
6 archived
```

The database is ignored by Git, so demonstration rows were never uploaded.

## Commit-type discussion and publication

The user asked whether the work should be a `chore`, `fix`, or feature. Codex recommended `feat` because the redesign was user-visible functionality.

Commands:

```text
git add .
git commit -m "feat: redesign task workspace"
git push origin main
```

Result:

```text
6eaeeb9 feat: redesign task workspace
```

The branch was clean and synchronized after the push. Ignored SQLite demo data was not included.

## Final files involved

- `src/app/task-workspace.tsx` — new SPA-style client workspace.
- `src/app/page.tsx` — server data entry point.
- `src/app/actions.ts` — update no longer redirects.
- `src/app/archived/page.tsx` — redirects into workspace.
- `src/app/page.module.css` — full visual redesign.
- `src/app/globals.css` — updated global theme.
- `src/app/layout.tsx` — Taskly metadata.
- `database/todo.db` — local demonstration data only, ignored by Git.

## Post-redesign enhancement: newest-first and per-list date sorting

The user later requested two related ordering changes:

> make changes so when i create a new task it appears at the top of the list

and:

> i want each list ie) the all the todo the in progress and the complete to be able to be sorteable by date in asc or desc

The user wanted one button whose visible state changes between ascending and descending each time it is selected.

Codex reread the installed Next.js Client Component guidance and inspected the current workspace before editing. No database or repository change was needed because every task already included both `createdAt` and `dueDate` in the serialised data passed to the Client Component.

The final behaviour was implemented in `src/app/task-workspace.tsx`:

- active lists with no selected date sort use `createdAt` descending;
- task ID descending breaks timestamp ties, ensuring the most recently inserted task remains first even when tasks share the same SQLite timestamp second;
- the initial button reads `Due date / Sort ↕`;
- the first click sorts due dates ascending and displays `Asc ↑`;
- the second click sorts due dates descending and displays `Desc ↓`;
- further clicks toggle between ascending and descending;
- All, Todo, In-Progress, and Complete each retain their own direction;
- active and archived views also retain separate settings;
- equal due dates fall back to newest-first ordering;
- archived unsorted lists retain newest-archived-first ordering.

The state was kept in the existing Client Component because it is browser interaction state. SQLite reads remained in the Server Component, consistent with the existing architecture.

`src/app/page.module.css` added a compact cream-and-emerald date-sort control, active state, hover/focus styling, and a responsive layout that moves the button below the status filters on smaller screens.

Verification after the enhancement:

```text
npm run lint   passed
npm test       2 files and all 8 tests passed
npm run build  compiled and type-checked successfully
git diff --check passed
```

## Post-redesign enhancement: topic sorting

The user then extended the sorting requirement:

> i need to beable to sort the list by topic as well

Codex reused the same interaction pattern rather than introducing a different control. A Topic button now sits beside Due date.

The per-list setting was refactored from a date direction into an object containing:

```text
field: dueDate or topic
direction: asc or desc
```

This means:

- only one field is active at a time;
- selecting Topic for the first time sorts A to Z and shows `Asc ↑`;
- selecting Topic again sorts Z to A and shows `Desc ↓`;
- selecting Due date switches the active field back to due date at `Asc ↑`;
- each All/Todo/In-Progress/Complete filter remembers its own field and direction;
- active and archived views retain separate settings;
- topic comparison is case-insensitive;
- tasks with equal topics fall back to the existing newest-first order;
- a newly created task remains at the top while no explicit sort is selected.

No database, schema, repository, or Server Action change was required. The implementation remained client-side because all task topics were already provided by the Server Component.

## Post-redesign correction: row-by-row card ordering

After testing the two sort controls, the user clarified that the visual two-column order also mattered. For a sorted sequence `1, 2, 3, 4`, the required desktop layout was:

```text
1  2
3  4
```

and not:

```text
1  3
2  4
```

Codex first repeated this interpretation and waited for confirmation before editing. After the user confirmed it, each visible task received an explicit grid row and column calculated from its sorted-array position:

- positions 0 and 1 use row 1;
- positions 2 and 3 use row 2;
- later positions continue the same pattern;
- mobile CSS resets every card to column 1 with automatic rows.

This guarantees row-by-row reading order for both due-date and topic sorting. Lint and all 8 automated tests passed after the correction.
