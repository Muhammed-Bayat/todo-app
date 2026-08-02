# Next.js TypeScript Setup

**User:** Anonymous  
**Created:** 7/30/2026 9:38:11  
**Updated:** 7/31/2026 11:31:38  
**Exported:** 8/2/2026 18:56:17  
**Link:** [https://chatgpt.com/g/g-p-6a64d379628c81919baa208063a5387c/c/6a6afee4-4d94-83ea-98d0-3b37570e9a85](https://chatgpt.com/g/g-p-6a64d379628c81919baa208063a5387c/c/6a6afee4-4d94-83ea-98d0-3b37570e9a85)  

## Prompt:
7/30/2026, 9:38:08 AM

Im required to Build a todo application using Next.js and SQLite. 
The application is local-first. It will not be deployed to the web; a user downloads it and runs it locally
via Node.js, npm or equivalent. There are no user accounts — the application serves a single user on the
machine it runs on.

i need help setting this up all including the github repo
Help me scaffold only the initial Next.js TypeScript project. Specify the
commands, recommended folder structure and required dependencies. Do not
implement any task features yet. Keep the dependency list minimal.

## Response:
7/30/2026, 9:38:22 AM

I’ll align the scaffold with your course’s frontend/backend separation, verify the current official Next.js setup, and keep SQLite out of the frontend for now.

## Recommended setup

Use **one Git repository at the project root**, with Next.js inside a `frontend/` directory. This leaves room for a separate backend later and avoids using Next.js as both frontend and backend.

Next.js currently requires Node.js **20.9 or newer**. `create-next-app` can configure TypeScript, ESLint, the App Router and a `src/` directory automatically. 

### 1. Check the prerequisites

Run:

```bash
node --version
npm --version
git --version
```

Use a current Node.js LTS release. Your Node version must be at least `20.9`.

---

## 2. Create the project

Run these commands from the directory where you keep your university projects:

```bash
mkdir coms3011a-todo-app
cd coms3011a-todo-app
git init -b main
```

Now scaffold the frontend:

```bash
npx create-next-app@latest frontend --typescript --eslint --app --src-dir --no-tailwind --no-react-compiler --use-npm --import-alias "@/*" --disable-git
```

The important options are:

- `--typescript`: use TypeScript.
- `--eslint`: configure ESLint.
- `--app`: use the App Router.
- `--src-dir`: place application code inside `src/`.
- `--no-tailwind`: keep styling dependencies minimal.
- `--no-react-compiler`: avoid adding the optional compiler dependency.
- `--use-npm`: use npm and create `package-lock.json`.
- `--disable-git`: prevent a second Git repository inside `frontend/`.

These options are supported by the current `create-next-app` CLI. 

---

## 3. Run the application

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:3000
```

Stop the development server with `Ctrl+C`.

Then verify linting and the production build:

```bash
npm run lint
npm run build
```

Return to the repository root afterwards:

```bash
cd ..
```

---

## 4. Recommended folder structure

Immediately after scaffolding, use this structure:

```text
coms3011a-todo-app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── app/
│   │       ├── favicon.ico
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

The eventual project can grow into:

```text
coms3011a-todo-app/
├── frontend/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── types/
├── backend/                 # Separate API and SQLite code later
├── docs/
├── .github/
│   └── workflows/           # CI configuration later
├── .gitignore
└── README.md
```

Do not create `components`, `lib`, `types`, `backend` or CI files until you actually need them. Empty directories are not tracked by Git anyway.

Most importantly, do **not** create `frontend/src/app/api/`. Based on the course requirement you provided earlier, Next.js should remain the frontend and your handwritten API should eventually live in a separate backend.

---

## 5. Root `.gitignore`

Create `.gitignore` in `coms3011a-todo-app/`, outside `frontend`, containing:

```gitignore
# Dependencies
node_modules/

# Next.js output
.next/
out/

# Environment files
.env
.env.local
.env.*.local

# Local SQLite database files
*.db
*.db-shm
*.db-wal
*.sqlite
*.sqlite3

# Logs
*.log

# Editors and operating systems
.vscode/
.idea/
.DS_Store
Thumbs.db
```

The generated frontend already contains its own `.gitignore`, but the root file will also cover your future backend and SQLite files.

Database schema or migration files should eventually be committed. The actual local database containing user data should not be committed.

---

## 6. Root README

Create `README.md` in the project root:

```markdown
# COMS3011A Todo Application

A local-first todo application built for COMS3011A.

## Planned architecture

- Frontend: Next.js and TypeScript
- Backend: Separate Node.js API
- Database: SQLite
- Deployment: Local execution only

## Current state

The initial Next.js TypeScript frontend has been scaffolded. Task functionality,
the backend API and SQLite persistence have not yet been implemented.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```
```

---

## 7. Dependencies

You do not need to manually install anything after `create-next-app` finishes.

### Runtime dependencies

```text
next
react
react-dom
```

### Development dependencies

```text
typescript
@types/node
@types/react
@types/react-dom
eslint
eslint-config-next
```

Next.js has built-in TypeScript support, and `create-next-app` installs and configures the necessary TypeScript packages. 

### Do not install yet

Do not add any of these during the initial scaffold:

```text
better-sqlite3
sqlite3
Prisma
Drizzle
Express
Axios
Tailwind CSS
Bootstrap
Material UI
Zod
```

SQLite belongs in the future **backend**, not the Next.js frontend. You also do not need Axios because the browser’s built-in `fetch` API can communicate with your future backend.

---

## 8. Make the initial commit

From the repository root:

```bash
git status
git add .
git commit -m "chore: scaffold Next.js TypeScript frontend"
```

Check the commit:

```bash
git log --oneline
```

---

## 9. Create the GitHub repository

### GitHub website method

On GitHub, create a repository named:

```text
coms3011a-todo-app
```

Choose **Private** unless your lecturer requires a public repository.

Do not initialize it with:

- A README
- A `.gitignore`
- A licence

Your local repository already contains the first two. GitHub recommends leaving these options unchecked when pushing an existing local repository. 

Then run:

```bash
git remote add origin https://github.com/YOUR-USERNAME/coms3011a-todo-app.git
git remote -v
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. GitHub’s documented flow is to add the remote as `origin`, verify it and push the `main` branch. 

### GitHub CLI alternative

With GitHub CLI installed:

```bash
gh auth login
gh repo create coms3011a-todo-app --private --source=. --remote=origin --push
```

GitHub CLI can create the repository, add the remote and push the current project in one command. 

---

## Final state

At this stage, you should have:

- One root Git repository.
- One Next.js TypeScript frontend.
- ESLint configured.
- No Tailwind or UI libraries.
- No task functionality.
- No API routes.
- No SQLite dependency yet.
- An initial commit pushed to GitHub.

## Prompt:
7/30/2026, 9:50:17 AM

do one thing at a time so if theres questions i need i can answer and we can get it sorted before i move on to the next

## Response:
7/30/2026, 9:50:23 AM

Absolutely. We’ll go **one step at a time**, and I’ll wait for your result before moving on.

### Step 1: Check your installed tools

Open a terminal and run:

```bash
node --version
npm --version
git --version
```

Send me the output of all three commands.

## Prompt:
7/30/2026, 9:50:59 AM

these are fine

## Response:
7/30/2026, 9:51:06 AM

### Step 2: Create the project folder and initialise Git

In your terminal, navigate to where you keep your projects, then run:

```bash
mkdir coms3011a-todo-app
cd coms3011a-todo-app
git init -b main
```

Then run:

```bash
git status
```

Send me the output from `git status`.

## Prompt:
7/30/2026, 9:52:09 AM

it says on branch main no commits yet and i called the folder Todo_App

## Response:
7/30/2026, 9:52:15 AM

Perfect — Git is set up correctly, and `Todo_App` is fine as the folder name.

### Step 3: Scaffold the Next.js frontend

Make sure your terminal is inside `Todo_App`, then run:

```bash
npx create-next-app@latest frontend --typescript --eslint --app --src-dir --no-tailwind --no-react-compiler --use-npm --import-alias "@/*" --disable-git
```

Let it finish, then tell me whether it completed successfully or paste any error you get.

## Prompt:
7/30/2026, 9:52:55 AM

why frontend? and why disable-git as im going to need to be making commits and pushing to my github repo

## Response:
7/30/2026, 9:53:02 AM

Good question.

### Why `frontend`?

Your course requires the frontend and backend to be **non-monolithic**. So the project will eventually look like:

```text
Todo_App/
├── frontend/   # Next.js user interface
└── backend/    # API and SQLite later
```

Next.js will only display the interface and send requests to your future backend API. SQLite will belong in the backend.

### Why `--disable-git`?

You already initialized Git in the outer `Todo_App` folder:

```text
Todo_App/.git
```

Without `--disable-git`, `create-next-app` might create another Git repository inside:

```text
Todo_App/frontend/.git
```

That would give you a confusing **nested Git repository**.

`--disable-git` does **not** disable Git for your project. It only tells Next.js not to create a second repository. Your existing root repository will still track everything inside `frontend`.

For example, from `Todo_App`, you will still use:

```bash
git add .
git commit -m "chore: scaffold Next.js frontend"
git push
```

So the command is correct for this structure. Do not run it yet until this explanation makes sense.

## Prompt:
7/30/2026, 9:55:25 AM

i dont think i needed a seperate back end and front end im going to upload the brief correct me if im wrong

[Attachment: lab_one.pdf]

## Response:
7/30/2026, 9:55:27 AM

You’re right. **This brief does not require separate frontend and backend projects.** My earlier recommendation added unnecessary structure.

Page 1 only asks for a local-first application using **Next.js and SQLite**, run locally through Node.js/npm. It does not require a separate API server or a `frontend/` and `backend/` split. `lab_one.pdf`

A sensible structure is one Next.js project:

```text
Todo_App/
├── src/
│   └── app/
├── public/
├── package.json
├── next.config.ts
└── ...
```

Later, SQLite code can run in the **server-side part of Next.js**, while the browser-facing components display the interface. It can all remain one application and one repository.

`--disable-git` is still fine because you already created the Git repository in `Todo_App`. It only prevents `create-next-app` from trying to create another repository; commits and GitHub pushes will work normally.

Before scaffolding, we should address one small issue: `Todo_App` may be rejected as an npm project name because of the uppercase letters and underscore. Renaming it to `todo-app` is safest. Which terminal are you using: Windows PowerShell, Command Prompt, or macOS/Linux?

## Prompt:
7/30/2026, 9:56:57 AM

thats fine ill rename it im using windows powershell

## Response:
7/30/2026, 9:57:05 AM

### Step 3: Rename the folder

In PowerShell, first move out of the folder:

```powershell
cd ..
```

Then rename it:

```powershell
Rename-Item Todo_App todo-app
```

Now enter it again:

```powershell
cd todo-app
```

Finally, check Git is still working:

```powershell
git status
```

Send me the output from `git status`.

## Prompt:
7/30/2026, 9:58:36 AM

PS C:\Users\bayat\Desktop\todo-app> git status
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)

