import { DEFAULT_POLL_INTERVAL_MS } from "../constants.js";
import { fetchMessages } from "./fetch.js";
import type { ParsedArgs } from "../types.js";

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    if (signal) {
      const onAbort = () => {
        clearTimeout(timer);
        resolve();
      };
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });
}

export async function listen(args: ParsedArgs): Promise<void> {
  const raw = args["interval-seconds"];
  const intervalSeconds = typeof raw === "string" ? Number(raw) : 30;
  const intervalMs = Number.isFinite(intervalSeconds)
    ? Math.max(5, intervalSeconds) * 1000
    : DEFAULT_POLL_INTERVAL_MS;

  console.log("Listening for Galinum messages.");
  console.log("Press Ctrl+C to stop.");

  const controller = new AbortController();
  const stop = () => controller.abort();
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);

  const innerArgs: ParsedArgs = {
    ...args,
    _: ["fetch", ...(args._[1] ? [args._[1]] : [])],
    quiet: true,
  };
  while (!controller.signal.aborted) {
    await fetchMessages(innerArgs);
    if (controller.signal.aborted) break;
    await sleep(intervalMs, controller.signal);
  }
}
