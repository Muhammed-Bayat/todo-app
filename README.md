# Taskly

A local-first task manager built with Next.js, TypeScript and SQLite. Create, organise, update and archive tasks from a clean single-page interface.

## Requirements

- Node.js 24 LTS
- npm
- Git

The project and its CI workflow are tested with Node.js `24.14.1` and npm `11.11.0`.

Verify the installed requirements:

```bash
node --version
npm --version
git --version
```

## Installation

```bash
git clone --branch main --single-branch https://github.com/Muhammed-Bayat/todo-app.git
cd todo-app
npm ci
```

The SQLite database and `tasks` table are created automatically when the application first runs. No separate database server or environment variables are required.

## Usage

Build and start the finished application:

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000). You can create and edit tasks in the side panel, change statuses from task cards, filter and sort tasks, and view archived tasks.

For development, start the server with automatic recompilation:

```bash
npm run dev
```

Development mode also runs at [http://localhost:3000](http://localhost:3000). Stop either server with `Ctrl+C`.

Run all automated tests with:

```bash
npm test
```
