import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parsePriceToNumber(raw: string): number {
  const normalized = (raw || "").replace(/[^\d.,-]/g, "").replace(",", ".");
  const num = parseFloat(normalized);
  return Number.isFinite(num) ? num : 0;
}

export function sanitizeQuery(query: string): string {
  return (query || "").replace(/[^\p{L}\p{N}\s-]/gu, "").trim();
}

export function isLanguageRTL(lang?: string | null): boolean {
  return lang ? ["ar", "ku"].includes(lang) : false;
}
