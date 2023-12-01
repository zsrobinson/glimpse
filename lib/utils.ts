import { Task } from "@doist/todoist-api-typescript";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDayName(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export type DateTasks = { date: Date; tasks: Task[] };

/**
 * Returns the tasks sorted into the next upcoming days.
 *
 * @param tasks The tasks to filter.
 * @param days The number of days to sort the tasks into. For instance, if this
 * is 5, then the tasks will be sorted into the next 5 days.
 */
export function filterTasks(tasks: Task[], days: number = 5): DateTasks[] {
  const start = new Date();
  const sortedTasks: DateTasks[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);

    const filteredTasks = tasks.filter((task) => {
      if (!task.due) return false;

      return (
        Number(task.due.date.split("-")[2]) === date.getDate() &&
        Number(task.due.date.split("-")[1]) === date.getMonth() + 1 &&
        Number(task.due.date.split("-")[0]) === date.getFullYear()
      );
    });

    sortedTasks.push({ date, tasks: filteredTasks });
  }

  return sortedTasks;
}