## Response:
7/30/2026, 9:58:39 AM

Git is working correctly.

### Next step: Scaffold Next.js directly inside `todo-app`

While your PowerShell prompt is here:

```text
PS C:\Users\bayat\Desktop\todo-app>
```

run:

```powershell
npx create-next-app@latest . --typescript --eslint --app --src-dir --no-tailwind --use-npm --import-alias "@/*" --disable-git
```

The `.` means “create the project in the current folder,” so there will be no separate `frontend` folder. `--disable-git` only prevents another Git repository from being created; your existing repository remains active. These options are supported by the current Next.js setup tool. 

Let it finish, then paste the final few lines of its output or any error message.

## Prompt:
7/30/2026, 9:59:33 AM

just tell me what each flags for and wwhy its needed first and then ill run it

## Response:
7/30/2026, 9:59:35 AM

Here is the command we are considering:

```powershell
npx create-next-app@latest . --typescript --eslint --app --src-dir --no-tailwind --no-react-compiler --use-npm --import-alias "@/*" --disable-git
```

Not every flag is strictly required. They make the setup predictable and keep dependencies minimal.

### `npx`

Runs an npm package without requiring you to install it globally.

```powershell
npx create-next-app
```

This temporarily runs the Next.js project-creation tool.

### `create-next-app@latest`

`create-next-app` is the official Next.js scaffolding tool.

