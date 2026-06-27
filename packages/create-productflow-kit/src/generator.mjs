import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildProjectFiles } from "./scaffold.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_ROOT = path.join(PACKAGE_ROOT, "templates");

const DATA_LAYER_ALIASES = new Map([
  ["jpa", "jpa"],
  ["jpa-flyway", "jpa"],
  ["mybatis", "mybatis"],
  ["mybatis-plus", "mybatis"],
]);

const LANGUAGE_ALIASES = new Map([
  ["en", "en"],
  ["english", "en"],
  ["zh", "zh"],
  ["zh-cn", "zh"],
  ["chinese", "zh"],
  ["bilingual", "bilingual"],
]);

export function loadTemplateManifests(templateRoot = TEMPLATE_ROOT) {
  if (!fs.existsSync(templateRoot)) {
    throw new Error(`Template root not found: ${templateRoot}`);
  }

  return fs
    .readdirSync(templateRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const manifestPath = path.join(templateRoot, entry.name, "productflow.template.json");
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      return {
        ...manifest,
        manifestPath,
      };
    })
    .sort((left, right) => left.id.localeCompare(right.id));
}

export async function createProject(options) {
  const manifests = loadTemplateManifests();
  const template = selectTemplate(manifests, options.template);
  const appName = normalizeAppName(options.appName);
  const targetDir = path.resolve(options.targetDir || appName);
  const dataLayer = normalizeDataLayer(options.data);
  const language = normalizeLanguage(options.language);
  const modules = normalizeModules(template, options.modules);
  const packageName = normalizePackageName(options.packageName || toPackageName(appName));
  const displayName = normalizeDisplayName(options.displayName || toDisplayName(appName));
  const javaPackage = normalizeJavaPackage(options.javaPackage);
  const frontendPort = normalizePort(options.frontendPort, 3000, "frontend port");
  const backendPort = normalizePort(options.backendPort, 8080, "backend port");
  const databasePort = normalizePort(options.databasePort, 5432, "database port");
  const databaseName = normalizeDatabaseName(options.databaseName || "productflow");
  const packageManager = normalizePackageManager(options.packageManager || "npm");
  const dryRun = Boolean(options.dryRun);

  if (!dryRun) {
    ensureWritableTarget(targetDir, options.force);
  }

  const context = {
    appName,
    packageName,
    displayName,
    javaPackage,
    template,
    dataLayer,
    language,
    modules,
    frontendPort,
    backendPort,
    databasePort,
    databaseName,
    packageManager,
  };

  const files = buildProjectFiles(context);
  if (!dryRun) {
    for (const file of files) {
      writeProjectFile(targetDir, file);
    }

    if (options.initGit) {
      runCommand("git", ["init"], targetDir, "initialize git repository");
    }

    if (options.install) {
      runInstall(packageManager, targetDir);
    }
  }

  return {
    appName,
    targetDir,
    template,
    dataLayer,
    language,
    modules,
    packageName,
    displayName,
    javaPackage,
    frontendPort,
    backendPort,
    databasePort,
    databaseName,
    dryRun,
    initGit: Boolean(options.initGit),
    install: Boolean(options.install),
    packageManager,
    files: files.map((file) => file.path),
  };
}

export function getTemplatePreview(templateId) {
  const manifests = loadTemplateManifests();
  return selectTemplate(manifests, templateId);
}

export function formatTemplatePreview(template) {
  const stack = Object.entries(template.stack || {})
    .map(([key, value]) => `  ${key}: ${value}`)
    .join("\n");
  const modules = (template.modules || []).map((moduleId) => `  - ${moduleId}`).join("\n");
  const defaults = (template.defaultModules || []).join(", ") || "none";
  const required = (template.requiredModules || []).join(", ") || "none";

  return [
    `${template.name} (${template.id})`,
    template.description,
    "",
    "Stack:",
    stack || "  none",
    "",
    "Modules:",
    modules || "  none",
    "",
    `Default modules: ${defaults}`,
    `Required modules: ${required}`,
  ].join("\n");
}

