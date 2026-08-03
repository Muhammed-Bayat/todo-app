# Running It

These instructions start the application from a clean clone. No separate SQLite installation, database server, environment variables or seed command is required.

## Required software

- Git, to clone the repository.
- Node.js `24.14.1`.
- npm `11.11.0` (included with the stated Node installation).

The repository's GitHub Actions workflow uses Node.js `24.14.1`, so using the same version locally keeps installation and native SQLite behavior consistent with CI.

Confirm the installed versions:

```bash
node --version
npm --version
```

The expected output begins with `v24.14.1` for Node and `11.11.0` for npm.

## Install from a clean clone

Run these commands in a terminal:

```bash
git clone https://github.com/Muhammed-Bayat/todo-app.git
cd todo-app
npm ci
```

`npm ci` installs the exact dependency tree recorded in `package-lock.json`. It requires an internet connection for a fresh installation. Do not run `npm install` when reproducing the locked project setup, because that command may update the lockfile.

## Run in development mode

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. The first request automatically creates `database/todo.db` and its `tasks` table from `database/schema.sql`. Stop the server with `Ctrl+C`.

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

Open `http://localhost:3000`. The build step may require internet access when Next.js obtains the configured Geist font assets.

## Complete verification sequence

The same application checks can be run from the repository root with:

```bash
npm run lint
npm test
npm run build
```

All commands should exit successfully before the application is considered verified.
