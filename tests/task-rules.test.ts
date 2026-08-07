import { describe, expect, it } from "vitest";

import {
  compareTaskStatuses,
  isTaskOverdue,
} from "@/lib/task-rules";
import type { TaskStatus } from "@/types/task";

interface OverdueTestCase {
  name: string;
  dueDate: string;
  status: TaskStatus;
  expected: boolean;
}

const today = "2026-07-31";

const cases: OverdueTestCase[] = [
  {
    name: "a past Todo task is overdue",
    dueDate: "2026-07-30",
    status: "Todo",
    expected: true,
  },
  {
    name: "a past In-Progress task is overdue",
    dueDate: "2026-07-30",
    status: "In-Progress",
    expected: true,
  },
  {
    name: "a past Complete task is not overdue",
    dueDate: "2026-07-30",
    status: "Complete",
    expected: false,
  },
  {
    name: "a task due today is not overdue",
    dueDate: "2026-07-31",
    status: "Todo",
    expected: false,
  },
  {
    name: "a future task is not overdue",
    dueDate: "2026-08-01",
    status: "Todo",
    expected: false,
  },
];

describe("isTaskOverdue", () => {
  it.each(cases)(
    "$name",
    ({ dueDate, status, expected }) => {
      expect(
        isTaskOverdue(
          {
            dueDate,
            status,
          },
          today,
        ),
      ).toBe(expected);
    },
  );
});

describe("compareTaskStatuses", () => {
  it("sorts the fixed statuses in workflow order", () => {
    const statuses: TaskStatus[] = [
      "Complete",
      "Todo",
      "In-Progress",
    ];

    expect(statuses.toSorted(compareTaskStatuses)).toEqual([
      "Todo",
      "In-Progress",
      "Complete",
    ]);
  });

  it("supports reverse status ordering", () => {
    const statuses: TaskStatus[] = [
      "Todo",
      "Complete",
      "In-Progress",
    ];

    expect(
      statuses.toSorted((firstStatus, secondStatus) =>
        compareTaskStatuses(secondStatus, firstStatus),
      ),
    ).toEqual([
      "Complete",
      "In-Progress",
      "Todo",
    ]);
  });
});
