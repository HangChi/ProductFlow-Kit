import process from "node:process";
import { createInterface } from "node:readline/promises";
import {
  createProject,
  formatProjectSummary,
  loadTemplateManifests,
  parseModuleList,
} from "./generator.mjs";

const HELP = `
ProductFlow Kit

Usage:
  productflow create <app-name> [options]
  create-productflow-kit <app-name> [options]
  productflow list

Options:
  --template <id>     Template id. Run productflow list to see all templates
  --data <layer>      jpa | jpa-flyway | mybatis | mybatis-plus
  --modules <list>    Comma-separated modules, e.g. auth,rbac,ai,audit-log
  --language <value>  en | zh | bilingual
  --force             Allow writing into a non-empty target directory
  -h, --help          Show this help
`.trim();

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

  const options = await completeOptions(parsed, streams);
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
    force: false,
    help: false,
  };

  const first = tokens[0];
  if (first === "help" || first === "--help" || first === "-h") {
    parsed.help = true;
    return parsed;
  }

  if (first === "list") {
    parsed.command = "list";
    return parsed;
  }

  let index = 0;
  if (first === "create") {
    parsed.command = "create";
    index = 1;
  }

  while (index < tokens.length) {
    const token = tokens[index];

    if (token === "--force") {
      parsed.force = true;
      index += 1;
      continue;
    }

    if (token === "--help" || token === "-h") {
      parsed.help = true;
      index += 1;
      continue;
    }

    if (token.startsWith("--")) {
      const [name, inlineValue] = token.slice(2).split("=", 2);
      const value = inlineValue ?? tokens[index + 1];
      if (inlineValue === undefined) {
        index += 1;
      }

      if (name === "template") parsed.template = value;
      else if (name === "data") parsed.data = value;
      else if (name === "modules") parsed.modules = parseModuleList(value);
      else if (name === "language") parsed.language = value;
      else throw new Error(`Unknown option --${name}`);

      index += 1;
      continue;
    }

    if (!parsed.appName) {
      parsed.appName = token;
      index += 1;
      continue;
    }

    throw new Error(`Unexpected argument: ${token}`);
  }

  return parsed;
}

async function completeOptions(parsed, streams) {
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
    const appName = await rl.question("App name: ");
    if (!appName.trim()) {
      throw new Error("App name is required.");
    }

    const templates = loadTemplateManifests();
    const templateHint = templates.map((template) => template.id).join(" / ");
    const template =
      parsed.template || (await rl.question(`Template (${templateHint}) [saas-admin]: `)) || "saas-admin";
    const data = parsed.data || (await rl.question("Data layer (jpa / mybatis) [jpa]: ")) || "jpa";
    const modulesInput =
      parsed.modules ||
      parseModuleList(
        (await rl.question("Modules (comma-separated, blank for template defaults): ")) || undefined,
      );

    return {
      ...parsed,
      appName: appName.trim(),
      template: template.trim(),
      data: data.trim(),
      modules: modulesInput,
    };
  } finally {
    rl.close();
  }
}
