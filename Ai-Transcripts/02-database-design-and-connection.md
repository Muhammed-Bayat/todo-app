# AI Usage Transcript 02: Database Design, SQLite, and Connection Setup

## Scope and source

This phase covers the database decisions, SQL schema, SQLite package installation, ignored database files, server-only connection module, diagnostic route, and database documentation.

Primary source: the second half of [ChatGPT-Next.js TypeScript Setup.md](<raw files/ChatGPT-Next.js TypeScript Setup.md>), dated 30 July 2026.

## Choosing whether to design or connect first

The user asked whether SQLite should be installed and linked before designing the database.

The AI recommended designing first. It explained that SQLite is not a separate online server: Next.js server-side code opens a local database file directly. The browser should not open the file.

The order agreed upon was:

1. Decide the database structure.
2. Create the tracked schema.
3. Install the SQLite driver.
4. Create the connection module.
5. Run a diagnostic route to prove persistence and table creation.
6. Document the design.

## Requirements taken from the lab brief

The design had to support:

- title, description, due date, and topic;
- exactly `Todo`, `In-Progress`, and `Complete` statuses;
- editing;
- archiving without deletion;
- sorting by topic, status, and due date;
- overdue as derived behaviour;
- persistence across reloads and restarts.

The AI identified rubric traps:

- do not store tasks only in memory or JSON;
- do not delete archived rows;
- do not move archived tasks into a second table;
- do not store `Overdue` as a status or database column;
- keep schema documentation consistent with the shipped SQL.

## One-table design

The agreed design used one `tasks` table. Separate `users`, `statuses`, `topics`, and `archived_tasks` tables were rejected as unnecessary for a single-user application with fixed statuses.

The columns were:

| Column | SQLite representation | Purpose |
|---|---|---|
| `id` | `INTEGER PRIMARY KEY` | Unique row identifier |
| `title` | required `TEXT` | Task title |
| `description` | `TEXT`, default empty string | Optional details |
| `due_date` | required `TEXT` | `YYYY-MM-DD` due date |
| `topic` | required `TEXT` | Display and sorting topic |
| `status` | constrained `TEXT` | Fixed workflow status |
| `archived_at` | nullable `TEXT` | Archive timestamp; null means active |
| `created_at` | timestamp text | Creation time |
| `updated_at` | timestamp text | Last mutation time |

## Description-field user decision

The AI initially suggested treating all four task fields as required because the walkthrough mentioned all four.

The user challenged the description requirement:

> i dont think description should be neeeded as for short tasks like by bread ex what would a description be

The design was adjusted so the database always contains a description value but permits an empty string. This preserved the four-field model while allowing short tasks with no meaningful extra detail.

## Archive and overdue decisions

The user explicitly checked whether the rubric requirement "archive represented as a flag or timestamp" was satisfied.

The answer was yes: `archived_at` is null for active tasks and receives a timestamp when archived.

Overdue was deliberately excluded from the schema. The rule was defined as:

```text
due date is earlier than today
AND status is not Complete
```

A task due today is not overdue.

## Schema file

The schema was placed at:

```text
database/schema.sql
```

The user asked why it was outside `src`. The AI explained this was an organisational choice, not a Next.js/SQLite requirement: `src` contains TypeScript application source, while `database` contains database assets and generated local data.

The schema used `CREATE TABLE IF NOT EXISTS`, blank-value checks, a date-shape check, a fixed-status check, defaults, and timestamps.

The schema was committed as:

```text
7b86380 feat(database): add initial tasks schema
```

## SQLite dependencies

The project installed:

```powershell
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

`better-sqlite3` was chosen as a direct synchronous Node.js SQLite driver suitable for a small local application. Its TypeScript declaration package was installed for type checking.

The dependency changes were isolated in:

```text
1beb1e6 build(database): add SQLite dependencies
```

## Ignoring generated database files

Before opening SQLite, `.gitignore` was updated with patterns for:

```text
database/*.db
database/*.db-*
database/*.sqlite
database/*.sqlite-*
database/*.sqlite3
database/*.sqlite3-*
```

This keeps `schema.sql` tracked but excludes the local database, WAL file, shared-memory file, and similar SQLite runtime data.

## Server-only connection module

The connection module was created at:

```text
src/lib/database.ts
```

Its responsibilities were:

1. Mark the module `server-only` so it could not enter a browser bundle.
2. Ensure the `database` directory exists.
3. Open `database/todo.db` with `better-sqlite3`.
4. Enable WAL journal mode.
5. Enable foreign-key enforcement.
6. Read and execute `database/schema.sql`.
7. Cache the connection on `globalThis` to avoid repeated development connections during hot reloads.

The first lint run passed, but the AI correctly noted that linting did not prove a database connection had opened because no route imported the module yet.

## Diagnostic API route

A Node.js route handler was added at:

```text
src/app/api/database-check/route.ts
```

Visiting:

```text
http://localhost:3000/api/database-check
```

returned:

```json
{
  "database": "connected",
  "tasksTableExists": true
}
```

This first import opened SQLite, created `database/todo.db`, executed the schema, and confirmed that the `tasks` table existed.

The user then ran `git status`. Only `.gitignore`, the route, and the connection module appeared; the generated `.db`, `.db-wal`, and `.db-shm` files did not. This verified the ignore rules.

The connection work was committed as:

```text
5fbf418 feat(database): add SQLite connection and schema check
```

## Database documentation

The rubric-required design document was created at:

```text
docs/database-design.md
```

It documented:

- the single tasks table;
- every column and constraint;
- the fixed status values;
- archive timestamp semantics;
- overdue derivation;
- text date storage;
- the absence of table relationships and why.

It was committed as:

```text
ce1c6fe docs(database): document tasks schema and design decisions
```

## End state of phase 2

At the stopping point confirmed by the user:

- SQLite dependencies were installed;
- the tracked schema existed;
- the local database opened successfully;
- the `tasks` table was created automatically;
- runtime database files were ignored;
- a health-check route proved the connection;
- the schema and design documentation matched;
- no task UI or task CRUD workflow had yet been implemented.
