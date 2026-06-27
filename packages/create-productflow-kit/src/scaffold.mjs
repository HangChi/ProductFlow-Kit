const JAVA_PACKAGE = "com.productflow.app";
const JAVA_ROOT = "backend/src/main/java/com/productflow/app";

export function buildProjectFiles(context) {
  const files = [
    file("productflow.template.json", generatedManifest(context)),
    file(".env.example", envExample(context)),
    file(".gitignore", generatedGitignore()),
    file("package.json", rootPackageJson(context)),
    file("docker-compose.yml", dockerCompose(context)),
    file("README.md", generatedReadmeEn(context)),
    file("README.zh-CN.md", generatedReadmeZh(context)),
    file("frontend/package.json", frontendPackageJson(context)),
    file("frontend/next.config.ts", nextConfig()),
    file("frontend/tsconfig.json", frontendTsConfig()),
    file("frontend/tailwind.config.ts", tailwindConfig()),
    file("frontend/postcss.config.mjs", postcssConfig()),
    file("frontend/app/globals.css", frontendGlobals()),
    file("frontend/app/layout.tsx", frontendLayout(context)),
    file("frontend/app/page.tsx", frontendDashboardPage(context)),
    file("frontend/app/prototype/page.tsx", frontendPrototypePage()),
    file("frontend/app/settings/page.tsx", frontendSettingsPage(context)),
    file("frontend/app/users/page.tsx", frontendUsersPage(context)),
    file("frontend/components/app-shell.tsx", frontendAppShell(context)),
    file("frontend/components/ui/badge.tsx", frontendBadge()),
    file("frontend/components/ui/button.tsx", frontendButton()),
    file("frontend/components/ui/card.tsx", frontendCard()),
    file("frontend/components/ui/input.tsx", frontendInput()),
    file("frontend/lib/api.ts", frontendApi(context)),
    file("frontend/lib/mock-data.ts", frontendMockData(context)),
    file("frontend/tests/smoke.test.mjs", frontendSmokeTest(context)),
    file("frontend/Dockerfile", frontendDockerfile()),
    file("backend/pom.xml", backendPom(context)),
    file("backend/Dockerfile", backendDockerfile()),
    file(`${JAVA_ROOT}/Application.java`, backendApplication()),
    file(`${JAVA_ROOT}/common/ApiResponse.java`, backendApiResponse()),
    file(`${JAVA_ROOT}/users/UserController.java`, backendUserController()),
    file("backend/src/main/resources/application.yml", backendApplicationYml(context)),
    file("backend/src/main/resources/db/migration/V1__init.sql", backendMigration(context)),
    file("backend/src/test/java/com/productflow/app/SmokeTest.java", backendSmokeTest(context)),
  ];

  if (has(context, "auth")) {
    files.push(file(`${JAVA_ROOT}/auth/AuthController.java`, backendAuthController()));
    files.push(file(`${JAVA_ROOT}/config/SecurityConfig.java`, backendSecurityConfig()));
  }

  if (has(context, "rbac")) {
    files.push(file(`${JAVA_ROOT}/roles/RoleController.java`, backendRoleController()));
    files.push(file("frontend/app/roles/page.tsx", frontendRolesPage()));
  }

  if (has(context, "ai")) {
    files.push(file("frontend/app/ai/page.tsx", frontendAiPage()));
    files.push(file(`${JAVA_ROOT}/ai/AiChatController.java`, backendAiChatController()));
    files.push(file(`${JAVA_ROOT}/ai/AiProvider.java`, backendAiProvider()));
    files.push(file(`${JAVA_ROOT}/ai/MockAiProvider.java`, backendMockAiProvider()));
  }

  if (has(context, "audit-log")) {
    files.push(file(`${JAVA_ROOT}/audit/AuditLogController.java`, backendAuditLogController()));
    files.push(file("frontend/app/audit/page.tsx", frontendAuditPage()));
  }

  if (has(context, "file-storage")) {
    files.push(file(`${JAVA_ROOT}/files/FileController.java`, backendFileController()));
    files.push(file("frontend/app/files/page.tsx", frontendFilesPage()));
  }

  if (has(context, "email")) {
    files.push(file(`${JAVA_ROOT}/email/EmailController.java`, backendEmailController()));
    files.push(file("frontend/app/email/page.tsx", frontendEmailPage()));
  }

  if (context.dataLayer === "jpa") {
    files.push(file(`${JAVA_ROOT}/users/UserEntity.java`, backendJpaUserEntity()));
    files.push(file(`${JAVA_ROOT}/users/UserRepository.java`, backendJpaUserRepository()));
    if (has(context, "rbac")) {
      files.push(file(`${JAVA_ROOT}/roles/RoleEntity.java`, backendJpaRoleEntity()));
      files.push(file(`${JAVA_ROOT}/roles/RoleRepository.java`, backendJpaRoleRepository()));
    }
  } else {
    files.push(file(`${JAVA_ROOT}/users/UserRecord.java`, backendMyBatisUserRecord()));
    files.push(file(`${JAVA_ROOT}/users/UserMapper.java`, backendMyBatisUserMapper()));
    if (has(context, "rbac")) {
      files.push(file(`${JAVA_ROOT}/roles/RoleRecord.java`, backendMyBatisRoleRecord()));
      files.push(file(`${JAVA_ROOT}/roles/RoleMapper.java`, backendMyBatisRoleMapper()));
    }
  }

  return files;
}

