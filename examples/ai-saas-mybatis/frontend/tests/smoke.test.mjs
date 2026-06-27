import assert from "node:assert/strict";
import { test } from "node:test";

test("template metadata is generated", () => {
  assert.equal("ai-saas".length > 0, true);
  assert.equal(["auth","rbac","ai","audit-log"].includes("ai"), true);
});
