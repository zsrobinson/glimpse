"use client";

import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <main className="m-8 flex flex-col items-start gap-4">
      <p className="text-2xl font-semibold">Hello world!</p>
      <Button onClick={() => alert("hi")}>Click me</Button>
    </main>
  );
}
