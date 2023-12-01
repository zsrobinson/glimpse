"use client";

import { AddTaskArgs, Task, TodoistApi } from "@doist/todoist-api-typescript";
import { DateTasks, filterTasks, getDayName } from "~/lib/utils";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function ColumnView() {
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

  const { mutate } = useMutation({
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

        <ul className="list-inside list-disc">
          {dateTasks.tasks.map((task, i) => (
            <li key={i}>{task.content}</li>
          ))}
        </ul>
      </div>

      <form
        className="flex flex-grow items-end"
        onSubmit={(e) => {
          const formData = new FormData(e.target as HTMLFormElement);
          const content = formData.get("content") as string;

          mutate({
            content,
            dueString:
              dateTasks.date.getFullYear() +
              "-" +
              (dateTasks.date.getMonth() + 1) +
              "-" +
              dateTasks.date.getDate(),
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
