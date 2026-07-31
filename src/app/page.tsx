import styles from "./page.module.css";
import Link from "next/link";

import { createTaskAction } from "@/app/actions";
import { getActiveTasks } from "@/lib/tasks";

export const dynamic = "force-dynamic";

export default function Home() {
  const tasks = getActiveTasks();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Todo</h1>
          <p>Create tasks and keep track of what needs to be done.</p>
        </header>

        <section className={styles.panel} aria-labelledby="create-task-heading">
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

        <section className={styles.panel} aria-labelledby="active-tasks-heading">
          <div className={styles.sectionHeading}>
            <h2 id="active-tasks-heading">Active tasks</h2>
            <span>
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {tasks.length === 0 ? (
            <p className={styles.emptyState}>
              No active tasks yet. Create your first task above.
            </p>
          ) : (
            <ul className={styles.taskList}>
              {tasks.map((task) => (
                <li className={styles.task} key={task.id}>
                  <div className={styles.taskHeading}>
                    <h3>{task.title}</h3>

                    <div className={styles.taskActions}>
                      <span className={styles.status}>{task.status}</span>

                      <Link
                        className={styles.editLink}
                        href={`/tasks/${task.id}/edit`}
                      >
                        Edit
                      </Link>
                    </div>
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
                  </dl>

                  {task.description.length > 0 && (
                    <p className={styles.description}>{task.description}</p>
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