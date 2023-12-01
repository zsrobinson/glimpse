import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "~/components/providers";

export const metadata: Metadata = { title: "Glimpse, for Todoist" };

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen p-8">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
