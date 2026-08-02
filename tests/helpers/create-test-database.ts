import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export interface TestDatabase {
  database: Database.Database;
  cleanup: () => void;
}

export function createTestDatabase(): TestDatabase {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "todo-app-test-"),
  );

  const databasePath = path.join(directory, "test.db");
  const schemaPath = path.join(
    process.cwd(),
    "database",
    "schema.sql",
  );

  const database = new Database(databasePath);

  database.pragma("foreign_keys = ON");

  const schema = fs.readFileSync(schemaPath, "utf8");
  database.exec(schema);

  return {
    database,

    cleanup() {
      database.close();
      fs.rmSync(directory, {
        recursive: true,
        force: true,
      });
    },
  };
}