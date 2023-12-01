"use client";

import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { format } from "date-fns";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { ColumnView } from "~/components/column-view";
import { GlobalLoadingIndicator } from "~/components/global-loading-indicator";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    setToken(localStorage.getItem("token")); // load saved value
  }, []);

  return (
    <main className="flex h-full flex-col items-start gap-4">
      <div className="flex gap-4">
        <h1 className="text-2xl font-semibold">Todoist Weekly</h1>
        <GlobalLoadingIndicator />
      </div>

      {token === null ? (
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input className="font-mono" ref={inputRef} placeholder="API Token" />
          <Button
            onClick={() => {
              const value = inputRef.current?.value ?? "";
              setToken(value);
              localStorage.setItem("token", value); // persist value
            }}
          >
            Submit
          </Button>
        </div>
      ) : (
        <>
          <div className="box-content flex rounded-md border border-border">
            {/* <Button
              onClick={() => {
                localStorage.removeItem("apiToken");
                setToken(null);
              }}
              variant="secondary"
            >
              Clear API Token
            </Button> */}

            <ShiftDateButton amount={-5} setDate={setDate}>
              <IconChevronsLeft size={16} />
            </ShiftDateButton>

            <ShiftDateButton amount={-1} setDate={setDate}>
              <IconChevronLeft size={16} />
            </ShiftDateButton>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"link"}
                  className={cn(
                    "w-[160px] justify-center text-center font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  {/* <IconCalendar className="mr-2" size={16} /> */}
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>

            <ShiftDateButton amount={1} setDate={setDate}>
              <IconChevronRight size={16} />
            </ShiftDateButton>

            <ShiftDateButton amount={5} setDate={setDate}>
              <IconChevronsRight size={16} />
            </ShiftDateButton>
          </div>

          <ColumnView startingDate={date} />
        </>
      )}
    </main>
  );
}

type ShiftDateButtonProps = {
  children?: ReactNode;
  amount: number;
  setDate: Dispatch<SetStateAction<Date | undefined>>;
};

function ShiftDateButton({ children, amount, setDate }: ShiftDateButtonProps) {
  return (
    <Button
      variant="link"
      size="icon"
      onClick={() => {
        setDate((date) => {
          const newDate = new Date(date ?? new Date());
          newDate.setDate(newDate.getDate() + amount);
          return newDate;
        });
      }}
    >
      {children}
    </Button>
  );
}
