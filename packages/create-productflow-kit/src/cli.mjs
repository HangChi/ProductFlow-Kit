import process from "node:process";
import { createInterface } from "node:readline/promises";
import {
  addModuleToProject,
  createProject,
  formatAddModuleSummary,
  formatProjectSummary,
  formatTemplatePreview,
  getTemplatePreview,
  loadTemplateManifests,
  parseModuleList,
} from "./generator.mjs";

const HELP = `
ProductFlow Kit

Usage:
  productflow create <app-name> [options]
  create-productflow-kit <app-name> [options]
  productflow list
  productflow preview <template-id>
  productflow add module <module-id> [options]

Create options:
  --template <id>          Template id. Run \`productflow list\` to see all templates
  --data <layer>           jpa | jpa-flyway | mybatis | mybatis-plus
  --modules <list>         Comma-separated modules, e.g. auth,rbac,ai,audit-log
  --language <value>       en | zh | bilingual
  --package-name <name>    Generated npm package name
  --display-name <name>    Human-readable product name
  --frontend-port <port>   Frontend host/container port. Default: 3000
  --backend-port <port>    Backend host/container port. Default: 8080
  --database-port <port>   PostgreSQL host port. Default: 5432
  --database-name <name>   PostgreSQL database name. Default: productflow
  --package-manager <pm>   npm | pnpm. Default: npm
  --dry-run                Print the generation plan without writing files
  --init-git               Run git init in the generated project
  --install                Run dependency installation after generation
  --force                  Allow writing into a non-empty target directory

Add module options:
  --project-dir <path>     Project directory. Default: current directory
  --force                  Overwrite generated module files when they already exist

General:
  -h, --help               Show this help
`.trim();

const VALUE_OPTIONS = new Set([
  "template",
  "data",
  "modules",
  "language",
  "package-name",
  "display-name",
  "frontend-port",
  "backend-port",
  "database-port",
  "database-name",
  "package-manager",
  "project-dir",
]);

const BOOLEAN_OPTIONS = new Set(["force", "dry-run", "init-git", "install"]);

export async function runCli(argv = process.argv.slice(2), streams = process) {
  const parsed = parseArgs(argv);

  if (parsed.help) {
    streams.stdout.write(`${HELP}\n`);
    return;
  }

  if (parsed.command === "list") {
    const manifests = loadTemplateManifests();
    const lines = manifests.map((template) => `- ${template.id}: ${template.description}`);
    streams.stdout.write(`Available templates:\n${lines.join("\n")}\n`);
    return;
  }

  if (parsed.command === "preview") {
    const template = getTemplatePreview(parsed.template || "saas-admin");
    streams.stdout.write(`${formatTemplatePreview(template)}\n`);
    return;
  }

  if (parsed.command === "add") {
    const result = await addModuleToProject(parsed);
    streams.stdout.write(`${formatAddModuleSummary(result)}\n`);
    return;
  }

  const options = await completeCreateOptions(parsed, streams);
  const result = await createProject(options);
  streams.stdout.write(`${formatProjectSummary(result)}\n`);
}

export function parseArgs(argv) {
  const tokens = argv.filter((token) => token !== "--");
  const parsed = {
    command: "create",
    appName: undefined,
    template: undefined,
    data: undefined,
    modules: undefined,
    language: undefined,
    packageName: undefined,
    displayName: undefined,
    frontendPort: undefined,
    backendPort: undefined,
    databasePort: undefined,
    databaseName: undefined,
    packageManager: undefined,
    targetDir: undefined,
    module: undefined,
    force: false,
    dryRun: false,
    initGit: false,
    install: false,
    help: false,
  };

  const first = tokens[0];
  if (first === "help" || first === "--help" || first === "-h") {
    parsed.help = true;
    return parsed;
  }

  let index = 0;
  if (first === "list") {
    parsed.command = "list";
    index = 1;
  } else if (first === "preview") {
    parsed.command = "preview";
    index = 1;
    if (tokens[index] && !tokens[index].startsWith("-")) {
      parsed.template = tokens[index];
      index += 1;
    }
  } else if (first === "add") {
    parsed.command = "add";
    if (tokens[1] !== "module" || !tokens[2]) {
      throw new Error("Usage: productflow add module <module-id>");
    }
    parsed.module = tokens[2];
    index = 3;
  } else if (first === "create") {
    parsed.command = "create";
    index = 1;
  }

  while (index < tokens.length) {
    const token = tokens[index];

    if (token === "--help" || token === "-h") {
      parsed.help = true;
      index += 1;
      continue;
    }

    if (token.startsWith("--")) {
      const { name, value, consumedNext } = readOption(tokens, index);
      applyOption(parsed, name, value);
      index += consumedNext ? 2 : 1;
      continue;
    }

    if (parsed.command === "create" && !parsed.appName) {
      parsed.appName = token;
      index += 1;
      continue;
    }

    throw new Error(`Unexpected argument: ${token}`);
  }

  return parsed;
}

