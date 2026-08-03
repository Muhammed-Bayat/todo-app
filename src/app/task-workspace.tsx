"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import {
  archiveTaskAction,
  createTaskAction,
  updateTaskAction,
} from "@/app/actions";
import { isTaskOverdue } from "@/lib/task-rules";
import {
  TASK_STATUSES,
  type Task,
  type TaskStatus,
} from "@/types/task";

import styles from "./page.module.css";

type View = "active" | "archived";
type StatusFilter = "All" | TaskStatus;
type SortField = "dueDate" | "topic";
type SortDirection = "asc" | "desc";
interface SortSetting {
  field: SortField;
  direction: SortDirection;
}
type Drawer = { type: "create" } | { type: "edit"; task: Task } | null;

const FILTERS: StatusFilter[] = ["All", ...TASK_STATUSES];

function PlusIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 7h16M5 7l1 13h12l1-13M9 11h6M3 4h18v3H3z" />
    </svg>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button className={styles.primaryButton} disabled={pending} type="submit">
      {pending ? "Saving…" : children}
    </button>
  );
}

function TaskForm({ task, onCancel }: { task?: Task; onCancel: () => void }) {
  const action = task
    ? updateTaskAction.bind(null, task.id)
    : createTaskAction;

  async function saveTask(formData: FormData) {
    await action(formData);
    onCancel();
  }

  return (
    <form action={saveTask} className={styles.taskForm}>
      <div className={styles.field}>
        <label htmlFor="title">Task title</label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="What needs to be done?"
          defaultValue={task?.title}
          maxLength={200}
          autoFocus
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Add a few helpful details…"
          defaultValue={task?.description}
          rows={5}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.field}>
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={task?.dueDate}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="topic">Topic</label>
          <input
            id="topic"
            name="topic"
            type="text"
            placeholder="e.g. Personal"
            defaultValue={task?.topic}
            maxLength={100}
            required
          />
        </div>
      </div>

      {task && (
        <div className={styles.field}>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={task.status}>
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.formActions}>
        <SubmitButton>{task ? "Save changes" : "Create task"}</SubmitButton>
        <button className={styles.secondaryButton} onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </form>
  );
}

