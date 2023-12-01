"use client";

import { AddTaskArgs, Task, TodoistApi } from "@doist/todoist-api-typescript";
import { IconCircle, IconCircleCheck } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DateTasks, filterTasks, getDayName } from "~/lib/utils";
import { Input } from "./ui/input";

export function ColumnView() {
  const token = localStorage.getItem("token")!;
  const api = new TodoistApi(token);

  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.getTasks(),
  });

  const filtered = query.data ? filterTasks(query.data) : [];

  return (
    <div className="flex h-full w-full gap-4">
      {filtered.map((list, i) => (
        <DateColumn key={i} dateTasks={list} />
      ))}
    </div>
  );
}

function DateColumn({ dateTasks }: { dateTasks: DateTasks }) {
  const token = localStorage.getItem("token")!;
  const api = new TodoistApi(token);
  const queryClient = useQueryClient();

  const { mutate: addTask } = useMutation({
    mutationFn: (args: AddTaskArgs) => api.addTask(args),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <div className="flex basis-1/5 flex-col gap-2 rounded-lg border border-border p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            {dateTasks.date.getDate()}
          </div>

          <h2 className="text-lg font-semibold">
            {getDayName(dateTasks.date)}
          </h2>
        </div>

        <ul className="flex flex-col gap-2">
          {dateTasks.tasks.map((task, i) => (
            <TaskItem key={i} task={task} />
          ))}
        </ul>
      </div>

      <form
        className="flex flex-grow items-end"
        onSubmit={(e) => {
          const formData = new FormData(e.target as HTMLFormElement);
          const content = formData.get("content") as string;

          addTask({
            content,
            dueString: `${dateTasks.date.getFullYear()}-${
              dateTasks.date.getMonth() + 1
            }-${dateTasks.date.getDate()}`,
          });

          (e.target as HTMLFormElement).reset();
          e.preventDefault();
        }}
      >
        <Input placeholder="Add task" name="content" />
      </form>
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  const token = localStorage.getItem("token")!;
  const api = new TodoistApi(token);
  const queryClient = useQueryClient();

  const { mutate: deleteTask } = useMutation({
    mutationFn: (id: string) => {
      return api.deleteTask(id);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <li className="flex gap-2">
      <button
        className="group relative flex"
        onClick={() => {
          deleteTask(task.id);
        }}
      >
        <IconCircle className="text-muted-foreground group-hover:text-transparent" />
        <IconCircleCheck className="absolute left-0 top-0 text-transparent group-hover:text-muted-foreground" />
      </button>
      <span className="leading-tight">{task.content}</span>
    </li>
  );
}
