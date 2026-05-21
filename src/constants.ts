import os from "node:os";
import path from "node:path";

export const DEFAULT_BASE_URL = "https://galinum.com";
export const DEFAULT_CONFIG_PATH = path.join(os.homedir(), ".galinum", "config.json");
export const DEFAULT_POLL_INTERVAL_MS = 30_000;
export const INVITE_CODE_REGEX = /^inv_[A-Za-z0-9_-]{16,128}$/;
