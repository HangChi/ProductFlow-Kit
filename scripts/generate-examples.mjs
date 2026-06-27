import path from "node:path";
import { fileURLToPath } from "node:url";
import { createProject } from "../packages/create-productflow-kit/src/generator.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const examples = [
  {
    appName: "saas-admin-jpa",
    targetDir: path.join(repoRoot, "examples", "saas-admin-jpa"),
    template: "saas-admin",
    data: "jpa",
    modules: ["auth", "rbac", "audit-log"],
  },
  {
    appName: "ai-saas-mybatis",
    targetDir: path.join(repoRoot, "examples", "ai-saas-mybatis"),
    template: "ai-saas",
    data: "mybatis",
    modules: ["auth", "rbac", "ai", "audit-log"],
  },
];

for (const example of examples) {
  const result = await createProject({ ...example, force: true });
  console.log(`Generated ${result.template.id} example at ${result.targetDir}`);
}