export async function addModuleToProject(options) {
  const targetDir = path.resolve(options.targetDir || process.cwd());
  const moduleId = String(options.module || "").trim();
  if (!moduleId) {
    throw new Error("Missing module id. Run `productflow add module ai`.");
  }

  const manifestPath = path.join(targetDir, "productflow.template.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`No productflow.template.json found in ${targetDir}.`);
  }

  const currentManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const template = selectTemplate(loadTemplateManifests(), currentManifest.id);
  if (!template.modules.includes(moduleId)) {
    throw new Error(`Module "${moduleId}" is not available for template "${template.id}".`);
  }

  const beforeModules = currentManifest.modules || [];
  if (beforeModules.includes(moduleId)) {
    return {
      targetDir,
      module: moduleId,
      changed: false,
      writtenFiles: [],
      skippedFiles: [],
      modules: beforeModules,
    };
  }

  const nextModules = normalizeModules(template, [...beforeModules, moduleId]);
  const baseContext = contextFromManifest(currentManifest, template, beforeModules);
  const nextContext = contextFromManifest(currentManifest, template, nextModules);
  const beforeFiles = new Set(buildProjectFiles(baseContext).map((file) => file.path));
  const nextFiles = buildProjectFiles(nextContext);
  const newFiles = nextFiles.filter((file) => !beforeFiles.has(file.path));
  const writtenFiles = [];
  const skippedFiles = [];

  for (const file of newFiles) {
    const destination = path.join(targetDir, file.path);
    if (fs.existsSync(destination) && !options.force) {
      skippedFiles.push(file.path);
      continue;
    }
    writeProjectFile(targetDir, file);
    writtenFiles.push(file.path);
  }

  const migration = moduleMigrationFile(moduleId);
  if (migration) {
    const migrationPath = path.join(targetDir, migration.path);
    if (!fs.existsSync(migrationPath) || options.force) {
      writeProjectFile(targetDir, migration);
      writtenFiles.push(migration.path);
    } else {
      skippedFiles.push(migration.path);
    }
  }

  const nextManifest = {
    ...currentManifest,
    modules: nextModules,
  };
  fs.writeFileSync(manifestPath, `${JSON.stringify(nextManifest, null, 2)}\n`, "utf8");

  return {
    targetDir,
    module: moduleId,
    changed: true,
    writtenFiles,
    skippedFiles,
    modules: nextModules,
  };
}

export function parseModuleList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const normalized = String(value).trim();
  if (!normalized || normalized === "default") {
    return undefined;
  }

  if (normalized === "none") {
    return [];
  }

  return normalized
    .split(",")
    .map((moduleId) => moduleId.trim())
    .filter(Boolean);
}

