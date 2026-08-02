# AI Usage Transcript 05: Automated Testing, Documentation, and CI Repair

## Scope and sources

This phase covers the initial automated-testing design, Vitest setup, repository refactor for dependency injection, temporary SQLite tests, overdue-rule tests, README/CI creation, repeated failed CI fixes, Linux reproduction, and the final successful GitHub Actions run.

Sources:

- [ChatGPT-Project Handover Steps.md](<raw files/ChatGPT-Project Handover Steps.md>);
- repository history from `487b3ee` onward;
- Codex GitHub/WSL diagnostic session on 2 August 2026.

## Starting state

The testing chat began after the user confirmed that sorting and overdue behaviour worked manually.

The user showed:

```text
main was clean and synchronized
HEAD was b0da01d feat(tasks): add sorting controls and overdue indicators
```

All main application behaviours worked manually, but there were no automated tests yet.

## Why Vitest instead of Jest

The user explicitly asked why Vitest was being selected over Jest.

The AI explained that Jest would also work, but Vitest required less configuration for this TypeScript/ES module project, had fast startup, supported Node-based tests, and provided familiar `describe`, `it`, and `expect` APIs.

The decision was pragmatic rather than a claim that Jest was incorrect.

## Testability problem in the original data layer

Originally, `src/lib/tasks.ts` imported the production database connection directly. Tests importing that module would risk opening or changing `database/todo.db`.

The AI recommended dependency injection:

```text
src/lib/task-repository.ts
  createTaskRepository(database)
  contains SQL and validation

src/lib/tasks.ts
  imports the real db
  creates the production repository
  re-exports its methods

tests
  create a temporary SQLite database
  inject it into createTaskRepository
```

The user asked for confirmation before replacing the old large `tasks.ts`, and the AI clarified that the new small wrapper intentionally delegated all operations to the repository factory.

## Vitest and configuration

Vitest was installed and a test script was added:

```json
"test": "vitest run"
```

The config provided:

- Node test environment;
- `@` alias support;
- test-file inclusion under `tests/**/*.test.ts`.

An ESM/native-loader warning later appeared because the initial file was `vitest.config.ts`. The config became `vitest.config.mts`, matching its ESM syntax.

## Temporary test database

`tests/helpers/create-test-database.ts`:

1. Creates a unique directory in the operating system temp folder.
2. Opens `test.db` using `better-sqlite3`.
3. Reads the real tracked `database/schema.sql`.
4. Executes the schema so tests use production table constraints.
5. Returns the connection plus a cleanup function.
6. Closes SQLite and removes the temporary directory after each test.

This ensured automated tests did not open or mutate the developer's `database/todo.db`.

## Repository tests

`tests/task-repository.test.ts` covered:

- creating a task with default `Todo` status;
- reading the stored task back by ID;
- updating title, description, due date, topic, and status;
- confirming the updated values persisted;
- archiving a task;
- confirming it disappeared from active reads;
- confirming it remained in archived reads;
- directly counting the row to prove archive did not delete it.

## Overdue-rule tests

`tests/task-rules.test.ts` used a fixed date for deterministic results.

Cases:

- past Todo is overdue;
- past In-Progress is overdue;
- past Complete is not overdue;
- due today is not overdue;
- future Todo is not overdue.

This kept date-sensitive tests independent of the actual day on which CI ran.

## First local test results and adjacent lint issue

The user ran `npm test` and all 8 tests passed. A production build also passed.

Two unrelated issues were observed:

- the Vitest ESM config warning described above;
- a pre-existing lint issue in `sort-controls.tsx` involving redundant local/effect state.

The sort control was simplified to derive state from props and navigate directly inside a transition. The AI recommended keeping that lint correction separate from the testing commit.

The automated behaviour work was committed as:

```text
487b3ee test(tasks): add automated task behaviour tests
```

## Documentation and initial CI workflow

The next project phase completed the README and CI setup.

README content covered:

- clean-clone installation with `npm ci`;
- development and production commands;
- feature usage;
- statuses and overdue semantics;
- local database location;
- tests using temporary SQLite;
- route and architecture overview;
- commands for lint, test, and build.

The GitHub workflow at `.github/workflows/ci.yml` was configured to run on pushes and pull requests to `main` and perform:

```text
npm ci
npm rebuild better-sqlite3
npm run lint
npm test
npm run build
```

Documentation and the initial workflow were committed as:

```text
3171575 chore: add project documentation and CI checks
```