`@latest` tells npm to use its latest available version rather than an older cached version. 

### `.`

The dot means:

> Create the Next.js project inside the current folder.

Because you are already inside:

```text
C:\Users\bayat\Desktop\todo-app
```

the files will be created directly there.

Without the dot, we would need to provide another folder name, which would create an unnecessary nested directory such as:

```text
todo-app/todo-app/
```

### `--typescript`

Creates a TypeScript project rather than plain JavaScript.

This gives files such as:

```text
page.tsx
layout.tsx
tsconfig.json
```

We are using it because your requested scaffold specifically requires TypeScript. TypeScript is also currently the Next.js default, but including the flag makes the choice explicit. 

### `--eslint`

Sets up ESLint.

ESLint checks the code for common mistakes and code-quality problems. It is useful for catching issues before committing or testing the application.

For example, it can detect:

- unused variables;
- incorrect React usage;
- some accessibility problems;
- certain Next.js-specific mistakes.

The generated configuration includes Next.js and TypeScript-specific rules. 

### `--app`

Uses the modern Next.js **App Router**.

This means the application routes will live under:

```text
src/app/
```

For example:

```text
src/app/page.tsx
```

will represent the home page.

We should use this because it is the current recommended Next.js routing approach for a new application. 

### `--src-dir`

Places the application source code inside a `src` folder:

```text
todo-app/
├── src/
│   └── app/
├── package.json
├── tsconfig.json
└── next.config.ts
```

This separates application code from configuration files.

It is not mandatory, but it makes the project structure cleaner as the application grows. Next.js officially supports this structure. 

### `--no-tailwind`

Prevents Tailwind CSS from being installed.

Tailwind is currently included in the recommended Next.js defaults, but your instruction was to keep the dependency list minimal. We can use normal CSS instead. 

This avoids adding Tailwind-related setup that we do not currently need.

### `--no-react-compiler`

Prevents the optional React Compiler from being enabled.

We do not need it for a straightforward todo application, and leaving it out keeps the initial setup simpler. The `--no-` prefix tells `create-next-app` to negate an available option. 

### `--use-npm`

Tells the setup tool to use npm rather than Yarn, pnpm or Bun.

It will:

- install the dependencies using npm;
- generate `package-lock.json`;
- allow us to use commands such as `npm run dev`.

You already confirmed npm is installed, so using it consistently avoids mixing package managers. 

### `--import-alias "@/*"`

Configures an import shortcut.

Instead of writing a long relative path:

```typescript
import Something from "../../../components/Something";
```

you can later write:

```typescript
import Something from "@/components/Something";
```

With `--src-dir`, `@/` points into the `src` directory.

This flag is optional, and `@/*` is already the Next.js default. We include it so the configuration is explicit. 

### `--disable-git`

Stops `create-next-app` from initializing Git itself.

You already ran:

```powershell
git init -b main
```

so your repository already exists here:

```text
todo-app/.git/
```

This flag does **not** disable your existing Git repository. It only stops the scaffolding tool from trying to initialize Git again. You will still make commits normally:

```powershell
git add .
git commit -m "chore: scaffold Next.js project"
git push
```

The flag is officially described as disabling Git initialization by the CLI. 

So the final command remains:

```powershell
npx create-next-app@latest . --typescript --eslint --app --src-dir --no-tailwind --no-react-compiler --use-npm --import-alias "@/*" --disable-git
```

## Prompt:
7/30/2026, 10:17:19 AM

done

## Response:
7/30/2026, 10:17:24 AM

Great.

### Next step: Verify the Next.js app starts

In the same PowerShell window, run:

```powershell
npm run dev
```

Wait until you see a message showing the local address, usually:

```text
http://localhost:3000
```

Open that address in your browser and tell me whether the default Next.js page loads.

## Prompt:
7/30/2026, 10:19:04 AM

it does

## Response:
7/30/2026, 10:19:13 AM

Great — the scaffold is working.

### Next step: Run the code-quality check

Stop the development server by pressing:

```text
Ctrl + C
```

Then run:

```powershell
npm run lint
```

Tell me whether it finishes without errors, or paste the output if it fails.

## Prompt:
7/30/2026, 10:20:08 AM

finished fine what did lint do

## Response:
7/30/2026, 10:20:17 AM

`npm run lint` ran **ESLint**, a tool that examines your source code without starting the application.

It checks for things such as:

- TypeScript or JavaScript patterns likely to cause bugs
- unused variables or imports
- incorrect React patterns
- some Next.js-specific problems
- code that violates the rules in `eslint.config.mjs`

Because it finished successfully, your generated code currently has **no ESLint errors under the configured rules**.

It does **not** prove the application works correctly, test features, or check the database. It only performs static code analysis.

## Prompt:
7/30/2026, 10:23:01 AM

okay

## Response:
7/30/2026, 10:23:08 AM

### Next step: Check the production build

Run:

```powershell
npm run build
```

This verifies that Next.js can compile the project for production, not just run it in development mode.

Tell me whether it completes successfully or paste the error output.

## Prompt:
7/30/2026, 10:23:45 AM

done and success

## Response:
7/30/2026, 10:23:51 AM

Great — that confirms the scaffold compiles successfully.

### Next step: Check what Git sees

Run:

```powershell
git status
```

Paste the output here.

## Prompt:
7/30/2026, 10:24:25 AM

on branch main and a bunch of untracked files

## Response:
7/30/2026, 10:24:34 AM

That is expected. The scaffolded Next.js files are **untracked** because Git has not added them to a commit yet.

### Next step: Stage the scaffold

Run:

```powershell
git add .
```

This stages the project files for the first commit. It does not commit or upload anything yet.

Then run:

```powershell
git status
```

Tell me what it shows under **“Changes to be committed.”**

## Prompt:
7/30/2026, 10:25:06 AM

yea its all green now

## Response:
7/30/2026, 10:25:10 AM

Great — that means the files are staged correctly.

### Next step: Create the first commit

Run:

```powershell
git commit -m "chore: scaffold initial Next.js TypeScript project"
```

This saves the current scaffold as your first Git checkpoint.

Then run:

```powershell
git status
```

Tell me whether it says the working tree is clean.

## Prompt:
7/30/2026, 10:26:00 AM

