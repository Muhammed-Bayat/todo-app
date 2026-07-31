import Link from "next/link";
import { notFound } from "next/navigation";

import { updateTaskAction } from "@/app/actions";
import { getActiveTaskById } from "@/lib/tasks";
import { TASK_STATUSES } from "@/types/task";

import styles from "./edit.module.css";

export const dynamic = "force-dynamic";

interface EditTaskPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTaskPage({
  params,
}: EditTaskPageProps) {
  const { id } = await params;
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    notFound();
  }

  const task = getActiveTaskById(taskId);

  if (!task) {
    notFound();
  }

  const updateTaskWithId = updateTaskAction.bind(
    null,
    task.id,
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <Link className={styles.backLink} href="/">
            ← Back to tasks
          </Link>

          <h1>Edit task</h1>
          <p>Update the task details or change its status.</p>
        </header>

        <section
          className={styles.panel}
          aria-labelledby="edit-task-heading"
        >
          <h2 id="edit-task-heading">{task.title}</h2>

          <form action={updateTaskWithId} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={task.title}
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
                defaultValue={task.description}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="dueDate">Due date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                defaultValue={task.dueDate}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="topic">Topic</label>
              <input
                id="topic"
                name="topic"
                type="text"
                defaultValue={task.topic}
                required
                maxLength={100}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                defaultValue={task.status}
                required
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formActions}>
              <button className={styles.button} type="submit">
                Save changes
              </button>

              <Link className={styles.cancelLink} href="/">
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}