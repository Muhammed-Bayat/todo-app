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