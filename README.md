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

Your default browser opens [http://localhost:3000](http://localhost:3000) automatically when the server is ready. You can create and edit tasks in the side panel, change statuses from task cards, filter and sort tasks, and view archived tasks.

For development, start the server with automatic recompilation:

```bash
npm run dev
```

Development mode also opens [http://localhost:3000](http://localhost:3000) automatically. Stop either server with `Ctrl+C`.

Run all automated tests with:

```bash
npm test
```

## AI Usage and Attribution

This repository makes use of AI code generation using the following tools: ChatGPT-Web[GPT-5.6 Sol (high)], Codex[GPT-5.6 Sol (high)]. This repository does not use AI in-line editing tools. This repository makes use of AI code review using the following tool: Codex[GPT-5.6 Sol (high)].

Project planning, documentation, debugging and testing discussions also used ChatGPT-Web[GPT-5.6 Sol (high)] and Codex[GPT-5.6 Sol (high)]. Exact prompt-and-response records are provided in [`Ai-Transcripts`](./Ai-Transcripts/README.md).

### Historical commit-attribution omission

AI-assisted commits from the existing project history, including code-bearing commits between `d936c33` and `f3334bc`, were created without the AI policy's required `Assisted-by:` trailer. This omission is recorded here transparently. Those past commits have not been amended or rebased because rewriting them would change the published commit hashes and invalidate references in the development transcripts. Future commits containing AI-generated code will name the tools and models that assisted that specific commit. For the current uncommitted SQLite and browser-launch changes, the trailer will be:

```text
Assisted-by: Codex[GPT-5.6 Sol (high)]
```

AI Declaration: The preceding document was generated, reviewed and edited with the assistance of ChatGPT-Web[GPT-5.6 Sol (high)] and Codex[GPT-5.6 Sol (high)].
