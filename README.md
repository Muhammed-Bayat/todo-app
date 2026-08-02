# Todo App

A local-first todo application built for COMS3011A Lab 1 using Next.js, TypeScript and SQLite.

The application runs locally on a single user's computer. It does not require user accounts or an external database server.

## Requirements

Before installing the application, ensure that the following are available:

* Node.js 20.19 or newer
* npm
* Git, when cloning the repository

## Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/Muhammed-Bayat/todo-app.git
cd todo-app
```

Install the exact dependency versions recorded in `package-lock.json`:

```bash
npm ci
```

No separate database installation or configuration is required. The SQLite database and its tables are created automatically when the application first runs.

## Running the Application

Start the development server:

```bash
npm run dev
```

Open the following address in a browser:

```text
http://localhost:3000
```

To run a production build locally:

```bash
npm run build
npm start
```

The production application is also available at `http://localhost:3000` unless a different port is configured.

## Using the Application

### Create a task

Use the form on the main page to enter:

* title;
* description;
* due date;
* topic.

New tasks start with the `Todo` status.

### Edit a task

Select **Edit** on an active task. The edit page allows the title, description, due date, topic and status to be changed.

The available statuses are:

* Todo
* In-Progress
* Complete

### Archive a task

Select **Archive** on an active task.

Archiving does not delete the task. It records an archive timestamp and removes the task from the active list.

Archived tasks remain available through the **Archived tasks** link.

### Sort active tasks

Active tasks can be sorted by:

* due date;
* topic;
* status.

Use the direction button to switch between ascending and descending order. The selected sort settings are stored in the page URL and remain selected after a reload.

### Overdue tasks

A task is overdue when:

* its due date is before the current local date; and
* its status is not `Complete`.

A task due today is not overdue.

Overdue is derived from the task's due date and status. It is not stored in the database and is not a selectable status.

## Available Commands

| Command         | Purpose                              |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Create a production build            |
| `npm start`     | Start the completed production build |
| `npm run lint`  | Run ESLint                           |
| `npm test`      | Run all automated tests once         |

## Testing

Run the complete automated test suite with:

```bash
npm test
```

The tests exercise task creation, editing, archiving and the overdue rule.

Repository tests use a temporary SQLite database created in the operating system's temporary directory. The temporary database is removed after each test and the development database is not opened or modified.

## Database

The application uses SQLite through `better-sqlite3`.

The tracked database schema is located at:

```text
database/schema.sql
```

Application data is stored locally in:

```text
database/todo.db
```

The database file is generated automatically and is excluded from Git. Keep this file to preserve tasks between application restarts.

Archived tasks remain in the `tasks` table and are identified by their `archived_at` timestamp. Tasks are never deleted as part of the archive operation.

## Main Routes

| Route                 | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| `/`                   | Create, view, sort, edit and archive active tasks |
| `/archived`           | View archived tasks                               |
| `/tasks/[id]/edit`    | Edit a specific active task                       |
| `/api/database-check` | Check the SQLite connection and tasks table       |

## Architecture

This repository contains one Next.js application.

* React Server Components render task data.
* Server Actions handle task mutations.
* Server-side repository code accesses SQLite directly.
* No ORM or separate API server is used.
* One diagnostic API route is provided for checking the database connection.
* Application data persists locally between restarts.

## Continuous Integration

GitHub Actions runs the following checks for pushes and pull requests:

```bash
npm run lint
npm test
npm run build
```

All checks must pass before a change should be considered complete.
