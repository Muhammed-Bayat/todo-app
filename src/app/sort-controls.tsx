"use client";

import {
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  TASK_SORT_OPTIONS,
  type TaskSortDirection,
  type TaskSortOption,
} from "@/types/task";

import styles from "./page.module.css";

const SORT_LABELS: Record<TaskSortOption, string> = {
  dueDate: "Due date",
  topic: "Topic",
  status: "Status",
};

interface SortControlsProps {
  sort: TaskSortOption;
  direction: TaskSortDirection;
}

export function SortControls({
  sort,
  direction,
}: SortControlsProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [selectedSort, setSelectedSort] = useState(sort);
  const [selectedDirection, setSelectedDirection] =
    useState(direction);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedSort(sort);
    setSelectedDirection(direction);
  }, [sort, direction]);

  function navigate(
    nextSort: TaskSortOption,
    nextDirection: TaskSortDirection,
  ) {
    setSelectedSort(nextSort);
    setSelectedDirection(nextDirection);

    const params = new URLSearchParams({
      sort: nextSort,
      direction: nextDirection,
    });

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  }

  function handleSortChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    navigate(
      event.target.value as TaskSortOption,
      selectedDirection,
    );
  }

  function toggleDirection() {
    const nextDirection =
      selectedDirection === "asc" ? "desc" : "asc";

    navigate(selectedSort, nextDirection);
  }

  const nextDirectionLabel =
    selectedDirection === "asc"
      ? "descending"
      : "ascending";

  return (
    <div
      className={styles.sortControls}
      aria-busy={isPending}
    >
      <label htmlFor="sort">Sort by</label>

      <select
        id="sort"
        className={styles.sortSelect}
        value={selectedSort}
        onChange={handleSortChange}
        disabled={isPending}
      >
        {TASK_SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {SORT_LABELS[option]}
          </option>
        ))}
      </select>

      <button
        className={styles.directionButton}
        type="button"
        onClick={toggleDirection}
        disabled={isPending}
        aria-label={`Change to ${nextDirectionLabel} order`}
      >
        {selectedDirection === "asc" ? "Asc ↑" : "Desc ↓"}
      </button>
    </div>
  );
}