export function formatProjectSummary(result) {
  if (result.dryRun) {
    return [
      `Dry run for ${result.appName} at ${result.targetDir}`,
      `Template: ${result.template.id}`,
      `Data layer: ${result.dataLayer}`,
      `Modules: ${result.modules.join(", ") || "none"}`,
      `Package: ${result.packageName}`,
      `Ports: frontend ${result.frontendPort}, backend ${result.backendPort}, database ${result.databasePort}`,
      `Files to create: ${result.files.length}`,
      ...result.files.map((filePath) => `  - ${filePath}`),
    ].join("\n");
  }

  return [
    `Created ${result.appName} at ${result.targetDir}`,
    `Template: ${result.template.id}`,
    `Data layer: ${result.dataLayer}`,
    `Modules: ${result.modules.join(", ") || "none"}`,
    `Package: ${result.packageName}`,
    `Ports: frontend ${result.frontendPort}, backend ${result.backendPort}, database ${result.databasePort}`,
    result.initGit ? "Git: initialized" : undefined,
    result.install ? `Dependencies: installed with ${result.packageManager}` : undefined,
    "",
    "Next steps:",
    `  cd ${path.relative(process.cwd(), result.targetDir) || "."}`,
    "  cp .env.example .env",
    "  docker compose up --build",
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export function formatAddModuleSummary(result) {
  if (!result.changed) {
    return `Module "${result.module}" is already enabled in ${result.targetDir}.`;
  }

  return [
    `Added module "${result.module}" to ${result.targetDir}`,
    `Modules: ${result.modules.join(", ")}`,
    `Files written: ${result.writtenFiles.length}`,
    ...result.writtenFiles.map((filePath) => `  - ${filePath}`),
    result.skippedFiles.length ? `Files skipped: ${result.skippedFiles.length}` : undefined,
    ...result.skippedFiles.map((filePath) => `  - ${filePath}`),
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

function selectTemplate(manifests, templateId = "saas-admin") {
  const template = manifests.find((manifest) => manifest.id === templateId);
  if (!template) {
    const ids = manifests.map((manifest) => manifest.id).join(", ");
    throw new Error(`Unknown template "${templateId}". Available templates: ${ids}`);
  }
  return template;
}

function normalizeAppName(value) {
  const appName = String(value || "").trim();
  if (!appName) {
    throw new Error("App name is required.");
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(appName)) {
    throw new Error("App name may only contain letters, numbers, dots, underscores, and dashes.");
  }
  return appName;
}

function normalizePackageName(value) {
  const packageName = String(value || "").trim();
  if (!packageName) {
    throw new Error("Package name is required.");
  }
  if (!/^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/.test(packageName)) {
    throw new Error("Package name must be lowercase and may include an npm scope.");
  }
  return packageName;
}

function normalizeDisplayName(value) {
  const displayName = String(value || "").trim();
  if (!displayName) {
    throw new Error("Display name is required.");
  }
  return displayName;
}

function normalizeJavaPackage(value = "com.productflow.app") {
  const javaPackage = String(value || "").trim();
  if (!/^[a-z_][a-z0-9_]*(\.[a-z_][a-z0-9_]*)+$/.test(javaPackage)) {
    throw new Error("Java package must look like com.example.app.");
  }
  return javaPackage;
}

function normalizePort(value, defaultValue, label) {
  const port = value === undefined || value === "" ? defaultValue : Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
  return port;
}

function normalizeDatabaseName(value) {
  const databaseName = String(value || "").trim();
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(databaseName)) {
    throw new Error("Database name may only contain letters, numbers, and underscores.");
  }
  return databaseName;
}

function normalizePackageManager(value) {
  const packageManager = String(value || "").trim().toLowerCase();
  if (!["npm", "pnpm"].includes(packageManager)) {
    throw new Error("Package manager must be npm or pnpm.");
  }
  return packageManager;
}

function normalizeDataLayer(value = "jpa") {
  const normalized = DATA_LAYER_ALIASES.get(String(value).toLowerCase());
  if (!normalized) {
    throw new Error(`Unknown data layer "${value}". Use jpa or mybatis.`);
  }
  return normalized;
}

function normalizeLanguage(value = "bilingual") {
  const normalized = LANGUAGE_ALIASES.get(String(value).toLowerCase());
  if (!normalized) {
    throw new Error(`Unknown language "${value}". Use en, zh, or bilingual.`);
  }
  return normalized;
}

function normalizeModules(template, requestedModules) {
  const available = new Set(template.modules);
  const requested = parseModuleList(requestedModules) ?? template.defaultModules;

  for (const moduleId of requested) {
    if (!available.has(moduleId)) {
      throw new Error(`Module "${moduleId}" is not available for template "${template.id}".`);
    }
  }

  const selected = new Set([...requested, ...(template.requiredModules || [])]);
  return template.modules.filter((moduleId) => selected.has(moduleId));
}

function ensureWritableTarget(targetDir, force = false) {
  if (!fs.existsSync(targetDir)) {
    return;
  }

  const entries = fs.readdirSync(targetDir);
  if (entries.length > 0 && !force) {
    const sample = entries.slice(0, 5).join(", ");
    throw new Error(
      `Target directory is not empty: ${targetDir}. Found: ${sample}. Use --force to write into it.`,
    );
  }
}

function writeProjectFile(targetDir, file) {
  const destination = path.join(targetDir, file.path);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, file.content, "utf8");
}

function runInstall(packageManager, targetDir) {
  const command = packageManager === "pnpm" ? "pnpm" : "npm";
  const args = packageManager === "pnpm" ? ["install"] : ["install"];
  runCommand(command, args, targetDir, `install dependencies with ${packageManager}`);
}

function runCommand(command, args, cwd, label) {
  const result = spawnSync(command, args, {
    cwd,
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  if (result.error) {
    throw new Error(`Failed to ${label}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error(`Failed to ${label}. Command exited with ${result.status}.`);
  }
}

function contextFromManifest(manifest, template, modules) {
  const variables = manifest.variables || {};
  return {
    appName: variables.appName || manifest.name || template.id,
    packageName: normalizePackageName(variables.packageName || toPackageName(template.id)),
    displayName: normalizeDisplayName(variables.appName || manifest.name || template.name),
    javaPackage: normalizeJavaPackage(variables.javaPackage || "com.productflow.app"),
    template,
    dataLayer: normalizeDataLayer(manifest.dataLayer || "jpa"),
    language: normalizeLanguage(variables.language || "bilingual"),
    modules,
    frontendPort: normalizePort(variables.frontendPort, 3000, "frontend port"),
    backendPort: normalizePort(variables.backendPort, 8080, "backend port"),
    databasePort: normalizePort(variables.databasePort, 5432, "database port"),
    databaseName: normalizeDatabaseName(variables.databaseName || "productflow"),
    packageManager: normalizePackageManager(variables.packageManager || "npm"),
  };
}

function moduleMigrationFile(moduleId) {
  if (moduleId === "ai") {
    return {
      path: "backend/src/main/resources/db/migration/V2__add_ai.sql",
      content: `CREATE TABLE IF NOT EXISTS ai_prompts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_calls (
  id BIGSERIAL PRIMARY KEY,
  provider VARCHAR(80) NOT NULL,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`,
    };
  }

  return undefined;
}

function toPackageName(appName) {
  return appName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/^[._-]+/, "")
    .replace(/[._-]+$/, "") || "productflow-app";
}

function toDisplayName(appName) {
  return appName
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
