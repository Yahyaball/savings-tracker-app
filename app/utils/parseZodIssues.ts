import { FetchError } from "ofetch";

export interface ZodIssueLike {
  path: (string | number)[];
  message: string;
}

export function parseZodIssues(error: unknown): ZodIssueLike[] {
  if (!(error instanceof FetchError)) return [];
  const message = error.data?.message;
  if (typeof message !== "string") return [];
  try {
    const parsed = JSON.parse(message);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
