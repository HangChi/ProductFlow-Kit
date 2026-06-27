import fs from "node:fs";
import path from "node:path";
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

  ensureWritableTarget(targetDir, options.force);

  const context = {
    appName,
    packageName: toPackageName(appName),
    displayName: toDisplayName(appName),
    template,
    dataLayer,
    language,
    modules,
  };

  const files = buildProjectFiles(context);
  for (const file of files) {
    const destination = path.join(targetDir, file.path);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, file.content, "utf8");
  }

  return {
    appName,
    targetDir,
    template,
    dataLayer,
    language,
    modules,
    files: files.map((file) => file.path),
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
  return [
    `Created ${result.appName} at ${result.targetDir}`,
    `Template: ${result.template.id}`,
    `Data layer: ${result.dataLayer}`,
    `Modules: ${result.modules.join(", ") || "none"}`,
    "",
    "Next steps:",
    `  cd ${path.relative(process.cwd(), result.targetDir) || "."}`,
    "  cp .env.example .env",
    "  docker compose up --build",
  ].join("\n");
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
    throw new Error(`Target directory is not empty: ${targetDir}. Use --force to write into it.`);
  }
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