yup its clean , how do i link it to my online repo again

## Response:
7/30/2026, 10:26:02 AM

### Next step: Create the empty GitHub repository

On GitHub, create a new repository named:

```text
todo-app
```

Choose **Private** or **Public** according to your course requirements.

Do **not** select any of these:

- Add a README
- Add `.gitignore`
- Choose a licence

Your local project already contains files and a commit, so the GitHub repository should be empty to avoid merge conflicts. 

After creating it, leave the GitHub **Quick Setup** page open and tell me when it is ready.

## Prompt:
7/30/2026, 10:27:53 AM

yea created

## Response:
7/30/2026, 10:28:12 AM

### Next step: Link your local project to GitHub

Copy the HTTPS URL from the GitHub Quick Setup page. It should look like:

```text
https://github.com/YOUR-USERNAME/todo-app.git
```

Then run:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/todo-app.git
```

Replace `YOUR-USERNAME` with your actual GitHub username.

Now verify it:

```powershell
git remote -v
```

Send me the output.

## Prompt:
7/30/2026, 10:29:11 AM

PS C:\Users\bayat\Desktop\todo-app> git remote -v
origin  https://github.com/Muhammed-Bayat/todo-app.git (fetch)
origin  https://github.com/Muhammed-Bayat/todo-app.git (push)
PS C:\Users\bayat\Desktop\todo-app>

## Response:
7/30/2026, 10:29:19 AM

Your local repository is linked to the correct GitHub repository.

### Next step: Push your first commit

Run:

```powershell
git push -u origin main
```

`-u` connects your local `main` branch to GitHub’s `main` branch, so future pushes can usually be done with just:

```powershell
git push
```

Tell me whether the push succeeds or paste any error message.

## Prompt:
7/30/2026, 10:30:03 AM

all good

## Response:
7/30/2026, 10:30:15 AM

Great — your initial setup is complete:

- Next.js + TypeScript scaffolded
- ESLint and production build verified
- Git repository initialized
- First commit created
- GitHub remote linked
- `main` branch pushed successfully

The next sensible step is to review the generated folder structure and dependencies before adding any task functionality. Say **continue** when ready.

## Prompt:
7/30/2026, 10:32:25 AM

lets do it

## Response:
7/30/2026, 10:32:31 AM

### Next step: Inspect the project root

From inside `todo-app`, run:

```powershell
Get-ChildItem -Force
```

This lists the files and folders at the top level, including hidden items such as `.git` and `.gitignore`.

Paste the output here, and we’ll go through what each item is for before moving deeper into `src`.

## Prompt:
7/30/2026, 10:34:36 AM

okay lets leave this and move onto the sql lite part like setting that up possiblyl linking and then once thats done well move to desigining the actual database or do i do and design first before linking

## Response:
7/30/2026, 10:34:38 AM

You should **design the database first**, then install and connect SQLite.

SQLite is not “linked” like an online database. There is no separate SQLite server. Your server-side Next.js code will open a local database file such as:

```text
data/todo.db
```

The browser-facing React components should not access that file directly; the database code stays on the server side of the Next.js application. Next.js App Router supports server-side components and functions within the same project. 

The best order is:

1. Decide the database structure.
2. Install the SQLite library.
3. Create the database connection module.
4. Create the schema.
5. Run a small test to confirm data persists.

Designing first matters because the marking rubric specifically checks that:

- archived tasks remain in the same table using a flag or timestamp;
- overdue is calculated from the due date rather than stored as a status or column;
- the actual schema matches your database documentation. `lab_one.pdf`

For this project, we will probably use one simple `tasks` table and `better-sqlite3`. It provides a straightforward Node.js API and supports currently maintained Node versions, with prebuilt binaries for LTS releases. 

So our **next step should be designing the `tasks` table**, without installing anything yet.

## Prompt:
7/30/2026, 10:46:51 AM

okay lets get into it.. refer back to the document i uploaded with regards to the feature list, the functional walk through , and the database design column in the rubric

## Response:
7/30/2026, 10:47:33 AM

## Database design - Step 1: Decide the table model

From the brief, the database must support:

- creating and editing tasks;
- the four task fields: title, description, due date and topic;
- exactly three fixed statuses;
- archiving without deleting;
- sorting by topic, status and due date;
- deriving overdue rather than storing it;
- persistence after reloads and application restarts. `lab_one.pdf`

The rubric also specifically warns against:

- storing tasks in JSON or memory instead of SQLite;
- deleting archived tasks;
- copying archived tasks into another table;
- storing `overdue` as a database column or status;
- having documentation that does not match the actual schema. `lab_one.pdf`

### Recommended model: one `tasks` table

The brief does not require user accounts, custom statuses or topic-management features. Therefore, the simplest suitable design is:

```text
tasks
```

There is no need yet for:

```text
users
statuses
topics
archived_tasks
```

`topic` can simply be text stored on each task. Because there would be only one table, the database documentation would state that there are currently **no relationships between tables**.

### Proposed columns

| Column | SQLite type | Purpose |
|---|---|---|
| `id` | `INTEGER` | Unique identifier for each task |
| `title` | `TEXT` | Task title |
| `description` | `TEXT` | Task description |
| `due_date` | `TEXT` | Due date stored as `YYYY-MM-DD` |
| `topic` | `TEXT` | Topic used for display and sorting |
| `status` | `TEXT` | One of `Todo`, `In-Progress`, or `Complete` |
| `archived_at` | `TEXT` or `NULL` | Date/time archived; `NULL` means active |
| `created_at` | `TEXT` | Date/time the task was created |
| `updated_at` | `TEXT` | Date/time the task was last edited |

### Important design decisions

**Archive is not deletion**

When a task is archived:

```text
archived_at = current date and time
```

Active tasks are found using:

```sql
WHERE archived_at IS NULL
```

Archived tasks remain in the same table and can be shown separately. This directly supports the walkthrough requirement that an archived task disappears from the active list but remains viewable.

**Overdue is not stored**

There will be no column such as:

```text
is_overdue
overdue
```

Instead, I recommend deriving it when tasks are read:

```text
due date is before today
AND status is not Complete
```

A task due today is therefore not overdue yet. A completed task is not shown as overdue even if its due date has passed.

**Status is constrained**

The database should reject any status other than:

```text
Todo
In-Progress
Complete
```

That protects the fixed-status requirement at the database level rather than relying only on the interface.

The first decision to confirm is: use one `tasks` table, store `topic` as text, and represent archiving with an `archived_at` timestamp.

## Prompt:
7/30/2026, 10:58:01 AM

yuhhh looks good

## Response:
7/30/2026, 10:58:22 AM

Perfect. The next design decision is **which columns are required and what defaults they use**.

Because the walkthrough checks that a created task carries all four fields, the safest interpretation is to require:

- `title`
- `description`
- `due_date`
- `topic`

The remaining defaults would be:

```text
status       → "Todo"
archived_at  → NULL
created_at   → current timestamp
updated_at   → current timestamp
```

The database would enforce:

```text
status must be:
Todo
In-Progress
Complete
```

So a newly created task automatically starts as `Todo`, remains active because `archived_at` is `NULL`, and records when it was created. This matches the brief’s fixed statuses and four required task fields. `lab_one.pdf`

One choice to confirm before writing the schema: **should description be mandatory and non-empty, or may a user leave it blank?** My recommendation is to require it, since the walkthrough explicitly refers to all four fields.

## Prompt:
7/30/2026, 11:06:26 AM

i dont think description should be neeeded as for short tasks like by bread ex what would a description be you know and since its only required to be  sortable by topic, by status and by due date i dont think it should be needed . just double checking this this rubric requirement is met archive
represented as a flag or
timestamp

## Response:
7/30/2026, 11:06:44 AM

Yes-your reasoning on `description` is sound.

The brief says each task **carries** Title, Description, Due Date and Topic, and the walkthrough checks that a task can be created with all four fields. It does **not** explicitly say every field must contain non-empty text. `lab_one.pdf`

So we can make the description optional while still including the field:

```text
description TEXT NOT NULL DEFAULT ''
```

That means:

- every task has a `description` value;
- the user may leave it blank;
- we avoid dealing with both `NULL` and empty strings;
- the creation form will still show a Description field.

And yes, this design meets the archive requirement:

```text
archived_at TEXT NULL
```

The rubric explicitly accepts archive being represented as **a flag or timestamp on the task**. Our timestamp approach qualifies directly. `lab_one.pdf`

It would work like this:

```text
archived_at = NULL
```

means the task is active.

```text
archived_at = "2026-07-30T11:15:00Z"
```

means it is archived.

The task remains in the same `tasks` table, so it can leave the active list while remaining viewable, matching the functional walkthrough. We should keep `archived_at` rather than a simple boolean because it also records **when** the task was archived.

## Prompt:
7/30/2026, 11:07:26 AM

lets move on

## Response:
7/30/2026, 11:07:44 AM

### Next database-design decision: dates and timestamps

I recommend:

```text
due_date     TEXT NOT NULL
archived_at  TEXT NULL
created_at   TEXT NOT NULL
updated_at   TEXT NOT NULL
```

SQLite does not have a dedicated date type, so we will store dates as text.

For `due_date`, use:

```text
YYYY-MM-DD
```

Example:

```text
2026-08-04
```

This format is useful because it sorts correctly as text, which supports the walkthrough requirement to sort tasks by due date. `lab_one.pdf`

For timestamps such as `created_at`, `updated_at`, and `archived_at`, SQLite can use UTC values such as:

```text
2026-07-30 09:15:00
```

The proposed schema is now:

```text
tasks
├── id
├── title
├── description
├── due_date
├── topic
├── status
├── archived_at
├── created_at
└── updated_at
```

With these rules:

```text
title        required and non-empty
description  optional, defaults to ""
due_date     required
topic        required and non-empty
status       defaults to "Todo"
archived_at  defaults to NULL
created_at   defaults to current timestamp
updated_at   defaults to current timestamp
```

The next step is to write the actual SQL schema file from this design.

## Prompt:
7/30/2026, 11:08:28 AM

yup

## Response:
7/30/2026, 11:08:40 AM

### Next step: Create the SQL schema file

From the project root, create a `database` folder and schema file:

```powershell
New-Item -ItemType Directory database
New-Item -ItemType File database\schema.sql
```

Open `database\schema.sql` in VS Code and paste:

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,

    title TEXT NOT NULL
        CHECK (length(trim(title)) > 0),

    description TEXT NOT NULL DEFAULT '',

    due_date TEXT NOT NULL
        CHECK (
            length(due_date) = 10
            AND due_date GLOB
                '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'
        ),

    topic TEXT NOT NULL
        CHECK (length(trim(topic)) > 0),

    status TEXT NOT NULL DEFAULT 'Todo'
        CHECK (
            status IN ('Todo', 'In-Progress', 'Complete')
        ),

    archived_at TEXT DEFAULT NULL,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

This schema provides the required fields, limits status to the three allowed values, and keeps archived tasks in the same table through `archived_at`. There is deliberately no overdue column because the rubric requires overdue to be derived from the due date and status. `lab_one.pdf`

`updated_at` will be changed explicitly by our application whenever a task is edited.

Save the file, then tell me when it is done.

## Prompt:
7/30/2026, 11:11:24 AM

so this file is in the same directory as the src and not insdie the src? why also is this the case of where it needs to be

## Response:
7/30/2026, 11:11:38 AM

Yes, `database/schema.sql` should sit at the project root, alongside `src`:

```text
todo-app/
├── database/
│   └── schema.sql
├── src/
│   └── app/
├── public/
├── package.json
└── ...
```

This location is **not required by SQLite or Next.js**. It is an organisational choice.

`src/` is mainly for the TypeScript application code that Next.js compiles, such as pages, components, server functions and database-access code. The SQL schema is not application code; it is a definition of how the database should be created.

Keeping it in `database/` makes these different items easy to distinguish later:

```text
database/schema.sql   # Tracked definition of the database
database/todo.db      # Generated local database file
src/lib/database.ts   # TypeScript code that opens and queries SQLite
```

It also makes the schema easy for your marker to find. That matters because the rubric explicitly expects a schema file or migrations and checks that the shipped schema matches the database-design documentation. `lab_one.pdf`

You technically could place it inside `src`, but there is no benefit for this project. A root-level `database/` folder is clearer and conventional.

## Prompt:
7/30/2026, 11:12:59 AM

cool files made and its done

## Response:
7/30/2026, 11:13:10 AM

Great.

### Next step: Check Git sees the schema

Run:

```powershell
git status
```

You should see the new `database/schema.sql` file as untracked.

We’ll commit the database design separately so your history shows a clear, coherent step, which supports the commit-history rubric. `lab_one.pdf`

Paste the output from `git status`.

## Prompt:
7/30/2026, 11:14:20 AM

okay i added give me the commit following the conventional commit message

## Response:
7/30/2026, 11:14:26 AM

Use:

```powershell
git commit -m "feat(database): add initial tasks schema"
```

This fits Conventional Commits:

- `feat` — adds a new project capability
- `database` — identifies the affected area
- `add initial tasks schema` — states exactly what changed

After that, run:

```powershell
git push
```

## Prompt:
7/30/2026, 11:14:52 AM

done

## Response:
7/30/2026, 11:14:54 AM

### Next step: Install the SQLite dependency

We’ll use `better-sqlite3` because it gives server-side Node.js code a direct, straightforward way to work with SQLite. Its official installation command is `npm install better-sqlite3`. 

Run these commands separately:

```powershell
npm install better-sqlite3
```

```powershell
npm install --save-dev @types/better-sqlite3
```

The second package provides TypeScript type information so the editor and compiler understand the library’s API. 

This will update:

```text
package.json
package-lock.json
node_modules/
```

Do not create the connection code yet. Tell me whether both installations finish successfully.

## Prompt:
7/30/2026, 11:16:44 AM

both done

## Response:
7/30/2026, 11:16:52 AM

### Next step: Check the dependency changes

Run:

```powershell
git status
```

You should see changes to:

```text
package.json
package-lock.json
```

`node_modules` should **not** appear because it is excluded by `.gitignore`.

Tell me what `git status` shows before we commit the SQLite setup.

## Prompt:
7/30/2026, 11:19:14 AM

yea its fine move on

## Response:
7/30/2026, 11:19:22 AM

### Next step: Commit the SQLite dependencies

Run:

```powershell
git add package.json package-lock.json
git commit -m "build(database): add SQLite dependencies"
git push
```

This keeps the dependency installation as its own clear commit.

Tell me when the push is done, then we’ll create the database connection file.

## Prompt:
7/30/2026, 11:19:48 AM

done

## Response:
7/30/2026, 11:19:50 AM

### Next step: Ignore generated SQLite files

Before we create the connection, open the existing `.gitignore` file and add:

```gitignore
# Local SQLite database files
database/*.db
database/*.db-*
database/*.sqlite
database/*.sqlite-*
database/*.sqlite3
database/*.sqlite3-*
```

This keeps the structure file tracked:

```text
database/schema.sql
```

but prevents local data files such as these from being committed:

```text
database/todo.db
database/todo.db-wal
database/todo.db-shm
```

WAL mode can create the `-wal` and `-shm` supporting files alongside the main database, so those should also remain local. The `better-sqlite3` documentation recommends enabling WAL mode for normal usage. 

Do not commit this change yet-we’ll include it with the database connection file. Tell me when the `.gitignore` change is saved.

## Prompt:
7/30/2026, 11:23:50 AM

done

## Response:
7/30/2026, 11:24:01 AM

### Next step: Create the database connection module

Create the folder and file:

```powershell
New-Item -ItemType Directory src\lib -Force
New-Item -ItemType File src\lib\database.ts
```

Open `src/lib/database.ts` and add:

```typescript
import "server-only";

import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const databaseDirectory = path.join(process.cwd(), "database");
const databasePath = path.join(databaseDirectory, "todo.db");
const schemaPath = path.join(databaseDirectory, "schema.sql");

function createDatabase(): Database.Database {
  fs.mkdirSync(databaseDirectory, { recursive: true });

  const database = new Database(databasePath);

  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");

  const schema = fs.readFileSync(schemaPath, "utf8");
  database.exec(schema);

  return database;
}

const globalForDatabase = globalThis as typeof globalThis & {
  todoDatabase?: Database.Database;
};

export const db =
  globalForDatabase.todoDatabase ?? createDatabase();

globalForDatabase.todoDatabase = db;
```

This file will:

1. Open or create `database/todo.db`.
2. Read and execute `database/schema.sql`.
3. Enable SQLite WAL mode.
4. Reuse one database connection during Next.js development reloads.
5. Prevent this module from being imported into browser-side code through `import "server-only"`. Next.js handles that marker internally. 

No `next.config.ts` change is needed: current Next.js versions automatically treat `better-sqlite3` as a server-external package. 

Save the file, but do not run the application yet.

## Prompt:
7/30/2026, 11:26:41 AM

done

## Response:
7/30/2026, 11:26:54 AM

### Next step: Check the new database module

Run:

```powershell
npm run lint
```

This will catch issues such as invalid imports, TypeScript-related lint problems, or formatting mistakes in `src/lib/database.ts`.

Tell me whether it passes or paste the error output.

## Prompt:
7/30/2026, 11:27:37 AM

all good

## Response:
7/30/2026, 11:27:50 AM

Lint passing confirms the file is valid, but it has **not opened SQLite yet** because nothing imports `database.ts`.

### Next step: Add a database-check route

Create the folder and file:

```powershell
New-Item -ItemType Directory src\app\api\database-check -Force
New-Item -ItemType File src\app\api\database-check\route.ts
```

Add this to `route.ts`:

```typescript
import { db } from "@/lib/database";

export const runtime = "nodejs";

type TableRow = {
  name: string;
};

export async function GET() {
  const tasksTable = db
    .prepare(
      `SELECT name
       FROM sqlite_master
       WHERE type = 'table' AND name = ?`,
    )
    .get("tasks") as TableRow | undefined;

  return Response.json({
    database: "connected",
    tasksTableExists: tasksTable?.name === "tasks",
  });
}
```

This is not a task feature. It is a small verification endpoint that will open SQLite, execute `schema.sql`, and check whether the `tasks` table exists. Next.js Route Handlers are created using `route.ts` files inside `src/app` and can return JSON using `Response.json()`. 

Save the file, but do not start the app yet.

## Prompt:
7/30/2026, 11:30:29 AM

done

## Response:
7/30/2026, 11:30:36 AM

### Next step: Run the database check

Start the app:

```powershell
npm run dev
```

Then open this address in your browser:

```text
http://localhost:3000/api/database-check
```

You should see:

```json
{
  "database": "connected",
  "tasksTableExists": true
}
```

This should also create the local file:

```text
database/todo.db
```

Tell me what the browser displays.

## Prompt:
7/30/2026, 11:33:55 AM

yup got that

## Response:
7/30/2026, 11:34:03 AM

Great — SQLite is now connected, `schema.sql` ran successfully, and the `tasks` table was created.

### Next step: Check Git is ignoring the database file

Stop the dev server with:

```text
Ctrl + C
```

Then run:

```powershell
git status
```

You should see these changes:

```text
.gitignore
src/lib/database.ts
src/app/api/database-check/route.ts
```

You should **not** see:

```text
database/todo.db
database/todo.db-wal
database/todo.db-shm
```

Paste what `git status` shows.

## Prompt:
7/30/2026, 11:35:37 AM

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        modified:   .gitignore

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        src/app/api/
        src/lib/

no changes added to commit (use "git add" and/or "git commit -a")

## Response:
7/30/2026, 11:35:46 AM

Perfect. That confirms the generated SQLite database files are being ignored correctly.

### Next step: Stage the connection setup

Run:

```powershell
git add .gitignore src/lib/database.ts src/app/api/database-check/route.ts
```

Then check:

```powershell
git status
```

You should see those three files under **Changes to be committed**, with no `todo.db` file listed.

## Prompt:
7/30/2026, 11:36:50 AM

PS C:\Users\bayat\Desktop\todo-app> git status                      
On branch main                            
Your branch is ahead of 'origin/main' by 1 commit.
  (use "git push" to publish your local commits)

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   .gitignore
        new file:   src/app/api/database-check/route.ts
        new file:   src/lib/database.ts

PS C:\Users\bayat\Desktop\todo-app>

## Response:
7/30/2026, 11:37:02 AM

Perfect. The database files are ignored, and the three intended files are staged.

### Next step: Commit the SQLite connection setup

Run:

```powershell
git commit -m "feat(database): add SQLite connection and schema check"
```

Do not push yet. Tell me when the commit succeeds.

## Prompt:
7/30/2026, 11:37:21 AM

done

## Response:
7/30/2026, 11:37:30 AM

### Next step: Push the database setup commits

Run:

```powershell
git push
```

Then verify:

```powershell
git status
```

It should say:

```text
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean
```

Tell me what it shows.

## Prompt:
7/30/2026, 11:37:47 AM

alls good

## Response:
7/30/2026, 11:38:01 AM

Great - your SQLite setup is now committed and pushed.

### Next step: Create the database design documentation file

The rubric requires markdown documentation describing the tables and relationships, and it must match the shipped schema. `lab_one.pdf`

Run:

```powershell
New-Item -ItemType Directory docs -Force
New-Item -ItemType File docs\database-design.md
```

Tell me when the file is created, then we’ll write its contents.

## Prompt:
7/30/2026, 11:39:11 AM

yea done

## Response:
7/30/2026, 11:39:18 AM

Open `docs/database-design.md` and paste this:

```markdown
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
```

This format can be sorted correctly in chronological order.

## Relationships

There are currently no relationships because the database contains only the `tasks` table.
```

This directly documents the schema decisions the rubric checks: SQLite persistence, archive represented by a timestamp, overdue derived from due date and status, and documentation matching the shipped schema. `lab_one.pdf`

Save the file and tell me when it is done.

## Prompt:
7/30/2026, 11:41:16 AM

done done

## Response:
7/30/2026, 11:41:26 AM

### Next step: Commit the database documentation

Run:

```powershell
git add docs/database-design.md
git commit -m "docs(database): document tasks schema and design decisions"
```

This keeps the documentation as its own coherent commit, which supports the brief’s commit-history and database-documentation requirements. `lab_one.pdf`

Tell me once the commit succeeds.

## Prompt:
7/30/2026, 11:41:48 AM

yea lets stop here? its fine? like we done with the setup?

## Response:
7/30/2026, 11:41:59 AM

Yes - this is a good stopping point. The **initial project and SQLite setup are complete**:

- Next.js TypeScript project runs and builds
- Git and GitHub are configured
- SQLite dependencies are installed
- `tasks` schema is defined
- Local database connection works
- Generated database files are ignored
- Database design is documented

This is only the foundation. The brief still requires the task features, sorting, archiving, overdue indication, at least three behavioural tests, and the remaining documentation sections. `lab_one.pdf`

Before stopping, push the latest documentation commit:

```powershell
git push
```

Then confirm everything is saved:

```powershell
git status
```

It should say the branch is up to date and the working tree is clean.

## Prompt:
7/31/2026, 8:26:47 AM

do i start developing next?

## Response:
7/31/2026, 8:26:57 AM

Yes. The setup phase is complete; next is **feature development**.

The best order is to follow the functional walkthrough so every stage leaves the app working:

1. Create and display a task
2. Edit a task
3. Archive and view archived tasks
4. Sort tasks
5. Flag overdue tasks
6. Add behavioural tests
7. Finish the remaining documentation

That matches the feature list and marking sequence in the brief. `lab_one.pdf`

Our next single step should be to define the TypeScript `Task` model that matches the SQLite schema. After that, we will write the database function for creating a task-before building the form.

## Prompt:
7/31/2026, 8:28:49 AM

give a prompt saying what i did and giving all the needed info to start the feature dev in a new chat ..wahtver you think the new chat would need give it

## Response:
7/31/2026, 8:29:00 AM

Copy and paste this into the new chat:

```text
I am continuing development of a COMS3011A Lab 1 todo application. Please treat the information below as the current project state and continue from it rather than scaffolding a new project.

## How I want to work

Work with me one step at a time.

- Do not give me the entire implementation at once.
- Explain what each step does and why before I run or add it.
- Wait for me to confirm that each step worked before continuing.
- Ask me about genuine design choices before deciding for me.
- Keep dependencies minimal.
- Use Conventional Commit messages.
- Do not implement unrelated features early.
- Do not create separate frontend and backend projects.
- This is one Next.js application using server-side Next.js code for SQLite access.
- Avoid adding an ORM unless there is a strong reason.
- Keep the project in a working state after each commit.

## Brief

Build a local-first todo application using Next.js and SQLite.

The application:

- runs locally through Node.js and npm;
- will not be deployed to the web;
- has no user accounts;
- serves one user on the machine where it runs.

Required task functionality:

- create tasks;
- edit tasks;
- archive tasks;
- archived tasks must not be deleted and must remain viewable;
- every task carries:
  - title;
  - description;
  - due date;
  - topic;
- display tasks as a list;
- sort the list by:
  - topic;
  - status;
  - due date;
- statuses are fixed:
  - Todo;
  - In-Progress;
  - Complete;
- overdue tasks must be visibly indicated;
- overdue must not be a status;
- all information must persist after restarting the application.

The required functional walkthrough is:

1. Install and start the application using only the README.
2. Create a task with all four fields and show it in the list.
3. Edit a task and ensure the change survives a page reload.
4. Archive a task so it leaves the active list but remains viewable.
5. Sort tasks by topic, status and due date.
6. Visibly flag overdue tasks without making overdue a selectable status.
7. Stop and restart the application and confirm the data persists.

Testing requirements:

- at least three tests;
- one documented command must run all tests;
- tests must exercise real behaviour;
- at least one test must cover archiving or the overdue rule;
- tests must be deterministic;
- tests must use a throwaway database rather than my development database.

Documentation requirements:

- Third-Party Code:
  - list every installed library/package;
  - give one line explaining why each was chosen.
- Database Design:
  - describe the tables and relationships;
  - ensure it matches the shipped schema.
- Running It:
  - state the Node version;
  - include exact commands to install, run and test from a clean clone.

The database rubric specifically expects:

- SQLite, not JSON or in-memory persistence;
- a visible schema file or migrations;
- archived tasks represented by a flag or timestamp on the task;
- archived tasks must not be deleted or copied to another table;
- overdue must be derived from due date and status;
- overdue must not be stored as a column;
- the shipped schema must match the database documentation.

## Current project setup

Project folder:

todo-app

Repository:

https://github.com/Muhammed-Bayat/todo-app.git

Git:

- branch: main;
- remote: origin;
- commits are already pushed;
- use Conventional Commits for future work.

Technology:

- Next.js;
- TypeScript;
- App Router;
- src directory;
- npm;
- ESLint;
- normal CSS;
- no Tailwind;
- no separate API server;
- SQLite through better-sqlite3.

The initial project was created directly in the repository root with approximately these options:

npx create-next-app@latest . --typescript --eslint --app --src-dir --no-tailwind --no-react-compiler --use-npm --import-alias "@/*" --disable-git

The following have already passed:

npm run dev
npm run lint
npm run build

## Installed SQLite dependencies

Runtime dependency:

better-sqlite3

Development dependency:

@types/better-sqlite3

No ORM has been installed.

## Current database design

There is one table:

tasks

There are no additional tables and currently no relationships.

The design decisions are:

- topic is stored directly as text on each task;
- description is optional for the user;
- description is stored as an empty string rather than NULL when omitted;
- every new task starts with status Todo;
- statuses are limited to Todo, In-Progress and Complete;
- archived_at is NULL for active tasks;
- archived_at contains a timestamp for archived tasks;
- tasks are never deleted when archived;
- overdue is not stored;
- overdue is derived when reading/displaying tasks;
- a task is overdue when:
  - its due date is before today; and
  - its status is not Complete;
- a task due today is not overdue;
- due dates are stored as YYYY-MM-DD;
- created_at, updated_at and archived_at are timestamps.

## Existing schema

File:

database/schema.sql

Contents:

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,

    title TEXT NOT NULL
        CHECK (length(trim(title)) > 0),

    description TEXT NOT NULL DEFAULT '',

    due_date TEXT NOT NULL
        CHECK (
            length(due_date) = 10
            AND due_date GLOB
                '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'
        ),

    topic TEXT NOT NULL
        CHECK (length(trim(topic)) > 0),

    status TEXT NOT NULL DEFAULT 'Todo'
        CHECK (
            status IN ('Todo', 'In-Progress', 'Complete')
        ),

    archived_at TEXT DEFAULT NULL,

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

## Existing database connection

File:

src/lib/database.ts

It currently:

- imports server-only;
- opens database/todo.db using better-sqlite3;
- creates the database directory when needed;
- enables WAL mode;
- enables foreign keys;
- reads and executes database/schema.sql;
- reuses one connection through globalThis during development reloads.

## Existing database check

File:

src/app/api/database-check/route.ts

It:

- runs in the Node.js runtime;
- imports the database connection;
- checks sqlite_master for the tasks table;
- returns JSON showing that the database is connected and the tasks table exists.

Opening:

http://localhost:3000/api/database-check

successfully returned:

{
  "database": "connected",
  "tasksTableExists": true
}

The database/todo.db file was created successfully.

## Git ignore state

Generated SQLite files are ignored, including:

database/*.db
database/*.db-*
database/*.sqlite
database/*.sqlite-*
database/*.sqlite3
database/*.sqlite3-*

The schema file remains tracked.

## Existing documentation

File:

docs/database-design.md

It documents:

- the single tasks table;
- every column and constraint;
- the fixed status design;
- archive using archived_at;
- overdue being derived;
- YYYY-MM-DD date storage;
- the fact that there are currently no relationships.

## Existing commits

Commits already made include work equivalent to:

- chore: scaffold initial Next.js TypeScript project
- feat(database): add initial tasks schema
- build(database): add SQLite dependencies
- feat(database): add SQLite connection and schema check
- docs(database): document tasks schema and design decisions

## Current stopping point

The setup and SQLite foundation are complete.

No real task features have been implemented yet.

The next development goal is the first functional slice:

- define the TypeScript task types;
- create the database operations needed to create and read tasks;
- then build the smallest interface that can create a task and display it.

Do not begin with editing, archiving, sorting or overdue UI yet.

Start by helping me define the TypeScript Task model so that it accurately matches the SQLite schema. Explain the choices first, and then wait for my confirmation before giving me the file contents.
```

This prompt preserves the brief’s feature list, functional walkthrough, testing expectations, documentation requirements and database-design rubric. `lab_one.pdf`



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)