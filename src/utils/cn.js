import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes without conflicts.
 * Allows for conditional classes (clsx) and safe overrides (tailwind-merge).
 * * Usage: 
 * <div className={cn("bg-red-500 p-4", isSelected && "bg-blue-500")} />
 * Result if selected: "p-4 bg-blue-500" (red is correctly removed)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}