## Repeated unsuccessful CI fixes

Local Windows tests passed, but every Ubuntu GitHub Actions run failed at `npm test`.

Several commits attempted to repair it:

- `6399ad2 fix(tests): run database tests sequentially`;
- `bf69ac4 fix(tests): use thread pool for SQLite tests`;
- `7d8a31a fix(tests)` reverting pool changes;
- `abc66ae fix(tests)` disabling file parallelism again;
- `d818c23 fix(ci workflow)` rebuilding `better-sqlite3`;
- `b37d4b9 fix(ci workflow)` pinning Node 20.18, clearing npm cache, and using verbose reporting;
- `07797a6` and `8fc1b05` dependency/lockfile adjustments.

None produced a successful workflow. This record is intentionally included: the problem was not solved by test serialization, switching worker pools, cache clearing, or blind dependency refreshes.

## Codex GitHub investigation

The user later asked Codex to access GitHub and fix the discrepancy.

The GitHub CLI was attempted first but was not installed. Codex switched to the public GitHub Actions REST API.

The API established that:

- multiple historical runs failed;
- checkout passed;
- Node setup passed;
- `npm ci` passed;
- native rebuild passed;
- ESLint passed;
- `npm test` failed;
- build was skipped after the failure.

Raw log download returned HTTP 403 because GitHub required repository-admin authentication for that endpoint. The public Check Run annotation only said `Process completed with exit code 1`, so the exact stack trace was still unavailable.

## First Node-version diagnosis and partial fix

Codex inspected the installed packages' own engine fields:

```text
Next 16.2.12: Node >=20.9.0
Vitest 4.1.10: Node 20, 22, or >=24
Vite 8.2.0: Node ^20.19.0 or >=22.12.0
Local machine: Node 24.14.1
CI workflow: Node 20.18.0
```

CI was below Vite's declared minimum. Codex changed the workflow and README to Node 20.19.0, verified lint/tests/build locally, committed, and pushed:

```text
808823f fix(ci): use supported Node version
```

GitHub run `30757042010` still failed at `npm test`. This partial fix corrected a real engine mismatch but did not solve the native crash.

## Exact Linux reproduction

Docker was unavailable, but WSL2 Ubuntu was installed. Codex created an isolated reproduction under `/tmp`, separate from Windows `node_modules`, the working tree, and local SQLite data.

There were transparent setup errors:

1. A Bash `$repro` variable was stripped by PowerShell, leaving an empty output path.
2. `$PATH` was expanded into a Windows path with spaces before Bash received it.
3. A nested JavaScript/Bash quoting attempt failed before executing Node.

Codex corrected these by using an explicit `/tmp/todo-app-ci-repro-808823f` path and a fully explicit Linux `PATH`.

Under official Linux Node 20.19.0:

- all five pure overdue-rule tests passed;
- the repository test worker exited unexpectedly;
- npm warned that `better-sqlite3@13.0.2` required Node >=22.

Under Node 22.12.0:

- the engine warning disappeared;
- the SQLite repository test still crashed;
- running it with Vitest's thread pool printed `Segmentation fault`.

This proved the failure was a native process crash, not a failed expectation, bad test ordering, or ordinary TypeScript error.

## Node 24 verification and final fix

Codex downloaded official Linux Node 24.14.1, rebuilt `better-sqlite3`, and ran:

```text
npm test
npm run build
```

Results:

- 2 test files passed;
- 8 tests passed;
- no unhandled worker errors;
- Next.js build succeeded;
- TypeScript checks succeeded.

The workflow and README were changed to Node 24.14.1.

Final commit:

```text
86db49f fix(ci): run SQLite tests on Node 24
```

Codex pushed it and monitored GitHub Actions rather than stopping after the push.

Final run:

```text
Run ID: 30757243058
Commit: 86db49f71036a1ccbc9d685f3733eaa76b728b76
Conclusion: success
```

Run URL: <https://github.com/Muhammed-Bayat/todo-app/actions/runs/30757243058>

## Final testing/CI state

- Tests exercise real SQLite SQL against disposable databases.
- The local development database is not opened by tests.
- Date behaviour is deterministic.
- Lint, test, and build run in CI.
- CI uses the same tested Node 24.14.1 runtime as the successful local/Linux environment.
- The native SQLite crash was fixed by environment alignment, not by weakening or skipping tests.
- Both unsuccessful and successful repair attempts remain visible in Git history and the raw/numbered transcripts.