function file(path, content) {
  return { path, content };
}

function has(context, moduleId) {
  return context.modules.includes(moduleId);
}

function text(strings, ...values) {
  let output = "";
  for (let index = 0; index < strings.length; index += 1) {
    output += strings[index];
    if (index < values.length) output += values[index];
  }
  return `${output.replace(/^\n/, "").trimEnd()}\n`;
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function generatedManifest(context) {
  return json({
    id: context.template.id,
    name: context.template.name,
    description: context.template.description,
    stack: context.template.stack,
    modules: context.modules,
    dataLayer: context.dataLayer === "jpa" ? "jpa-flyway" : "mybatis-plus",
    variables: {
      appName: context.displayName,
      packageName: context.packageName,
      javaPackage: JAVA_PACKAGE,
      language: context.language,
    },
    postInstall: context.template.postInstall,
  });
}

function envExample(context) {
  return text`
APP_NAME=${context.displayName}
APP_URL=http://localhost:3000
API_URL=http://localhost:8080

POSTGRES_DB=productflow
POSTGRES_USER=productflow
POSTGRES_PASSWORD=productflow
DATABASE_URL=jdbc:postgresql://localhost:5432/productflow
DATABASE_USERNAME=productflow
DATABASE_PASSWORD=productflow

JWT_SECRET=replace-with-a-long-random-secret
AI_PROVIDER=mock
OPENAI_API_KEY=
SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
`;
}

function generatedGitignore() {
  return text`
node_modules/
.next/
target/
.env
.env.*
!.env.example
*.log
`;
}

function rootPackageJson(context) {
  return json({
    name: context.packageName,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: "docker compose up --build",
      "dev:frontend": "npm --prefix frontend run dev",
      "dev:backend": "mvn -f backend/pom.xml spring-boot:run",
      "test:frontend": "npm --prefix frontend test",
      "test:backend": "mvn -f backend/pom.xml test",
      test: "npm run test:frontend && npm run test:backend",
    },
    workspaces: ["frontend"],
  });
}

function dockerCompose() {
  return text`
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: \${POSTGRES_DB:-productflow}
      POSTGRES_USER: \${POSTGRES_USER:-productflow}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-productflow}
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER:-productflow}"]
      interval: 5s
      timeout: 5s
      retries: 10

  backend:
    build:
      context: ./backend
    environment:
      DATABASE_URL: jdbc:postgresql://postgres:5432/\${POSTGRES_DB:-productflow}
      DATABASE_USERNAME: \${POSTGRES_USER:-productflow}
      DATABASE_PASSWORD: \${POSTGRES_PASSWORD:-productflow}
      AI_PROVIDER: \${AI_PROVIDER:-mock}
      OPENAI_API_KEY: \${OPENAI_API_KEY:-}
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "8080:8080"

  frontend:
    build:
      context: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8080
    depends_on:
      - backend
    ports:
      - "3000:3000"

volumes:
  postgres-data:
`;
}

