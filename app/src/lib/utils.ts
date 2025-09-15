import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasEmptyField(obj: Record<string, any>): boolean {
  return Object.values(obj).some(
    v => v == null || (typeof v === "string" && v.trim() === "")
  );
}