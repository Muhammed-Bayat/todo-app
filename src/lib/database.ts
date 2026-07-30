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