function InlineStatus({ task }: { task: Task }) {
  const updateWithId = updateTaskAction.bind(null, task.id);
  const router = useRouter();
  const [status, setStatus] = useState(task.status);

  async function saveStatus(formData: FormData) {
    try {
      await updateWithId(formData);
      router.refresh();
    } catch (error) {
      setStatus(task.status);
      throw error;
    }
  }

  return (
    <form action={saveStatus} className={styles.statusForm}>
      <input name="title" type="hidden" value={task.title} />
      <input name="description" type="hidden" value={task.description} />
      <input name="dueDate" type="hidden" value={task.dueDate} />
      <input name="topic" type="hidden" value={task.topic} />
      <select
        aria-label={`Change status for ${task.title}`}
        className={`${styles.statusSelect} ${styles[`status${status.replace("-", "")}`]}`}
        name="status"
        value={status}
        onChange={(event) => {
          setStatus(event.currentTarget.value as TaskStatus);
          event.currentTarget.form?.requestSubmit();
        }}
      >
        {TASK_STATUSES.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    </form>
  );
}

function TaskCard({
  task,
  position,
  archived,
  today,
  onEdit,
}: {
  task: Task;
  position: number;
  archived: boolean;
  today: string;
  onEdit: (task: Task) => void;
}) {
  const overdue = !archived && isTaskOverdue(task, today);
  const gridPosition = {
    "--task-column": (position % 2) + 1,
    "--task-row": Math.floor(position / 2) + 1,
  } as React.CSSProperties;

  return (
    <li
      className={`${styles.taskCard} ${overdue ? styles.overdue : ""}`}
      style={gridPosition}
    >
      <div className={styles.cardTop}>
        <div className={styles.taskIdentity}>
          <span className={styles.topic}>{task.topic}</span>
          {overdue && <span className={styles.overdueLabel}>Overdue</span>}
        </div>
        {archived ? (
          <span className={`${styles.statusPill} ${styles[`status${task.status.replace("-", "")}`]}`}>
            {task.status}
          </span>
        ) : (
          <InlineStatus key={`${task.id}-${task.status}`} task={task} />
        )}
      </div>

      <div className={styles.cardBody}>
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
      </div>

      <div className={styles.cardFooter}>
        <span className={overdue ? styles.overdueDate : ""}>
          <span aria-hidden="true">◷</span> Due {task.dueDate}
        </span>
        {archived ? (
          <span>Archived {task.archivedAt}</span>
        ) : (
          <div className={styles.cardActions}>
            <button onClick={() => onEdit(task)} type="button">Edit</button>
            <form action={archiveTaskAction}>
              <input name="taskId" type="hidden" value={task.id} />
              <button className={styles.archiveAction} type="submit">Archive</button>
            </form>
          </div>
        )}
      </div>
    </li>
  );
}

export function TaskWorkspace({
  activeTasks,
  archivedTasks,
  today,
}: {
  activeTasks: Task[];
  archivedTasks: Task[];
  today: string;
}) {
  const [view, setView] = useState<View>("active");
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [sortSettings, setSortSettings] = useState<
    Record<
      View,
      Partial<Record<StatusFilter, SortSetting>>
    >
  >({
    active: {},
    archived: {},
  });

  const sourceTasks = view === "active" ? activeTasks : archivedTasks;
  const sortSetting = sortSettings[view][filter];
  const visibleTasks = useMemo(() => {
    const filteredTasks = filter === "All"
      ? sourceTasks
      : sourceTasks.filter((task) => task.status === filter);

    return [...filteredTasks].sort((firstTask, secondTask) => {
      if (sortSetting?.field === "dueDate") {
        const dueDateOrder = firstTask.dueDate.localeCompare(
          secondTask.dueDate,
        );

        if (dueDateOrder !== 0) {
          return sortSetting.direction === "asc"
            ? dueDateOrder
            : -dueDateOrder;
        }
      }

      if (sortSetting?.field === "topic") {
        const firstTopic = firstTask.topic.toLowerCase();
        const secondTopic = secondTask.topic.toLowerCase();
        const topicOrder = firstTopic < secondTopic
          ? -1
          : firstTopic > secondTopic
            ? 1
            : 0;

        if (topicOrder !== 0) {
          return sortSetting.direction === "asc"
            ? topicOrder
            : -topicOrder;
        }
      }

      if (view === "archived") {
        const archiveOrder = (secondTask.archivedAt ?? "").localeCompare(
          firstTask.archivedAt ?? "",
        );

        if (archiveOrder !== 0) {
          return archiveOrder;
        }
      } else {
        const createdOrder = secondTask.createdAt.localeCompare(
          firstTask.createdAt,
        );

        if (createdOrder !== 0) {
          return createdOrder;
        }
      }

      return secondTask.id - firstTask.id;
    });
  }, [filter, sortSetting, sourceTasks, view]);

  function switchView(nextView: View) {
    setView(nextView);
    setFilter("All");
    setDrawer(null);
  }

  function toggleSort(field: SortField) {
    setSortSettings((currentSettings) => {
      const currentSetting = currentSettings[view][filter];
      const direction = currentSetting?.field === field &&
        currentSetting.direction === "asc"
        ? "desc"
        : "asc";

      return {
        ...currentSettings,
        [view]: {
          ...currentSettings[view],
          [filter]: {
            field,
            direction,
          },
        },
      };
    });
  }

  function getSortLabel(field: SortField) {
    if (sortSetting?.field !== field) {
      return "Sort ↕";
    }

    return sortSetting.direction === "asc"
      ? "Asc ↑"
      : "Desc ↓";
  }

  function getNextSortDirection(field: SortField) {
    return sortSetting?.field === field &&
      sortSetting.direction === "asc"
      ? "descending"
      : "ascending";
  }

  return (
    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <button className={styles.brand} onClick={() => switchView("active")} type="button">
          <span className={styles.brandMark}>T</span>
          <span>Taskly</span>
        </button>
        <div className={styles.headerActions}>
          <button
            className={`${styles.archiveToggle} ${view === "archived" ? styles.archiveToggleActive : ""}`}
            onClick={() => switchView(view === "active" ? "archived" : "active")}
            type="button"
          >
            <ArchiveIcon />
            {view === "active" ? "View archived" : "Back to tasks"}
            {view === "active" && <span>{archivedTasks.length}</span>}
          </button>
          {view === "active" && (
            <button className={styles.newTaskButton} onClick={() => setDrawer({ type: "create" })} type="button">
              <PlusIcon /> New task
            </button>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>{view === "active" ? "Your workspace" : "Task history"}</p>
          <h1>{view === "active" ? "Make today count." : "Archived tasks."}</h1>
          <p>{view === "active" ? "Keep your priorities clear and move work forward." : "Everything you have tucked away, all in one place."}</p>
        </section>

        <section aria-labelledby="task-list-heading">
          <div className={styles.listHeader}>
            <div>
              <h2 id="task-list-heading">{view === "active" ? "Tasks" : "Archive"}</h2>
              <p>{sourceTasks.length} {sourceTasks.length === 1 ? "task" : "tasks"}</p>
            </div>
            <div className={styles.listTools}>
              <div className={styles.filters} aria-label="Filter tasks by status">
                {FILTERS.map((item) => {
                  const count = item === "All"
                    ? sourceTasks.length
                    : sourceTasks.filter((task) => task.status === item).length;
                  return (
                    <button
                      className={filter === item ? styles.filterActive : ""}
                      key={item}
                      onClick={() => setFilter(item)}
                      type="button"
                    >
                      {item === "In-Progress" ? "In progress" : item}
                      <span>{count}</span>
                    </button>
                  );
                })}
              </div>

              <div className={styles.sortButtons} aria-label="Sort tasks">
                <button
                  aria-label={`Sort due dates ${getNextSortDirection("dueDate")}`}
                  className={`${styles.sortButton} ${
                    sortSetting?.field === "dueDate" ? styles.sortActive : ""
                  }`}
                  onClick={() => toggleSort("dueDate")}
                  type="button"
                >
                  <span>Due date</span>
                  <strong>{getSortLabel("dueDate")}</strong>
                </button>

                <button
                  aria-label={`Sort topics ${getNextSortDirection("topic")}`}
                  className={`${styles.sortButton} ${
                    sortSetting?.field === "topic" ? styles.sortActive : ""
                  }`}
                  onClick={() => toggleSort("topic")}
                  type="button"
                >
                  <span>Topic</span>
                  <strong>{getSortLabel("topic")}</strong>
                </button>
              </div>
            </div>
          </div>

          {visibleTasks.length ? (
            <ul className={styles.taskList}>
              {visibleTasks.map((task, position) => (
                <TaskCard
                  archived={view === "archived"}
                  key={task.id}
                  onEdit={(selectedTask) => setDrawer({ type: "edit", task: selectedTask })}
                  position={position}
                  task={task}
                  today={today}
                />
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              <span>✓</span>
              <h3>{filter === "All" ? "Nothing here yet" : `No ${filter.toLowerCase()} tasks`}</h3>
              <p>{view === "active" ? "Create a task and start making progress." : "Archived tasks will appear here."}</p>
            </div>
          )}
        </section>
      </main>

      {drawer && (
        <div className={styles.drawerLayer}>
          <button className={styles.scrim} aria-label="Close task panel" onClick={() => setDrawer(null)} type="button" />
          <aside aria-labelledby="drawer-title" aria-modal="true" className={styles.drawer} role="dialog">
            <div className={styles.drawerHeader}>
              <div>
                <p>{drawer.type === "create" ? "A fresh start" : "Task details"}</p>
                <h2 id="drawer-title">{drawer.type === "create" ? "Create a new task" : "Edit task"}</h2>
              </div>
              <button aria-label="Close task panel" className={styles.closeButton} onClick={() => setDrawer(null)} type="button">×</button>
            </div>
            <TaskForm task={drawer.type === "edit" ? drawer.task : undefined} onCancel={() => setDrawer(null)} />
          </aside>
        </div>
      )}
    </div>
  );
}
