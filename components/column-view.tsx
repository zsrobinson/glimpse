"use client";

import { AddTaskArgs, Task, TodoistApi } from "@doist/todoist-api-typescript";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { IconCircle, IconCircleCheck } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getDayName } from "~/lib/utils";
import { Input } from "./ui/input";

type TempTask = {
  id: string;
  content: string;
  dueString: string;
};

export function ColumnView() {
  const dates: string[] = [];
  const startingDate = new Date();

  for (let i = 0; i < 5; i++) {
    const date = new Date(startingDate);
    date.setDate(date.getDate() + i);
    dates.push(
      `${date.getFullYear()}-${date.getMonth() + 1}-0${date.getDate()}`,
    );
  }

  return (
    <div className="flex h-full w-full gap-4">
      {dates.map((date) => (
        <DateColumn key={date} date={date} />
      ))}
    </div>
  );
}

function DateColumn({ date }: { date: string }) {
  const token = localStorage.getItem("token")!;
  const api = new TodoistApi(token);
  const queryClient = useQueryClient();
  const [tempTasks, setTempTasks] = useState<TempTask[]>([]);
  const [parent] = useAutoAnimate();

  const tasks = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => api.getTasks(),
  });

  const dateTasks = tasks.data?.filter((task) => {
    if (!task.due) return false;
    return task.due.date === date;
  });

  const { mutate: addTask } = useMutation({
    mutationFn: (args: AddTaskArgs) => {
      return api.addTask(args);
    },

    onMutate: (args) => {
      // add temp task to temp tasks list
      setTempTasks((tempTasks) => [
        ...tempTasks,
        {
          id: `temp-${crypto.randomUUID()}`,
          content: args.content,
          dueString: args.dueString!,
        },
      ]);
    },

    onSuccess: (output, args) => {
      // add confirmed new task to real tasks list
      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        if (!old) return;
        return [...old, output];
      });

      // refetch tasks from api
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      // remove temp task from temp tasks list
      setTempTasks((tempTasks) =>
        tempTasks.filter((task) => task.content !== args.content),
      );
    },
  });

  return (
    <div className="flex basis-1/5 flex-col gap-2 rounded-lg border border-border p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground">
            {date.split("-")[2].startsWith("0")
              ? date.split("-")[2][1]
              : date.split("-")[2]}
          </div>

          <h2 className="text-lg font-semibold">{getDayName(date)}</h2>
        </div>

        <ul className="flex flex-col gap-2" ref={parent}>
          {dateTasks?.map((task) => <TaskItem key={task.id} task={task} />)}
          {tempTasks.map((task) => (
            <TempTaskItem key={task.id} task={task} />
          ))}
        </ul>
      </div>

      <form
        className="flex flex-grow items-end"
        onSubmit={(e) => {
          const formData = new FormData(e.target as HTMLFormElement);

          addTask({
            content: formData.get("content") as string,
            dueString: date,
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
      if (id.startsWith("temp-")) return Promise.resolve(false);
      return api.deleteTask(id);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        return old?.filter((task) => task.id !== id);
      });
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

function TempTaskItem({ task }: { task: TempTask }) {
  return (
    <li className="flex gap-2">
      <IconCircle className="text-secondary" />
      <span className="leading-tight text-muted-foreground">
        {task.content}
      </span>
    </li>
  );
}