function generatedReadmeEn(context) {
  return text`
# ${context.displayName}

Generated with ProductFlow Kit.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS.
- Backend: Spring Boot, Java 21.
- Data layer: ${context.dataLayer === "jpa" ? "JPA + Flyway" : "MyBatis-Plus + Flyway"}.
- Database: PostgreSQL.
- Modules: ${context.modules.join(", ") || "none"}.

## Run Locally

\`\`\`bash
cp .env.example .env
docker compose up --build
\`\`\`

Frontend: http://localhost:3000

Backend: http://localhost:8080

## Useful Commands

\`\`\`bash
npm --prefix frontend run dev
mvn -f backend/pom.xml spring-boot:run
npm test
\`\`\`

## API Surface

- \`/api/auth/*\` when the auth module is enabled.
- \`/api/users/*\`.
- \`/api/roles/*\` when RBAC is enabled.
- \`/api/ai/chat\` when AI is enabled.
- \`/api/audit-logs\` when audit logs are enabled.
`;
}

function generatedReadmeZh(context) {
  return text`
# ${context.displayName}

本项目由 ProductFlow Kit 生成。

## 技术栈

- 前端：Next.js、React、TypeScript、Tailwind CSS。
- 后端：Spring Boot、Java 21。
- 数据层：${context.dataLayer === "jpa" ? "JPA + Flyway" : "MyBatis-Plus + Flyway"}。
- 数据库：PostgreSQL。
- 已启用模块：${context.modules.join("、") || "无"}。

## 本地运行

\`\`\`bash
cp .env.example .env
docker compose up --build
\`\`\`

前端：http://localhost:3000

后端：http://localhost:8080

## 常用命令

\`\`\`bash
npm --prefix frontend run dev
mvn -f backend/pom.xml spring-boot:run
npm test
\`\`\`
`;
}

function frontendPackageJson(context) {
  return json({
    name: `${context.packageName}-frontend`,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      lint: "next lint",
      test: "node --test tests/*.test.mjs",
    },
    dependencies: {
      "@next/env": "^15.3.0",
      "lucide-react": "^0.468.0",
      next: "^15.3.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    },
    devDependencies: {
      "@types/node": "^22.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      autoprefixer: "^10.4.20",
      eslint: "^9.0.0",
      "eslint-config-next": "^15.3.0",
      postcss: "^8.4.49",
      tailwindcss: "^3.4.17",
      typescript: "^5.7.0",
    },
  });
}

function nextConfig() {
  return text`
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
`;
}

