# Taskly

A local-first task manager built with Next.js, TypeScript and SQLite. Create, organise, update and archive tasks from a clean single-page interface.

## Requirements

- Node.js `24.14.1`
- npm `11.11.0`
- Git

## Installation

```bash
git clone --branch main --single-branch https://github.com/Muhammed-Bayat/todo-app.git
cd todo-app
npm ci
```

The SQLite database and `tasks` table are created automatically when the application first runs. No separate database server or environment variables are required.

## Usage

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You can create and edit tasks in the side panel, change statuses from task cards, filter and sort tasks, and view archived tasks.

Run all automated tests with:

```bash
npm test
```
