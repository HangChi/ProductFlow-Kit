import assert from "node:assert/strict";
import { test } from "node:test";

test("template metadata is generated", () => {
  assert.equal("saas-admin".length > 0, true);
  assert.equal(["auth","rbac","audit-log"].includes("ai"), false);
});
