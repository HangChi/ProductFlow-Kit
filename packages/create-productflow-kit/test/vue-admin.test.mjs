import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, test } from "node:test";
import { createProject } from "../src/generator.mjs";

const createdRoots = [];

afterEach(() => {
  for (const root of createdRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("generates vue-admin with Vue frontend", async () => {
  const root = makeTempRoot();
  const targetDir = path.join(root, "vue-app");

  const result = await createProject({
    appName: "vue-app",
    targetDir,
    template: "vue-admin",
    data: "mybatis",
  });

  assert.equal(result.template.id, "vue-admin");
  assert.equal(result.dataLayer, "mybatis");
  assert.deepEqual(result.modules, ["auth"]);
  assertFile(targetDir, "frontend/src/App.vue");
  assertFile(targetDir, "frontend/vite.config.ts");
  assertNoFile(targetDir, "frontend/app/page.tsx");
  assertFile(targetDir, "backend/src/main/java/com/productflow/app/admin/AdminTeamController.java");

  const migration = readFile(targetDir, "backend/src/main/resources/db/migration/V1__init.sql");
  assert.match(migration, /CREATE TABLE IF NOT EXISTS admin_teams/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS admin_incidents/);
});

function makeTempRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "productflow-kit-"));
  createdRoots.push(root);
  return root;
}

function assertFile(root, relativePath) {
  assert.equal(fs.existsSync(path.join(root, relativePath)), true, relativePath);
}

function assertNoFile(root, relativePath) {
  assert.equal(fs.existsSync(path.join(root, relativePath)), false, relativePath);
}

function readFile(root, relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}
