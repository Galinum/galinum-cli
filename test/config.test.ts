import test from "node:test";
import assert from "node:assert/strict";
import { chmod, mkdtemp, readFile, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { saveConfig } from "../src/config.js";

test("saveConfig restricts existing config files to owner read/write", async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), "galinum-config-"));
  const file = path.join(dir, "config.json");

  await saveConfig({ _: [], config: file }, { subscriptions: [] });
  await chmod(file, 0o644);
  await saveConfig({ _: [], config: file }, { subscriptions: [] });

  assert.equal((await stat(file)).mode & 0o777, 0o600);
  assert.equal(await readFile(file, "utf8"), "{\n  \"subscriptions\": []\n}\n");
});
