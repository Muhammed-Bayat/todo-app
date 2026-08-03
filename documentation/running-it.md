# Running It

These instructions start the application from a clean clone. No separate SQLite installation, database server, environment variables or seed command is required.

## Required software

- Git, to clone the repository.
- Node.js 24 LTS.
- npm (included with Node.js).

The project and its GitHub Actions workflow are tested with Node.js `24.14.1` and npm `11.11.0`. Using those exact versions locally keeps installation and native SQLite behavior consistent with CI.

Confirm the installed versions:

```bash
node --version
npm --version
```

To reproduce the verified environment exactly, the output begins with `v24.14.1` for Node and `11.11.0` for npm. Other Node.js 24 LTS patch releases satisfy the general runtime requirement.

## Install from a clean clone

Run these commands in a terminal:

```bash
git clone --branch main --single-branch https://github.com/Muhammed-Bayat/todo-app.git
cd todo-app
npm ci
```

`npm ci` installs the exact dependency tree recorded in `package-lock.json`. It requires an internet connection for a fresh installation. Do not run `npm install` when reproducing the locked project setup, because that command may update the lockfile.

## Run in development mode

```bash
npm run dev
```

The default browser opens `http://localhost:3000` automatically when the server is ready. The first request automatically creates `database/todo.db` and its `tasks` table from `database/schema.sql`. Stop the server with `Ctrl+C`.

## Run the automated tests

```bash
npm test
```

This single command runs all Vitest tests once. The tests create disposable SQLite databases in the operating system's temporary directory; they do not read or change `database/todo.db`.

## Run the code-quality check

```bash
npm run lint
```

## Build and run in production mode

Stop the development server first, then run:

```bash
npm run build
npm start
```

The default browser opens `http://localhost:3000` automatically when the server is ready. The build step may require internet access when Next.js obtains the configured Geist font assets.

## Complete verification sequence

The same application checks can be run from the repository root with:

```bash
npm run lint
npm test
npm run build
```

All commands should exit successfully before the application is considered verified.

## Clean-clone verification record

These instructions were verified from a separate clean clone rather than from the existing development working directory.

| Item | Verified value |
|---|---|
| Date | 3 August 2026 |
| Commit tested | `f3334bc9c5547a68957d247703d8806821a9b49e` |
| Operating system and shell | Windows with PowerShell |
| Node.js | `v24.14.1` |
| npm | `11.11.0` |

The following documented commands were run in order:

```bash
git clone --branch main --single-branch https://github.com/Muhammed-Bayat/todo-app.git
cd todo-app
node --version
npm --version
npm ci
npm run lint
npm test
npm run build
npm run dev
```

The clean-clone results were:

- `npm ci` installed the locked dependency tree successfully;
- ESLint completed with no errors;
- Vitest passed both test files and all 8 tests;
- the Next.js production build compiled, type-checked and generated all routes successfully;
- `npm run dev` served `/` with HTTP status `200`;
- the first request created `database/todo.db` automatically;
- `/api/database-check` reported `database: "connected"` and `tasksTableExists: true`.

After stopping the development server, the production command was also verified:

```bash
npm start
```

The production server served `/` with HTTP status `200`. The disposable clone and its generated database were removed after verification.

AI Declaration: The preceding document was generated, reviewed and edited with the assistance of ChatGPT-Web[GPT-5.6 Sol (high)] and Codex[GPT-5.6 Sol (high)].
