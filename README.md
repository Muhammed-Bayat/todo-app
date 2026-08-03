# Taskly

A local-first task manager built with Next.js, TypeScript and SQLite. Create, organise, update and archive tasks from a clean single-page interface.

## Requirements

- Node.js `24.14.1`
- npm `11.11.0`
- Git

Install the requirements for your operating system.

### Windows PowerShell

```powershell
winget install --id Volta.Volta --exact
winget install --id Git.Git --exact --source winget
```

Close and reopen PowerShell, then install the required Node.js version. npm is included with Node.js.

```powershell
volta install node@24.14.1
```

### macOS

```bash
xcode-select --install
curl https://get.volta.sh | bash
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
volta install node@24.14.1
```

Apple Command Line Tools supplies Git. npm is included with Node.js.

### Debian or Ubuntu Linux

```bash
sudo apt update
sudo apt install -y curl git
curl https://get.volta.sh | bash
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
volta install node@24.14.1
```

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
