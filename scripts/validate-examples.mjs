import http from "node:http";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import "./generate-examples.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const examples = [
  {
    id: "saas-admin-jpa",
    dir: path.join(repoRoot, "examples", "saas-admin-jpa"),
    project: "pfk-saas-admin-jpa",
  },
  {
    id: "ai-saas-mybatis",
    dir: path.join(repoRoot, "examples", "ai-saas-mybatis"),
    project: "pfk-ai-saas-mybatis",
  },
];

run(process.execPath, ["--test", "packages/create-productflow-kit/test/*.test.mjs"], repoRoot);
assertDockerAvailable();

for (const example of examples) {
  console.log(`\nValidating ${example.id}`);
  run("docker", ["compose", "-p", example.project, "down", "-v", "--remove-orphans"], example.dir, {
    allowFailure: true,
  });
  run("docker", ["compose", "-p", example.project, "build", "frontend"], example.dir);
  run("docker", ["run", "--rm", "-v", `${path.join(example.dir, "backend")}:/workspace`, "-w", "/workspace", "maven:3.9-eclipse-temurin-21", "mvn", "-q", "test", "package"], repoRoot);
  run("docker", ["compose", "-p", example.project, "up", "-d", "--build"], example.dir);

  try {
    await waitForHttp("http://127.0.0.1:8080/api/users", 90_000);
    await waitForHttp("http://127.0.0.1:3000", 90_000);
    run("docker", ["compose", "-p", example.project, "ps"], example.dir);
  } finally {
    run("docker", ["compose", "-p", example.project, "down", "-v", "--remove-orphans"], example.dir, {
      allowFailure: true,
    });
  }
}

console.log("\nExample validation completed.");

function assertDockerAvailable() {
  const result = spawnSync("docker", ["info"], {
    cwd: repoRoot,
    encoding: "utf8",
    shell: false,
  });

  if (result.status !== 0) {
    const detail = [result.stderr, result.stdout].filter(Boolean).join("\n").trim();
    throw new Error(
      [
        "Docker Engine is not running.",
        "Start Docker Desktop, wait for the Linux engine to be ready, then rerun `npm run examples:validate`.",
        detail,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }
}

function run(command, args, cwd, options = {}) {
  console.log(`> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0 && !options.allowFailure) {
    throw new Error(`Command failed with exit code ${result.status}: ${command} ${args.join(" ")}`);
  }
}

function waitForHttp(url, timeoutMs) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      request(url)
        .then(resolve)
        .catch((error) => {
          if (Date.now() - startedAt > timeoutMs) {
            reject(new Error(`Timed out waiting for ${url}: ${error.message}`));
            return;
          }
          setTimeout(attempt, 2_000);
        });
    };

    attempt();
  });
}

function request(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      res.resume();
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
        resolve();
      } else {
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    });

    req.setTimeout(5_000, () => {
      req.destroy(new Error("request timed out"));
    });
    req.on("error", reject);
  });
}
