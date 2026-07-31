import Link from "next/link";

import styles from "./page.module.css";

import {
  archiveTaskAction,
  createTaskAction,
} from "@/app/actions";
import {
  getLocalDateString,
  isTaskOverdue,
} from "@/lib/task-rules";
import { getActiveTasks } from "@/lib/tasks";
import { SortControls } from "@/app/sort-controls";
import {
  TASK_SORT_DIRECTIONS,
  TASK_SORT_OPTIONS,
  type TaskSortDirection,
  type TaskSortOption,
} from "@/types/task";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: Promise<{
    sort?: string | string[];
    direction?: string | string[];
  }>;
}

function getSortOption(
  value: string | string[] | undefined,
): TaskSortOption {
  if (
    typeof value === "string" &&
    TASK_SORT_OPTIONS.includes(value as TaskSortOption)
  ) {
    return value as TaskSortOption;
  }

  return "dueDate";
}

function getSortDirection(
  value: string | string[] | undefined,
): TaskSortDirection {
  if (
    typeof value === "string" &&
    TASK_SORT_DIRECTIONS.includes(
      value as TaskSortDirection,
    )
  ) {
    return value as TaskSortDirection;
  }

  return "asc";
}

export default async function Home({
  searchParams,
}: HomePageProps) {
  const {
    sort: requestedSort,
    direction: requestedDirection,
  } = await searchParams;

  const sort = getSortOption(requestedSort);
  const direction = getSortDirection(requestedDirection);
  const tasks = getActiveTasks(sort, direction);
  const today = getLocalDateString();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1>Todo</h1>
              <p>
                Create tasks and keep track of what needs to be
                done.
              </p>
            </div>

            <Link className={styles.navLink} href="/archived">
              Archived tasks
            </Link>
          </div>
        </header>

        <section
          className={styles.panel}
          aria-labelledby="create-task-heading"
        >
          <h2 id="create-task-heading">Create a task</h2>

          <form action={createTaskAction} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={200}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="topic">Topic</label>
              <input
                id="topic"
                name="topic"
                type="text"
                required
                maxLength={100}
              />
            </div>

            <button className={styles.button} type="submit">
              Create task
            </button>
          </form>
        </section>

        <section
          className={styles.panel}
          aria-labelledby="active-tasks-heading"
        >
          <div className={styles.sectionHeading}>
            <div className={styles.headingGroup}>
              <h2 id="active-tasks-heading">Active tasks</h2>
              <span>
                {tasks.length}{" "}
                {tasks.length === 1 ? "task" : "tasks"}
              </span>
            </div>

            <SortControls
              sort={sort}
              direction={direction}
            />
          </div>

          {tasks.length === 0 ? (
            <p className={styles.emptyState}>
              No active tasks yet. Create your first task above.
            </p>
          ) : (
            <ul className={styles.taskList}>
              {tasks.map((task) => {
                const overdue = isTaskOverdue(task, today);

                return (
                  <li
                    className={`${styles.task} ${
                      overdue ? styles.overdueTask : ""
                    }`}
                    key={task.id}
                  >
                    <div className={styles.taskHeading}>
                      <h3>{task.title}</h3>

                      <div className={styles.taskActions}>
                        <span className={styles.status}>
                          {task.status}
                        </span>

                        {overdue && (
                          <span className={styles.overdueBadge}>
                            Overdue
                          </span>
                        )}

                        <Link
                          className={styles.editLink}
                          href={`/tasks/${task.id}/edit`}
                        >
                          Edit
                        </Link>

                        <form
                          action={archiveTaskAction}
                          className={styles.archiveForm}
                        >
                          <input
                            name="taskId"
                            type="hidden"
                            value={task.id}
                          />

                          <button
                            className={styles.archiveButton}
                            type="submit"
                          >
                            Archive
                          </button>
                        </form>
                      </div>
                    </div>

                    <dl className={styles.taskDetails}>
                      <div>
                        <dt>Topic</dt>
                        <dd>{task.topic}</dd>
                      </div>

                      <div>
                        <dt>Due date</dt>
                        <dd
                          className={
                            overdue
                              ? styles.overdueDate
                              : undefined
                          }
                        >
                          {task.dueDate}
                        </dd>
                      </div>
                    </dl>

                    {task.description.length > 0 && (
                      <p className={styles.description}>
                        {task.description}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}