import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns "Monday", "Tuesday", etc. for a given date formatted as "YYYY-MM-DD".
 * This should work regardless of the timezone.
 */
export function getDayName(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const obj = new Date(year, month - 1, day);
  return obj.toLocaleString("en-US", { weekday: "long" });
}
