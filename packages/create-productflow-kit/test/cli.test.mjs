import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, test } from "node:test";
import { parseArgs } from "../src/cli.mjs";
import { createProject, loadTemplateManifests } from "../src/generator.mjs";

const createdRoots = [];

afterEach(() => {
  for (const root of createdRoots.splice(0)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe("CLI parsing", () => {
  test("parses public create command", () => {
    const parsed = parseArgs([
      "create",
      "my-ai-app",
      "--template",
      "ai-saas",
      "--data=mybatis",
      "--modules",
      "auth,rbac,ai,audit-log",
      "--language",
      "bilingual",
    ]);

    assert.equal(parsed.command, "create");
    assert.equal(parsed.appName, "my-ai-app");
    assert.equal(parsed.template, "ai-saas");
    assert.equal(parsed.data, "mybatis");
    assert.deepEqual(parsed.modules, ["auth", "rbac", "ai", "audit-log"]);
    assert.equal(parsed.language, "bilingual");
  });
});

describe("template manifests", () => {
  test("loads starter manifests", () => {
    const ids = loadTemplateManifests().map((template) => template.id);
    assert.equal(ids.includes("ai-saas"), true);
    assert.equal(ids.includes("saas-admin"), true);
  });
});

describe("project generation", () => {
  test("generates saas-admin with JPA and default modules", async () => {
    const root = makeTempRoot();
    const targetDir = path.join(root, "admin-app");

    const result = await createProject({
      appName: "admin-app",
      targetDir,
      template: "saas-admin",
      data: "jpa",
    });

    assert.equal(result.template.id, "saas-admin");
    assert.equal(result.dataLayer, "jpa");
    assert.deepEqual(result.modules, ["auth", "rbac", "audit-log"]);
    assertFile(targetDir, "frontend/app/page.tsx");
    assertFile(targetDir, "backend/src/main/java/com/productflow/app/users/UserEntity.java");
    assertFile(targetDir, "backend/src/main/java/com/productflow/app/roles/RoleController.java");
    assertFile(targetDir, "backend/src/main/java/com/productflow/app/audit/AuditLogController.java");
    assertNoFile(targetDir, "backend/src/main/java/com/productflow/app/ai/AiChatController.java");

    const pom = readFile(targetDir, "backend/pom.xml");
    assert.match(pom, /spring-boot-starter-data-jpa/);
    assert.doesNotMatch(pom, /mybatis-plus-spring-boot3-starter/);
  });

  test("generates ai-saas with MyBatis and AI module", async () => {
    const root = makeTempRoot();
    const targetDir = path.join(root, "ai-app");

    const result = await createProject({
      appName: "ai-app",
      targetDir,
      template: "ai-saas",
      data: "mybatis-plus",
      modules: ["auth", "rbac", "ai", "audit-log"],
      language: "zh",
    });

    assert.equal(result.template.id, "ai-saas");
    assert.equal(result.dataLayer, "mybatis");
    assert.deepEqual(result.modules, ["auth", "rbac", "ai", "audit-log"]);
    assertFile(targetDir, "frontend/app/ai/page.tsx");
    assertFile(targetDir, "backend/src/main/java/com/productflow/app/ai/AiChatController.java");
    assertFile(targetDir, "backend/src/main/java/com/productflow/app/users/UserMapper.java");
    assertNoFile(targetDir, "backend/src/main/java/com/productflow/app/users/UserEntity.java");

    const pom = readFile(targetDir, "backend/pom.xml");
    assert.match(pom, /mybatis-plus-spring-boot3-starter/);
    assert.doesNotMatch(pom, /spring-boot-starter-data-jpa/);

    const migration = readFile(targetDir, "backend/src/main/resources/db/migration/V1__init.sql");
    assert.match(migration, /CREATE TABLE IF NOT EXISTS ai_prompts/);
  });

  test("adds optional file-storage and email modules", async () => {
    const root = makeTempRoot();
    const targetDir = path.join(root, "ops-app");

    await createProject({
      appName: "ops-app",
      targetDir,
      template: "saas-admin",
      data: "jpa",
      modules: ["auth", "rbac", "file-storage", "email", "audit-log"],
    });

    assertFile(targetDir, "frontend/app/files/page.tsx");
    assertFile(targetDir, "frontend/app/email/page.tsx");
    assertFile(targetDir, "backend/src/main/java/com/productflow/app/files/FileController.java");
    assertFile(targetDir, "backend/src/main/java/com/productflow/app/email/EmailController.java");
  });

  test("generates landing-page with lead capture blueprint", async () => {
    const root = makeTempRoot();
    const targetDir = path.join(root, "landing-app");

    const result = await createProject({
      appName: "landing-app",
      targetDir,
      template: "landing-page",
      data: "jpa",
    });

    assert.equal(result.template.id, "landing-page");
    assert.deepEqual(result.modules, ["email"]);
    assertFile(targetDir, "frontend/app/leads/page.tsx");
    assertFile(targetDir, "backend/src/main/java/com/productflow/app/leads/LeadController.java");

    const migration = readFile(targetDir, "backend/src/main/resources/db/migration/V1__init.sql");
    assert.match(migration, /CREATE TABLE IF NOT EXISTS landing_leads/);
  });

  test("generates crm-admin with pipeline resources", async () => {
    const root = makeTempRoot();
    const targetDir = path.join(root, "crm-app");

    const result = await createProject({
      appName: "crm-app",
      targetDir,
      template: "crm-admin",
      data: "jpa",
    });

    assert.equal(result.template.id, "crm-admin");
    assert.deepEqual(result.modules, ["auth", "rbac", "email", "audit-log"]);
    assertFile(targetDir, "frontend/app/crm/accounts/page.tsx");
    assertFile(targetDir, "frontend/app/crm/deals/page.tsx");
    assertFile(targetDir, "backend/src/main/java/com/productflow/app/crm/AccountController.java");

    const migration = readFile(targetDir, "backend/src/main/resources/db/migration/V1__init.sql");
    assert.match(migration, /CREATE TABLE IF NOT EXISTS crm_accounts/);
    assert.match(migration, /CREATE TABLE IF NOT EXISTS crm_deals/);
  });
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
