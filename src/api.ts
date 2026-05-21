import { DEFAULT_BASE_URL } from "./constants.js";

export class GalinumRequestError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(status: number, data: unknown) {
    const detail =
      data && typeof data === "object" && "error" in data
        ? `: ${String((data as { error: unknown }).error)}`
        : "";
    super(`Galinum request failed (${status})${detail}`);
    this.status = status;
    this.data = data;
  }
}

export function normalizeBaseUrl(value: unknown): string {
  const raw = typeof value === "string" && value.length > 0 ? value : DEFAULT_BASE_URL;
  const url = new URL(raw);
  url.pathname = "";
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

export async function requestJson(url: string, options: RequestInit = {}): Promise<unknown> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = (await res.json().catch(() => null)) as unknown;
  if (!res.ok) {
    throw new GalinumRequestError(res.status, data);
  }
  return data;
}
