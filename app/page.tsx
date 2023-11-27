"use client";

import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function Home() {
  const [apiToken, setApiToken] = useState<string | null>(
    localStorage.getItem("apiToken"), // grab saved value if it exists
  );
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <main className="m-8 flex flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold">Todoist Weekly</h1>

      {apiToken === null ? (
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input className="font-mono" ref={inputRef} placeholder="API Token" />
          <Button
            onClick={() => {
              const value = inputRef.current?.value ?? "";
              setApiToken(value);
              localStorage.setItem("apiToken", value); // persist value
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
              setApiToken(null);
            }}
            variant="secondary"
          >
            Clear API Token
          </Button>
          <p>weekly view thing goes here!</p>
        </>
      )}
    </main>
  );
}
