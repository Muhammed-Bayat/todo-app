import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  createTaskRepository,
  type TaskRepository,
} from "@/lib/task-repository";
import {
  createTestDatabase,
  type TestDatabase,
} from "./helpers/create-test-database";

describe("task repository", () => {
  let testDatabase: TestDatabase;
  let repository: TaskRepository;

  beforeEach(() => {
    testDatabase = createTestDatabase();
    repository = createTaskRepository(testDatabase.database);
  });

  afterEach(() => {
    testDatabase.cleanup();
  });

  it("creates and stores a task with Todo status", () => {
    const createdTask = repository.createTask({
      title: "Prepare lab demonstration",
      description: "Test the complete walkthrough",
      dueDate: "2026-08-04",
      topic: "COMS3011A",
    });

    expect(createdTask).toMatchObject({
      title: "Prepare lab demonstration",
      description: "Test the complete walkthrough",
      dueDate: "2026-08-04",
      topic: "COMS3011A",
      status: "Todo",
      archivedAt: null,
    });

    expect(
      repository.getActiveTaskById(createdTask.id),
    ).toEqual(createdTask);
  });

  it("updates and persists task fields and status", () => {
    const createdTask = repository.createTask({
      title: "Write tests",
      description: "Add repository tests",
      dueDate: "2026-08-01",
      topic: "Testing",
    });

    const updatedTask = repository.updateTask({
      id: createdTask.id,
      title: "Finish automated tests",
      description: "Cover update and archive behaviour",
      dueDate: "2026-08-02",
      topic: "Quality Assurance",
      status: "In-Progress",
    });

    expect(updatedTask).toMatchObject({
      id: createdTask.id,
      title: "Finish automated tests",
      description: "Cover update and archive behaviour",
      dueDate: "2026-08-02",
      topic: "Quality Assurance",
      status: "In-Progress",
      archivedAt: null,
    });

    expect(
      repository.getActiveTaskById(createdTask.id),
    ).toEqual(updatedTask);
  });

  it("archives a task without deleting it", () => {
    const createdTask = repository.createTask({
      title: "Archive this task",
      description: "The row must remain in the tasks table",
      dueDate: "2026-07-30",
      topic: "Archiving",
    });

    const archivedTask = repository.archiveTask(createdTask.id);

    expect(archivedTask.id).toBe(createdTask.id);
    expect(archivedTask.archivedAt).not.toBeNull();

    expect(repository.getActiveTasks()).toEqual([]);
    expect(repository.getActiveTaskById(createdTask.id)).toBeNull();

    const archivedTasks = repository.getArchivedTasks();

    expect(archivedTasks).toHaveLength(1);
    expect(archivedTasks[0]).toEqual(archivedTask);

    const countRow = testDatabase.database
      .prepare("SELECT COUNT(*) AS count FROM tasks")
      .get() as { count: number };

    expect(countRow.count).toBe(1);
  });
});