function frontendTsConfig() {
  return json({
    compilerOptions: {
      target: "ES2017",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [{ name: "next" }],
      paths: {
        "@/*": ["./*"],
      },
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"],
  });
}

function tailwindConfig() {
  return text`
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#d6d9e0",
        ink: "#111827",
        muted: "#64748b",
        panel: "#ffffff",
        surface: "#f7f7f2",
        accent: "#0f766e",
        gold: "#b7791f",
        danger: "#b91c1c",
      },
      boxShadow: {
        soft: "0 14px 40px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
`;
}

function postcssConfig() {
  return text`
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
`;
}

function frontendGlobals() {
  return text`
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  background: #f7f7f2;
  color: #111827;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(15, 118, 110, 0.08), transparent 260px),
    #f7f7f2;
  font-family: Arial, Helvetica, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}
`;
}

function frontendLayout(context) {
  return text`
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${context.displayName}",
  description: "Generated by ProductFlow Kit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
}

function frontendAppShell(context) {
  return text`
import Link from "next/link";
import {
  Activity,
  Bot,
  Database,
  FileText,
  Home,
  Mail,
  Settings,
  Shield,
  Users,
} from "lucide-react";

const navigation = ${navigationItems(context)};

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-white/90 px-4 py-5 backdrop-blur lg:block">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">ProductFlow</p>
          <h1 className="mt-1 text-xl font-semibold text-ink">${context.displayName}</h1>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-surface hover:text-ink"
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="text-sm font-medium text-muted">${context.template.name}</p>
              <h2 className="text-2xl font-semibold text-ink">Workspace</h2>
            </div>
            <div className="rounded-md border border-border bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
              Local demo
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
`;
}

function navigationItems(context) {
  const items = [
    "{ href: '/', label: 'Dashboard', icon: Home }",
    "{ href: '/users', label: 'Users', icon: Users }",
  ];
  if (has(context, "rbac")) items.push("{ href: '/roles', label: 'Roles', icon: Shield }");
  if (has(context, "ai")) items.push("{ href: '/ai', label: 'AI Chat', icon: Bot }");
  if (has(context, "audit-log")) items.push("{ href: '/audit', label: 'Audit Logs', icon: Activity }");
  if (has(context, "file-storage")) items.push("{ href: '/files', label: 'Files', icon: FileText }");
  if (has(context, "email")) items.push("{ href: '/email', label: 'Email', icon: Mail }");
  items.push("{ href: '/prototype', label: 'Prototype', icon: Database }");
  items.push("{ href: '/settings', label: 'Settings', icon: Settings }");
  return `[\n  ${items.join(",\n  ")}\n]`;
}

function frontendDashboardPage(context) {
  const aiCard = has(context, "ai")
    ? text`
        <Card>
          <CardHeader>
            <CardTitle>AI usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-ink">1.8k</p>
            <p className="mt-2 text-sm text-muted">Mock provider calls this week</p>
          </CardContent>
        </Card>`
    : "";

  return text`
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activities, metrics } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardTitle>{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-ink">{metric.value}</p>
              <p className="mt-2 text-sm text-muted">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
${aiCard}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Operating rhythm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {["Acquisition", "Activation", "Retention"].map((stage) => (
                <div key={stage} className="rounded-md border border-border bg-surface p-4">
                  <p className="text-sm font-semibold text-ink">{stage}</p>
                  <p className="mt-2 text-sm text-muted">Mock workflow lane for product teams.</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{activity.title}</p>
                    <p className="text-sm text-muted">{activity.actor}</p>
                  </div>
                  <Badge>{activity.kind}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
`;
}

function frontendPrototypePage() {
  return text`
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prototypeSteps } from "@/lib/mock-data";

export default function PrototypePage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {prototypeSteps.map((step) => (
          <Card key={step.title}>
            <CardHeader>
              <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted">{step.description}</p>
              <div className="mt-4 h-2 rounded-full bg-surface">
                <div className="h-2 rounded-full bg-accent" style={{ width: step.progress }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
`;
}

function frontendSettingsPage(context) {
  return text`
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Workspace settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid max-w-2xl gap-4">
            <Input label="Workspace name" defaultValue="${context.displayName}" />
            <Input label="API base URL" defaultValue="http://localhost:8080" />
            <Input label="Enabled modules" defaultValue="${context.modules.join(", ")}" />
            <div>
              <Button type="button">Save settings</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
`;
}

function frontendUsersPage() {
  return text`
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/lib/mock-data";

export default function UsersPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Users</CardTitle>
            <Button type="button">Invite</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-surface text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {users.map((user) => (
                  <tr key={user.email}>
                    <td className="px-4 py-3 font-medium text-ink">{user.name}</td>
                    <td className="px-4 py-3 text-muted">{user.email}</td>
                    <td className="px-4 py-3 text-muted">{user.role}</td>
                    <td className="px-4 py-3"><Badge>{user.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
`;
}

function frontendRolesPage() {
  return text`
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { roles } from "@/lib/mock-data";

export default function RolesPage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardHeader>
              <CardTitle>{role.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted">{role.description}</p>
              <p className="mt-4 text-sm font-medium text-ink">{role.members} members</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
`;
}

function frontendAiPage() {
  return text`
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prompts } from "@/lib/mock-data";

export default function AiPage() {
  return (
    <AppShell>
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>AI chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-md bg-surface p-4 text-sm text-slate-700">
                Ask the mock provider to summarize product feedback.
              </div>
              <div className="rounded-md border border-border bg-white p-4 text-sm text-slate-700">
                The provider abstraction is ready. Set AI_PROVIDER and API keys in .env.
              </div>
              <div className="flex gap-3">
                <Input label="Message" placeholder="Summarize this week's usage" />
                <div className="pt-6">
                  <Button type="button">Send</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prompts.map((prompt) => (
                <div key={prompt.name} className="rounded-md border border-border p-3">
                  <p className="text-sm font-medium text-ink">{prompt.name}</p>
                  <p className="mt-1 text-sm text-muted">{prompt.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
`;
}

function frontendAuditPage() {
  return text`
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auditLogs } from "@/lib/mock-data";

export default function AuditPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Audit logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-ink">{log.action}</p>
                  <p className="text-sm text-muted">{log.actor} · {log.time}</p>
                </div>
                <Badge>{log.scope}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
`;
}

function frontendFilesPage() {
  return text`
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FilesPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Files</CardTitle>
            <Button type="button">Upload</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
            File storage module placeholder. Wire this to S3, R2, OSS, or local storage.
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
`;
}

function frontendEmailPage() {
  return text`
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function EmailPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Email preview</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid max-w-2xl gap-4">
            <Input label="Recipient" placeholder="founder@example.com" />
            <Input label="Subject" placeholder="Welcome to ProductFlow" />
            <Input label="Template key" placeholder="welcome" />
            <div>
              <Button type="button">Render preview</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
`;
}

function frontendBadge() {
  return text`
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-md border border-border bg-surface px-2 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}
`;
}

function frontendButton() {
  return text`
import type { ButtonHTMLAttributes } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={
        "inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60 " +
        className
      }
      {...props}
    />
  );
}
`;
}

function frontendCard() {
  return text`
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md border border-border bg-panel shadow-soft">{children}</div>;
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-border px-5 py-4">{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-ink">{children}</h3>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-4">{children}</div>;
}
`;
}

function frontendInput() {
  return text`
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        className={
          "h-10 rounded-md border border-border bg-white px-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-teal-100 " +
          className
        }
        {...props}
      />
    </label>
  );
}
`;
}

function frontendApi(context) {
  return text`
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(\`\${API_URL}\${path}\`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(\`Request failed: \${response.status}\`);
  }

  return response.json() as Promise<T>;
}

export const enabledModules = ${JSON.stringify(context.modules, null, 2)} as const;
`;
}

function frontendMockData(context) {
  return text`
export const metrics = [
  { label: "Revenue", value: "$42.8k", change: "+12.5% vs last month" },
  { label: "Active users", value: "8,240", change: "+842 this week" },
  { label: "Conversion", value: "7.6%", change: "Healthy funnel" },
  { label: "Open tasks", value: "31", change: "9 need attention" },
];

export const users = [
  { name: "Ada Chen", email: "ada@example.com", role: "Owner", status: "active" },
  { name: "Ben Miller", email: "ben@example.com", role: "Admin", status: "active" },
  { name: "Chris Zhou", email: "chris@example.com", role: "Member", status: "invited" },
];

export const roles = [
  { name: "Owner", description: "Full workspace and billing access.", members: 1 },
  { name: "Admin", description: "Can manage users, roles, and operations.", members: 3 },
  { name: "Member", description: "Can use product workflows and AI tools.", members: 24 },
];

export const activities = [
  { id: "act_1", title: "Workspace settings updated", actor: "Ada Chen", kind: "settings" },
  { id: "act_2", title: "Role policy changed", actor: "Ben Miller", kind: "rbac" },
  { id: "act_3", title: "Usage report generated", actor: "System", kind: "report" },
];

export const auditLogs = [
  { id: "log_1", action: "User invited", actor: "Ada Chen", scope: "auth", time: "10:24" },
  { id: "log_2", action: "Role permissions updated", actor: "Ben Miller", scope: "rbac", time: "09:18" },
  { id: "log_3", action: "AI prompt published", actor: "System", scope: "ai", time: "Yesterday" },
];

export const prompts = [
  { name: "Feedback summary", description: "Condense user feedback into themes and next actions." },
  { name: "Churn risk", description: "Explain account health signals and likely churn drivers." },
  { name: "Release note", description: "Turn shipped work into customer-facing release notes." },
];

export const prototypeSteps = [
  { title: "Discover", description: "Map user goals, entry points, and first-run intent.", progress: "88%" },
  { title: "Operate", description: "Model daily workflows across dashboard, users, and roles.", progress: "72%" },
  { title: "Automate", description: "Attach AI and system actions to repeatable product jobs.", progress: "64%" },
  { title: "Measure", description: "Review usage, audit logs, and lifecycle metrics.", progress: "78%" },
];

export const templateInfo = {
  id: "${context.template.id}",
  modules: ${JSON.stringify(context.modules)},
};
`;
}

function frontendSmokeTest(context) {
  return text`
import assert from "node:assert/strict";
import { test } from "node:test";

test("template metadata is generated", () => {
  assert.equal("${context.template.id}".length > 0, true);
  assert.equal(${JSON.stringify(context.modules)}.includes("ai"), ${has(context, "ai")});
});
`;
}

function frontendDockerfile() {
  return text`
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
`;
}

function backendPom(context) {
  const dependencies = [
    dependency("org.springframework.boot", "spring-boot-starter-web"),
    dependency("org.springframework.boot", "spring-boot-starter-validation"),
    dependency("org.postgresql", "postgresql", undefined, "runtime"),
    dependency("org.flywaydb", "flyway-core"),
    dependency("org.flywaydb", "flyway-database-postgresql"),
    dependency("org.springframework.boot", "spring-boot-starter-test", undefined, "test"),
  ];

  if (has(context, "auth")) {
    dependencies.splice(2, 0, dependency("org.springframework.boot", "spring-boot-starter-security"));
  }

  if (has(context, "email")) {
    dependencies.splice(2, 0, dependency("org.springframework.boot", "spring-boot-starter-mail"));
  }

  if (context.dataLayer === "jpa") {
    dependencies.splice(2, 0, dependency("org.springframework.boot", "spring-boot-starter-data-jpa"));
  } else {
    dependencies.splice(
      2,
      0,
      dependency("com.baomidou", "mybatis-plus-spring-boot3-starter", "3.5.9"),
    );
  }

  return text`
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.5.0</version>
    <relativePath/>
  </parent>

  <groupId>com.productflow</groupId>
  <artifactId>app</artifactId>
  <version>0.1.0</version>
  <name>${context.displayName}</name>
  <description>Generated ProductFlow Kit backend</description>

  <properties>
    <java.version>21</java.version>
  </properties>

  <dependencies>
${dependencies.join("\n")}
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
`;
}

function dependency(groupId, artifactId, version, scope) {
  return [
    "    <dependency>",
    `      <groupId>${groupId}</groupId>`,
    `      <artifactId>${artifactId}</artifactId>`,
    version ? `      <version>${version}</version>` : undefined,
    scope ? `      <scope>${scope}</scope>` : undefined,
    "    </dependency>",
  ]
    .filter(Boolean)
    .join("\n");
}

function backendDockerfile() {
  return text`
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
`;
}

function backendApplication() {
  return text`
package ${JAVA_PACKAGE};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
`;
}

function backendApiResponse() {
  return text`
package ${JAVA_PACKAGE}.common;

public record ApiResponse<T>(boolean success, T data, String message) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null);
    }

    public static <T> ApiResponse<T> message(String message) {
        return new ApiResponse<>(true, null, message);
    }
}
`;
}

function backendAuthController() {
  return text`
package ${JAVA_PACKAGE}.auth;

import ${JAVA_PACKAGE}.common.ApiResponse;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@RequestBody LoginRequest request) {
        return ApiResponse.ok(Map.of(
            "token", "dev-token",
            "email", request.email(),
            "expiresIn", 3600
        ));
    }

    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me() {
        return ApiResponse.ok(Map.of(
            "id", "usr_demo",
            "name", "Ada Chen",
            "email", "ada@example.com",
            "role", "Owner"
        ));
    }

    public record LoginRequest(String email, String password) {
    }
}
`;
}

function backendSecurityConfig() {
  return text`
package ${JAVA_PACKAGE}.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
            .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
`;
}

function backendUserController() {
  return text`
package ${JAVA_PACKAGE}.users;

import ${JAVA_PACKAGE}.common.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping
    public ApiResponse<List<UserDto>> listUsers() {
        return ApiResponse.ok(List.of(
            new UserDto("usr_ada", "Ada Chen", "ada@example.com", "Owner", "active"),
            new UserDto("usr_ben", "Ben Miller", "ben@example.com", "Admin", "active"),
            new UserDto("usr_chris", "Chris Zhou", "chris@example.com", "Member", "invited")
        ));
    }

    public record UserDto(String id, String name, String email, String role, String status) {
    }
}
`;
}

function backendRoleController() {
  return text`
package ${JAVA_PACKAGE}.roles;

import ${JAVA_PACKAGE}.common.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @GetMapping
    public ApiResponse<List<RoleDto>> listRoles() {
        return ApiResponse.ok(List.of(
            new RoleDto("owner", "Owner", "Full workspace and billing access"),
            new RoleDto("admin", "Admin", "Manage users, roles, and operations"),
            new RoleDto("member", "Member", "Use product workflows and AI tools")
        ));
    }

    public record RoleDto(String key, String name, String description) {
    }
}
`;
}

function backendAiChatController() {
  return text`
package ${JAVA_PACKAGE}.ai;

import ${JAVA_PACKAGE}.common.ApiResponse;
import java.time.Instant;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiChatController {
    private final AiProvider aiProvider;

    public AiChatController(AiProvider aiProvider) {
        this.aiProvider = aiProvider;
    }

    @PostMapping("/chat")
    public ApiResponse<ChatResponse> chat(@RequestBody ChatRequest request) {
        return ApiResponse.ok(new ChatResponse(aiProvider.complete(request.message()), Instant.now().toString()));
    }

    public record ChatRequest(String message) {
    }

    public record ChatResponse(String message, String createdAt) {
    }
}
`;
}

function backendAiProvider() {
  return text`
package ${JAVA_PACKAGE}.ai;

public interface AiProvider {
    String complete(String message);
}
`;
}

function backendMockAiProvider() {
  return text`
package ${JAVA_PACKAGE}.ai;

import org.springframework.stereotype.Component;

@Component
public class MockAiProvider implements AiProvider {
    @Override
    public String complete(String message) {
        return "Mock AI response for: " + message;
    }
}
`;
}

function backendAuditLogController() {
  return text`
package ${JAVA_PACKAGE}.audit;

import ${JAVA_PACKAGE}.common.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {
    @GetMapping
    public ApiResponse<List<AuditLogDto>> listAuditLogs() {
        return ApiResponse.ok(List.of(
            new AuditLogDto("log_1", "User invited", "Ada Chen", "auth"),
            new AuditLogDto("log_2", "Role permissions updated", "Ben Miller", "rbac"),
            new AuditLogDto("log_3", "AI prompt published", "System", "ai")
        ));
    }

    public record AuditLogDto(String id, String action, String actor, String scope) {
    }
}
`;
}

function backendFileController() {
  return text`
package ${JAVA_PACKAGE}.files;

import ${JAVA_PACKAGE}.common.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/files")
public class FileController {
    @GetMapping
    public ApiResponse<List<FileAssetDto>> listFiles() {
        return ApiResponse.ok(List.of(
            new FileAssetDto("file_1", "onboarding.csv", "text/csv", 4821),
            new FileAssetDto("file_2", "usage-report.pdf", "application/pdf", 108245)
        ));
    }

    public record FileAssetDto(String id, String name, String contentType, long size) {
    }
}
`;
}

function backendEmailController() {
  return text`
package ${JAVA_PACKAGE}.email;

import ${JAVA_PACKAGE}.common.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
public class EmailController {
    @PostMapping("/preview")
    public ApiResponse<EmailPreview> preview(@RequestBody EmailRequest request) {
        return ApiResponse.ok(new EmailPreview(
            request.to(),
            request.subject(),
            "Rendered template: " + request.templateKey()
        ));
    }

    public record EmailRequest(String to, String subject, String templateKey) {
    }

    public record EmailPreview(String to, String subject, String body) {
    }
}
`;
}

function backendJpaUserEntity() {
  return text`
package ${JAVA_PACKAGE}.users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "app_users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String status = "active";

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() {
        return id;
    }
}
`;
}

function backendJpaUserRepository() {
  return text`
package ${JAVA_PACKAGE}.users;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
}
`;
}

function backendJpaRoleEntity() {
  return text`
package ${JAVA_PACKAGE}.roles;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "roles")
public class RoleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String key;

    @Column(nullable = false)
    private String name;

    public Long getId() {
        return id;
    }
}
`;
}

function backendJpaRoleRepository() {
  return text`
package ${JAVA_PACKAGE}.roles;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
}
`;
}

function backendMyBatisUserRecord() {
  return text`
package ${JAVA_PACKAGE}.users;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.Instant;

@TableName("app_users")
public record UserRecord(
    @TableId Long id,
    String name,
    String email,
    String status,
    Instant createdAt
) {
}
`;
}

function backendMyBatisUserMapper() {
  return text`
package ${JAVA_PACKAGE}.users;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<UserRecord> {
}
`;
}

function backendMyBatisRoleRecord() {
  return text`
package ${JAVA_PACKAGE}.roles;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

@TableName("roles")
public record RoleRecord(
    @TableId Long id,
    String key,
    String name
) {
}
`;
}

function backendMyBatisRoleMapper() {
  return text`
package ${JAVA_PACKAGE}.roles;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface RoleMapper extends BaseMapper<RoleRecord> {
}
`;
}

function backendApplicationYml(context) {
  const jpaConfig =
    context.dataLayer === "jpa"
      ? text`
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
    properties:
      hibernate:
        format_sql: true`
      : "";

  const mybatisConfig =
    context.dataLayer === "mybatis"
      ? text`
mybatis-plus:
  configuration:
    map-underscore-to-camel-case: true`
      : "";

  const mailConfig = has(context, "email")
    ? text`
  mail:
    host: \${SMTP_HOST:localhost}
    port: \${SMTP_PORT:1025}
    username: \${SMTP_USERNAME:}
    password: \${SMTP_PASSWORD:}`
    : "";

  return text`
server:
  port: 8080

spring:
  application:
    name: ${context.packageName}
  datasource:
    url: \${DATABASE_URL:jdbc:postgresql://localhost:5432/productflow}
    username: \${DATABASE_USERNAME:productflow}
    password: \${DATABASE_PASSWORD:productflow}
  flyway:
    enabled: true
    locations: classpath:db/migration
${jpaConfig}${mailConfig}

productflow:
  template: ${context.template.id}
  data-layer: ${context.dataLayer}
  ai:
    provider: \${AI_PROVIDER:mock}

${mybatisConfig}
`;
}

function backendMigration(context) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS app_users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(240) NOT NULL UNIQUE,
  status VARCHAR(40) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
  ];

  if (has(context, "rbac")) {
    statements.push(`CREATE TABLE IF NOT EXISTS roles (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description TEXT
);`);
  }

  if (has(context, "audit-log")) {
    statements.push(`CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor VARCHAR(160) NOT NULL,
  action VARCHAR(240) NOT NULL,
  scope VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`);
  }

  if (has(context, "ai")) {
    statements.push(`CREATE TABLE IF NOT EXISTS ai_prompts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  prompt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`);
    statements.push(`CREATE TABLE IF NOT EXISTS ai_calls (
  id BIGSERIAL PRIMARY KEY,
  provider VARCHAR(80) NOT NULL,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`);
  }

  if (has(context, "file-storage")) {
    statements.push(`CREATE TABLE IF NOT EXISTS file_assets (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(240) NOT NULL,
  content_type VARCHAR(120) NOT NULL,
  size_bytes BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`);
  }

  if (has(context, "email")) {
    statements.push(`CREATE TABLE IF NOT EXISTS email_templates (
  id BIGSERIAL PRIMARY KEY,
  template_key VARCHAR(120) NOT NULL UNIQUE,
  subject VARCHAR(240) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`);
  }

  return `${statements.join("\n\n")}\n`;
}

function backendSmokeTest(context) {
  return text`
package ${JAVA_PACKAGE};

import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class SmokeTest {
    @Test
    void generatedProjectHasTemplateMetadata() {
        assertTrue("${context.template.id}".contains("${context.template.id.split("-")[0]}"));
    }
}
`;
}
