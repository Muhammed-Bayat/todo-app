# Database Design

## Overview

The application stores data locally in SQLite through `better-sqlite3`. The tracked schema is `database/schema.sql`, while the generated data file is `database/todo.db`.

The database currently contains one table, `tasks`.

## Tables and relationships

There are no relationships or foreign keys because there is only one table. Statuses and topics are values stored directly on each task; they are not separate entities. Archived tasks also remain in the same table rather than moving to another table.

```text
tasks
  id (primary key)
  title
  description
  due_date
  topic
  status
  archived_at
  created_at
  updated_at
```

## `tasks` table

| Column | SQLite type | Constraints | Purpose |
|---|---|---|---|
| `id` | `INTEGER` | Primary key | Uniquely identifies a task. SQLite assigns it when a row is inserted. |
| `title` | `TEXT` | Required; trimmed value cannot be empty | Stores the task title. |
| `description` | `TEXT` | Required; defaults to an empty string | Stores optional additional details. |
| `due_date` | `TEXT` | Required; must match `YYYY-MM-DD` | Stores the due date in a sortable format. |
| `topic` | `TEXT` | Required; trimmed value cannot be empty | Stores the task's topic or category. |
| `status` | `TEXT` | Required; defaults to `Todo`; checked value | Stores `Todo`, `In-Progress` or `Complete`. |
| `archived_at` | `TEXT` | Nullable; defaults to `NULL` | Distinguishes active tasks from archived tasks and records when archiving occurred. |
| `created_at` | `TEXT` | Required; defaults to `CURRENT_TIMESTAMP` | Records when the row was created. |
| `updated_at` | `TEXT` | Required; defaults to `CURRENT_TIMESTAMP` | Records the most recent task update. |

## Design decisions

### Status

The three allowed statuses are fixed application values, so a `CHECK` constraint keeps invalid values out of the table without requiring a separate status table.

### Archiving

An active task has `archived_at = NULL`. Archiving sets this column to a timestamp. The task remains in `tasks`, so archiving is not deletion and does not lose its details or history.

### Overdue state

Overdue is calculated rather than stored. A task is overdue when its due date is before the current local date and its status is not `Complete`. Calculating it prevents a stored overdue flag from becoming stale as dates pass.

### Dates and timestamps

SQLite has no dedicated date type, so due dates and timestamps are stored as `TEXT`. Due dates use `YYYY-MM-DD`, which makes ordinary text sorting match chronological order. SQLite's `CURRENT_TIMESTAMP` supplies creation, update and archive timestamps.

## Database creation

No external database server or manual migration command is required. On first use, `src/lib/database.ts`:

1. creates the `database` directory if necessary;
2. opens or creates `database/todo.db`;
3. enables WAL journal mode and foreign-key enforcement; and
4. executes `database/schema.sql` with `CREATE TABLE IF NOT EXISTS`.

Automated tests use separate temporary SQLite files and remove them after each test, so tests do not modify the development database.