async function completeCreateOptions(parsed, streams) {
  if (parsed.appName) {
    return parsed;
  }

  if (!streams.stdin?.isTTY) {
    throw new Error("Missing <app-name>. Run `productflow create my-app`.");
  }

  const rl = createInterface({
    input: streams.stdin,
    output: streams.stdout,
  });

  try {
    const manifests = loadTemplateManifests();
    const templateHint = manifests.map((template) => template.id).join(" / ");
    const appName = await askRequired(rl, "App name");
    const defaultPackageName = appName
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "-")
      .replace(/^[._-]+|[._-]+$/g, "");

    return {
      ...parsed,
      appName,
      template: parsed.template || (await askDefault(rl, `Template (${templateHint})`, "saas-admin")),
      data: parsed.data || (await askDefault(rl, "Data layer (jpa / mybatis)", "jpa")),
      modules:
        parsed.modules ||
        parseModuleList(await askDefault(rl, "Modules (comma-separated, blank for defaults)", "default")),
      packageName: parsed.packageName || (await askDefault(rl, "Package name", defaultPackageName)),
      displayName: parsed.displayName || (await askDefault(rl, "Display name", toTitle(appName))),
      frontendPort: parsed.frontendPort || (await askDefault(rl, "Frontend port", "3000")),
      backendPort: parsed.backendPort || (await askDefault(rl, "Backend port", "8080")),
      databasePort: parsed.databasePort || (await askDefault(rl, "Database port", "5432")),
      databaseName: parsed.databaseName || (await askDefault(rl, "Database name", "productflow")),
      initGit: parsed.initGit || (await askYesNo(rl, "Initialize git repository?", false)),
      install: parsed.install || (await askYesNo(rl, "Install dependencies after generation?", false)),
    };
  } finally {
    rl.close();
  }
}

function readOption(tokens, index) {
  const token = tokens[index];
  const [rawName, inlineValue] = token.slice(2).split("=", 2);
  const name = rawName.trim();

  if (BOOLEAN_OPTIONS.has(name)) {
    return { name, value: true, consumedNext: false };
  }

  if (name.startsWith("no-")) {
    const positiveName = name.slice(3);
    if (!BOOLEAN_OPTIONS.has(positiveName)) {
      throw new Error(`Unknown option --${name}`);
    }
    return { name: positiveName, value: false, consumedNext: false };
  }

  if (!VALUE_OPTIONS.has(name)) {
    throw new Error(`Unknown option --${name}`);
  }

  const value = inlineValue ?? tokens[index + 1];
  if (value === undefined || value.startsWith("--")) {
    throw new Error(`Missing value for --${name}`);
  }

  return {
    name,
    value,
    consumedNext: inlineValue === undefined,
  };
}

function applyOption(parsed, name, value) {
  if (name === "force") parsed.force = value;
  else if (name === "dry-run") parsed.dryRun = value;
  else if (name === "init-git") parsed.initGit = value;
  else if (name === "install") parsed.install = value;
  else if (name === "template") parsed.template = value;
  else if (name === "data") parsed.data = value;
  else if (name === "modules") parsed.modules = parseModuleList(value);
  else if (name === "language") parsed.language = value;
  else if (name === "package-name") parsed.packageName = value;
  else if (name === "display-name") parsed.displayName = value;
  else if (name === "frontend-port") parsed.frontendPort = value;
  else if (name === "backend-port") parsed.backendPort = value;
  else if (name === "database-port") parsed.databasePort = value;
  else if (name === "database-name") parsed.databaseName = value;
  else if (name === "package-manager") parsed.packageManager = value;
  else if (name === "project-dir") parsed.targetDir = value;
  else throw new Error(`Unknown option --${name}`);
}

async function askRequired(rl, label) {
  const value = (await rl.question(`${label}: `)).trim();
  if (!value) {
    throw new Error(`${label} is required.`);
  }
  return value;
}

async function askDefault(rl, label, defaultValue) {
  const value = (await rl.question(`${label} [${defaultValue}]: `)).trim();
  return value || defaultValue;
}

async function askYesNo(rl, label, defaultValue) {
  const suffix = defaultValue ? "Y/n" : "y/N";
  const value = (await rl.question(`${label} [${suffix}]: `)).trim().toLowerCase();
  if (!value) {
    return defaultValue;
  }
  return ["y", "yes"].includes(value);
}

function toTitle(value) {
  return value
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
