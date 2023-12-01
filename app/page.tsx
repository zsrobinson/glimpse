"use client";

import { useEffect, useRef, useState } from "react";
import { ColumnView } from "~/components/column-view";
import { GlobalLoadingIndicator } from "~/components/global-loading-indicator";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
          <Button
            onClick={() => {
              localStorage.removeItem("apiToken");
              setToken(null);
            }}
            variant="secondary"
          >
            Clear API Token
          </Button>
          <ColumnView />
        </>
      )}
    </main>
  );
}
