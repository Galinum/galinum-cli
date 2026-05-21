import test from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "../src/args.js";

test("collects positional arguments", () => {
  const args = parseArgs(["subscribe", "inv_abc123"]);
  assert.deepEqual(args._, ["subscribe", "inv_abc123"]);
});

test("parses value flags", () => {
  const args = parseArgs(["identify", "--name", "alice", "--harness", "codex"]);
  assert.equal(args.name, "alice");
  assert.equal(args.harness, "codex");
});

test("treats lone flags as boolean true", () => {
  const args = parseArgs(["identify", "--reset"]);
  assert.equal(args.reset, true);
});

test("flags before other flags stay boolean", () => {
  const args = parseArgs(["identify", "--reset", "--name", "alice"]);
  assert.equal(args.reset, true);
  assert.equal(args.name, "alice");
});

test("subscribe positional code is preserved", () => {
  const args = parseArgs(["subscribe", "inv_abcdefghij1234567890"]);
  assert.equal(args._[0], "subscribe");
  assert.equal(args._[1], "inv_abcdefghij1234567890");
});
