import Link from "next/link";

import { getArchivedTasks } from "@/lib/tasks";

import styles from "../page.module.css";

export const dynamic = "force-dynamic";

export default function ArchivedTasksPage() {
  const tasks = getArchivedTasks();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1>Archived tasks</h1>
              <p>
                These tasks remain stored but are no longer active.
              </p>
            </div>

            <Link className={styles.navLink} href="/">
              Active tasks
            </Link>
          </div>
        </header>

        <section
          className={styles.panel}
          aria-labelledby="archived-tasks-heading"
        >
          <div className={styles.sectionHeading}>
            <h2 id="archived-tasks-heading">Archive</h2>
            <span>
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {tasks.length === 0 ? (
            <p className={styles.emptyState}>
              No tasks have been archived.
            </p>
          ) : (
            <ul className={styles.taskList}>
              {tasks.map((task) => (
                <li className={styles.task} key={task.id}>
                  <div className={styles.taskHeading}>
                    <h3>{task.title}</h3>

                    <span className={styles.status}>
                      {task.status}
                    </span>
                  </div>

                  <dl className={styles.taskDetails}>
                    <div>
                      <dt>Topic</dt>
                      <dd>{task.topic}</dd>
                    </div>

                    <div>
                      <dt>Due date</dt>
                      <dd>{task.dueDate}</dd>
                    </div>

                    <div>
                      <dt>Archived at</dt>
                      <dd>{task.archivedAt ?? "Unknown"}</dd>
                    </div>
                  </dl>

                  {task.description.length > 0 && (
                    <p className={styles.description}>
                      {task.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}