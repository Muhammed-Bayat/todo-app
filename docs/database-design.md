# Database Design

## Overview

The application uses SQLite for local persistence. The database currently contains one table, `tasks`.

There are no relationships between tables because the application has no user accounts, custom statuses, or separate topic-management feature.

## Tasks Table

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | `INTEGER` | Primary key | Uniquely identifies each task |
| `title` | `TEXT` | Required and cannot be blank | Stores the task title |
| `description` | `TEXT` | Required value, defaults to an empty string | Stores optional additional details |
| `due_date` | `TEXT` | Required, stored as `YYYY-MM-DD` | Stores the task due date and supports sorting |
| `topic` | `TEXT` | Required and cannot be blank | Stores the task topic |
| `status` | `TEXT` | Required, defaults to `Todo` | Stores one of `Todo`, `In-Progress`, or `Complete` |
| `archived_at` | `TEXT` | Nullable | Stores when the task was archived; `NULL` means active |
| `created_at` | `TEXT` | Required, defaults to the current timestamp | Stores when the task was created |
| `updated_at` | `TEXT` | Required, defaults to the current timestamp | Stores when the task was last updated |

## Status Design

Task statuses are fixed and are enforced by a database constraint.

The only valid values are:

- `Todo`
- `In-Progress`
- `Complete`

Statuses are stored directly on each task because they are fixed application values and are not user-customisable.

## Archive Design

Archived tasks remain in the `tasks` table.

The `archived_at` column is:

- `NULL` when a task is active
- set to a timestamp when a task is archived

This allows an archived task to leave the active list while remaining stored and viewable. Tasks are not deleted or copied into a separate archive table.

## Overdue Design

Overdue is not stored as a column or status.

It is derived when tasks are read by checking whether:

1. the due date is before the current date; and
2. the task status is not `Complete`

This prevents overdue information from becoming outdated and ensures that overdue remains separate from the three selectable statuses.

## Date Storage

SQLite does not provide a dedicated date type, so dates and timestamps are stored as text.

Due dates use the format:

```text
YYYY-MM-DD