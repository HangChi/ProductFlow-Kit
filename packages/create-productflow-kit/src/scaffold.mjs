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
    file("backend/pom.xml", backendPom(context)),
    file("backend/Dockerfile", backendDockerfile(context)),
    file(`${JAVA_ROOT}/Application.java`, backendApplication()),
    file(`${JAVA_ROOT}/auth/AuthenticatedUser.java`, backendAuthenticatedUser()),
    file(`${JAVA_ROOT}/common/ApiResponse.java`, backendApiResponse()),
    file(`${JAVA_ROOT}/audit/AuditLogService.java`, backendAuditLogService()),
    file(`${JAVA_ROOT}/users/UserController.java`, backendUserController(context)),
    file(`${JAVA_ROOT}/users/UserService.java`, backendUserService(context)),
    file("backend/src/main/resources/application.yml", backendApplicationYml(context)),
    file("backend/src/main/resources/db/migration/V1__init.sql", backendMigration(context)),
    file("backend/src/test/java/com/productflow/app/SmokeTest.java", backendSmokeTest(context)),
  ];

  if (frontendKind(context) === "next") {
    files.push(...nextFrontendFiles(context));
  }

  if (frontendKind(context) === "vue") {
    files.push(...vueFrontendFiles(context));
  }

  files.push(...blueprintFiles(context));

  if (has(context, "auth")) {
    files.push(file(`${JAVA_ROOT}/auth/AuthController.java`, backendAuthController()));
    files.push(file(`${JAVA_ROOT}/auth/AuthService.java`, backendAuthService(context)));
    files.push(file(`${JAVA_ROOT}/auth/SessionAuthFilter.java`, backendSessionAuthFilter()));
    files.push(file(`${JAVA_ROOT}/config/SecurityConfig.java`, backendSecurityConfig(context)));
  }

  if (has(context, "rbac")) {
    files.push(file(`${JAVA_ROOT}/roles/PermissionGuard.java`, backendPermissionGuard(context)));
    files.push(file(`${JAVA_ROOT}/roles/PermissionService.java`, backendPermissionService()));
    files.push(file(`${JAVA_ROOT}/roles/RoleController.java`, backendRoleController(context)));
    files.push(file(`${JAVA_ROOT}/roles/RoleService.java`, backendRoleService()));
    if (frontendKind(context) === "next") {
      files.push(file("frontend/app/roles/page.tsx", frontendRolesPage()));
    }
  }

  if (has(context, "ai")) {
    files.push(file(`${JAVA_ROOT}/ai/AiCallLogService.java`, backendAiCallLogService(context)));
    files.push(file(`${JAVA_ROOT}/ai/AiChatController.java`, backendAiChatController(context)));
    files.push(file(`${JAVA_ROOT}/ai/AiProvider.java`, backendAiProvider()));
    files.push(file(`${JAVA_ROOT}/ai/MockAiProvider.java`, backendMockAiProvider()));
    if (frontendKind(context) === "next") {
      files.push(file("frontend/app/ai/page.tsx", frontendAiPage()));
    }
  }

  if (has(context, "audit-log")) {
    files.push(file(`${JAVA_ROOT}/audit/AuditLogController.java`, backendAuditLogController(context)));
    if (frontendKind(context) === "next") {
      files.push(file("frontend/app/audit/page.tsx", frontendAuditPage()));
    }
  }

  if (has(context, "file-storage")) {
    files.push(file(`${JAVA_ROOT}/files/FileController.java`, backendFileController(context)));
    files.push(file(`${JAVA_ROOT}/files/FileStorageService.java`, backendFileStorageService(context)));
    if (frontendKind(context) === "next") {
      files.push(file("frontend/app/files/page.tsx", frontendFilesPage()));
    }
  }

  if (has(context, "email")) {
    files.push(file(`${JAVA_ROOT}/email/EmailController.java`, backendEmailController(context)));
    files.push(file(`${JAVA_ROOT}/email/EmailService.java`, backendEmailService(context)));
    if (frontendKind(context) === "next") {
      files.push(file("frontend/app/email/page.tsx", frontendEmailPage()));
    }
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

function frontendKind(context) {
  return context.template.blueprint?.frontend ?? "next";
}

function isBackendOnly(context) {
  return frontendKind(context) === "none";
}

function blueprintResources(context) {
  return context.template.blueprint?.resources ?? [];
}

function blueprintMetrics(context) {
  return (
    context.template.blueprint?.metrics ?? [
      { label: "Revenue", value: "$42.8k", change: "+12.5% vs last month" },
      { label: "Active users", value: "8,240", change: "+842 this week" },
      { label: "Conversion", value: "7.6%", change: "Healthy funnel" },
      { label: "Open tasks", value: "31", change: "9 need attention" },
    ]
  );
}

function nextFrontendFiles(context) {
  return [
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
    file("frontend/components/i18n.tsx", frontendI18n(context)),
    file("frontend/components/ui/badge.tsx", frontendBadge()),
    file("frontend/components/ui/button.tsx", frontendButton()),
    file("frontend/components/ui/card.tsx", frontendCard()),
    file("frontend/components/ui/input.tsx", frontendInput()),
    file("frontend/lib/api.ts", frontendApi(context)),
    file("frontend/lib/mock-data.ts", frontendMockData(context)),
    file("frontend/tests/smoke.test.mjs", frontendSmokeTest(context)),
    file("frontend/Dockerfile", frontendDockerfile(context)),
  ];
}

function vueFrontendFiles(context) {
  return [
    file("frontend/package.json", frontendPackageJson(context)),
    file("frontend/index.html", vueIndexHtml(context)),
    file("frontend/src/main.ts", vueMainTs()),
    file("frontend/src/App.vue", vueApp(context)),
    file("frontend/src/style.css", vueStyle()),
    file("frontend/tsconfig.json", vueTsConfig()),
    file("frontend/vite.config.ts", vueViteConfig()),
    file("frontend/tests/smoke.test.mjs", frontendSmokeTest(context)),
    file("frontend/Dockerfile", frontendDockerfile(context)),
  ];
}

function blueprintFiles(context) {
  const files = [];
  for (const resource of blueprintResources(context)) {
    files.push(file(`${JAVA_ROOT}/${resource.javaPackage}/${resource.className}Controller.java`, backendBlueprintController(resource)));
    if (frontendKind(context) === "next" && resource.route) {
      files.push(file(`frontend/app${resource.route}/page.tsx`, frontendBlueprintPage(resource)));
    }
  }
  return files;
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

function javaString(value) {
  return JSON.stringify(String(value));
}

function toSnakeCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
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
      frontendPort: context.frontendPort,
      backendPort: context.backendPort,
      databasePort: context.databasePort,
      databaseName: context.databaseName,
      packageManager: context.packageManager,
    },
    postInstall: context.template.postInstall,
  });
}

function envExample(context) {
  return text`
APP_NAME=${context.displayName}
APP_URL=http://localhost:${context.frontendPort}
API_URL=http://localhost:${context.backendPort}

POSTGRES_DB=${context.databaseName}
POSTGRES_USER=productflow
POSTGRES_PASSWORD=productflow
DATABASE_URL=jdbc:postgresql://localhost:${context.databasePort}/${context.databaseName}
DATABASE_USERNAME=productflow
DATABASE_PASSWORD=productflow
SERVER_PORT=${context.backendPort}

JWT_SECRET=replace-with-a-long-random-secret
AI_PROVIDER=mock
OPENAI_API_KEY=
FILE_STORAGE_DIR=uploads
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
  const scripts = {
    dev: "docker compose up --build",
    "dev:backend": "mvn -f backend/pom.xml spring-boot:run",
    "test:backend": "mvn -f backend/pom.xml test",
    test: "mvn -f backend/pom.xml test",
  };

  const workspaces = [];
  if (!isBackendOnly(context)) {
    scripts["dev:frontend"] = "npm --prefix frontend run dev";
    scripts["test:frontend"] = "npm --prefix frontend test";
    scripts.test = "npm run test:frontend && npm run test:backend";
    workspaces.push("frontend");
  }

  return json({
    name: context.packageName,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts,
    workspaces,
  });
}

function dockerCompose(context) {
  const frontendService = isBackendOnly(context)
    ? ""
    : text`

  frontend:
    build:
      context: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:${context.backendPort}
      VITE_API_URL: http://localhost:${context.backendPort}
    depends_on:
      - backend
    ports:
      - "${context.frontendPort}:${context.frontendPort}"`;

  return text`
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: \${POSTGRES_DB:-${context.databaseName}}
      POSTGRES_USER: \${POSTGRES_USER:-productflow}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-productflow}
    ports:
      - "${context.databasePort}:5432"
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
      SERVER_PORT: ${context.backendPort}
      DATABASE_URL: jdbc:postgresql://postgres:5432/\${POSTGRES_DB:-${context.databaseName}}
      DATABASE_USERNAME: \${POSTGRES_USER:-productflow}
      DATABASE_PASSWORD: \${POSTGRES_PASSWORD:-productflow}
      AI_PROVIDER: \${AI_PROVIDER:-mock}
      OPENAI_API_KEY: \${OPENAI_API_KEY:-}
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "${context.backendPort}:${context.backendPort}"
${frontendService}

volumes:
  postgres-data:
`;
}

function generatedReadmeEn(context) {
  const frontendLine = isBackendOnly(context)
    ? "- Frontend: none. This is a pure Spring Boot API starter."
    : `- Frontend: ${frontendKind(context) === "vue" ? "Vue 3, Vite, TypeScript" : "Next.js, React, TypeScript, Tailwind CSS"}.`;
  const resources = blueprintResources(context)
    .map((resource) => `- \`${resource.apiPath}\`: ${resource.title}.`)
    .join("\n");

  return text`
# ${context.displayName}

Generated with ProductFlow Kit.

## Stack

${frontendLine}
- Backend: Spring Boot, Java 21.
- Data layer: ${context.dataLayer === "jpa" ? "JPA + Flyway" : "MyBatis-Plus + Flyway"}.
- Database: PostgreSQL.
- Modules: ${context.modules.join(", ") || "none"}.

## Run Locally

\`\`\`bash
cp .env.example .env
docker compose up --build
\`\`\`

Frontend: http://localhost:${context.frontendPort}

Backend: http://localhost:${context.backendPort}

## Language

- Generated language mode: \`${context.language}\`.
- Use \`--language zh\`, \`--language en\`, or \`--language bilingual\`. Bilingual frontend projects include an in-app language switch.

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
${resources}
`;
}

function generatedReadmeZh(context) {
  const frontendLine = isBackendOnly(context)
    ? "- 前端：无。这是纯 Spring Boot API 模板。"
    : `- 前端：${frontendKind(context) === "vue" ? "Vue 3、Vite、TypeScript" : "Next.js、React、TypeScript、Tailwind CSS"}。`;
  const resources = blueprintResources(context)
    .map((resource) => `- \`${resource.apiPath}\`：${resource.title}。`)
    .join("\n");

  return text`
# ${context.displayName}

本项目由 ProductFlow Kit 生成。

## 技术栈

${frontendLine}
- 后端：Spring Boot、Java 21。
- 数据层：${context.dataLayer === "jpa" ? "JPA + Flyway" : "MyBatis-Plus + Flyway"}。
- 数据库：PostgreSQL。
- 已启用模块：${context.modules.join("、") || "无"}。

## 本地运行

\`\`\`bash
cp .env.example .env
docker compose up --build
\`\`\`

前端：http://localhost:${context.frontendPort}

后端：http://localhost:${context.backendPort}

## 语言

- 当前语言模式：\`${context.language}\`。
- 可使用 \`--language zh\`、\`--language en\` 或 \`--language bilingual\`。选择 \`bilingual\` 时，前端会生成页面内语言切换。

## 常用命令

\`\`\`bash
npm --prefix frontend run dev
mvn -f backend/pom.xml spring-boot:run
npm test
\`\`\`

## API

- \`/api/users/*\`
- \`/api/auth/*\`：启用 auth 模块时可用。
- \`/api/roles/*\`：启用 rbac 模块时可用。
- \`/api/ai/chat\`：启用 ai 模块时可用。
- \`/api/audit-logs\`：启用 audit-log 模块时可用。
${resources}
`;
}

function frontendPackageJson(context) {
  if (frontendKind(context) === "vue") {
    return json({
      name: `${context.packageName}-frontend`,
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        dev: `vite --host 0.0.0.0 --port ${context.frontendPort}`,
        build: "vue-tsc --noEmit && vite build",
        preview: `vite preview --host 0.0.0.0 --port ${context.frontendPort}`,
        test: "node --test tests/*.test.mjs",
      },
      dependencies: {
        "@vitejs/plugin-vue": "^5.2.1",
        vite: "^6.0.7",
        vue: "^3.5.13",
      },
      devDependencies: {
        typescript: "^5.7.0",
        "vue-tsc": "^2.2.0",
      },
    });
  }

  return json({
    name: `${context.packageName}-frontend`,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: `next dev -p ${context.frontendPort}`,
      build: "next build",
      start: `next start -p ${context.frontendPort}`,
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

function frontendDefaultLanguage(context) {
  return context.language === "en" ? "en" : "zh";
}

function i18nValue(en, zh = zhText(en)) {
  return `{ en: ${JSON.stringify(en)}, zh: ${JSON.stringify(zh)} }`;
}

function i18nNode(en, zh = zhText(en)) {
  return `<I18nText value={${i18nValue(en, zh)}} />`;
}

function i18nProp(en, zh = zhText(en)) {
  return `{${i18nValue(en, zh)}}`;
}

function zhText(en) {
  return zhDictionary()[en] ?? en;
}

function zhDictionary() {
  return {
    "Dashboard": "工作台",
    "Users": "用户",
    "Roles": "角色",
    "AI Chat": "AI 对话",
    "Audit Logs": "审计日志",
    "Files": "文件",
    "Email": "邮件",
    "Prototype": "原型",
    "Settings": "设置",
    "Workspace": "工作区",
    "Local demo": "本地演示",
    "AI usage": "AI 用量",
    "Mock provider calls this week": "本周模拟供应商调用",
    "Operating rhythm": "运营节奏",
    "Acquisition": "获客",
    "Activation": "激活",
    "Retention": "留存",
    "Mock workflow lane for product teams.": "面向产品团队的模拟工作流泳道。",
    "Activity": "动态",
    "Workspace settings": "工作区设置",
    "Workspace name": "工作区名称",
    "API base URL": "API 基础地址",
    "Enabled modules": "已启用模块",
    "Save settings": "保存设置",
    "Invite": "邀请",
    "Name": "姓名",
    "Role": "角色",
    "Status": "状态",
    "Owner": "所有者",
    "Admin": "管理员",
    "Member": "成员",
    "active": "启用",
    "invited": "已邀请",
    "members": "名成员",
    "AI chat": "AI 对话",
    "Ask the mock provider to summarize product feedback.": "让模拟供应商总结产品反馈。",
    "The provider abstraction is ready. Set AI_PROVIDER and API keys in .env.": "供应商抽象已准备好。可在 .env 中设置 AI_PROVIDER 和 API 密钥。",
    "Message": "消息",
    "Send": "发送",
    "Prompt library": "提示词库",
    "Audit logs": "审计日志",
    "Files": "文件",
    "Upload": "上传",
    "File storage module placeholder. Wire this to S3, R2, OSS, or local storage.": "文件存储模块占位。可接入 S3、R2、OSS 或本地存储。",
    "Email preview": "邮件预览",
    "Recipient": "收件人",
    "Subject": "主题",
    "Template key": "模板键",
    "Render preview": "生成预览",
    "Prompt library": "提示词库",
    "Feedback summary": "反馈总结",
    "Condense user feedback into themes and next actions.": "将用户反馈压缩为主题和下一步动作。",
    "Churn risk": "流失风险",
    "Explain account health signals and likely churn drivers.": "解释账户健康信号和可能的流失原因。",
    "Release note": "发布说明",
    "Turn shipped work into customer-facing release notes.": "把已发布工作转成面向客户的发布说明。",
    "Workspace settings updated": "工作区设置已更新",
    "Role policy changed": "角色策略已变更",
    "Usage report generated": "用量报告已生成",
    "settings": "设置",
    "rbac": "权限",
    "report": "报告",
    "User invited": "用户已邀请",
    "Role permissions updated": "角色权限已更新",
    "AI prompt published": "AI 提示词已发布",
    "auth": "认证",
    "ai": "AI",
    "Yesterday": "昨天",
    "Discover": "发现",
    "Map user goals, entry points, and first-run intent.": "梳理用户目标、入口和首次使用意图。",
    "Operate": "运营",
    "Model daily workflows across dashboard, users, and roles.": "建模工作台、用户与角色中的日常流程。",
    "Automate": "自动化",
    "Attach AI and system actions to repeatable product jobs.": "把 AI 和系统动作接入可重复的产品任务。",
    "Measure": "衡量",
    "Review usage, audit logs, and lifecycle metrics.": "查看用量、审计日志和生命周期指标。",
    "Full workspace and billing access.": "拥有工作区和计费的完整权限。",
    "Can manage users, roles, and operations.": "可管理用户、角色和运营流程。",
    "Can use product workflows and AI tools.": "可使用产品流程和 AI 工具。",
    "Create": "创建",
    "Vue admin workspace": "Vue 管理工作区",
    "Dashboard": "工作台",
    "Settings": "设置",
    "Revenue": "收入",
    "Active users": "活跃用户",
    "Conversion": "转化率",
    "Open tasks": "待办任务",
    "+12.5% vs last month": "较上月 +12.5%",
    "+842 this week": "本周 +842",
    "Healthy funnel": "漏斗健康",
    "9 need attention": "9 项需要关注",
    "Operators": "运营人员",
    "Jobs": "任务",
    "Incidents": "事件",
    "Automation": "自动化",
    "12 online": "12 人在线",
    "29 pending": "29 项待处理",
    "2 urgent": "2 项紧急",
    "Healthy": "健康",
    "Accounts": "客户",
    "Deals": "商机",
    "Activities": "活动",
    "Contacts": "联系人",
    "Pipeline": "销售管道",
    "Stage": "阶段",
    "Value": "金额",
    "Close date": "预计成交",
    "Owner": "负责人",
    "New account": "新建客户",
    "New deal": "新建商机",
    "Log activity": "记录活动",
    "Articles": "文章",
    "Publishing calendar": "发布日历",
    "Collections": "合集",
    "Title": "标题",
    "Channel": "渠道",
    "Publish date": "发布日期",
    "Editor": "编辑",
    "Status": "状态",
    "New article": "新建文章",
    "Schedule content": "安排内容",
    "Create collection": "创建合集",
    "Knowledge articles": "知识文章",
    "Search feedback": "搜索反馈",
    "Help collections": "帮助合集",
    "Category": "分类",
    "Question": "问题",
    "Result quality": "结果质量",
    "Create article": "新建文章",
    "Review feedback": "查看反馈",
    "Approval requests": "审批请求",
    "Approval rules": "审批规则",
    "Request": "请求",
    "Requester": "申请人",
    "Approver": "审批人",
    "Policy": "策略",
    "Priority": "优先级",
    "Open request": "发起申请",
    "New rule": "新建规则",
    "Leads": "线索",
    "Company": "公司",
    "Source": "来源",
    "Plan": "套餐",
    "New lead": "新建线索",
    "API keys": "API 密钥",
    "Webhooks": "Webhook",
    "Usage events": "用量事件",
    "Key": "密钥",
    "Endpoint": "端点",
    "Event": "事件",
    "Last used": "最近使用",
    "Create key": "创建密钥",
    "Add webhook": "添加 Webhook",
    "Run job": "运行任务",
    "Open incident": "创建事件",
    "Teams": "团队",
    "Team": "团队",
    "Coverage": "覆盖范围",
    "Schedule": "计划",
    "Incident": "事件",
    "Severity": "严重级别"
  };
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
    <html lang="${frontendDefaultLanguage(context) === "zh" ? "zh-CN" : "en"}">
      <body>{children}</body>
    </html>
  );
}
`;
}

function frontendI18n(context) {
  return text`
"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

type Language = "en" | "zh";
type LanguageMode = Language | "bilingual";

export type LocalizedText = string | { en: string; zh: string };

const languageMode = ${JSON.stringify(context.language)} as LanguageMode;
const defaultLanguage = ${JSON.stringify(frontendDefaultLanguage(context))} as Language;
const storageKey = "productflow-language";

const zhDictionary: Record<string, string> = ${JSON.stringify(zhDictionary(), null, 2)};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
}>({
  language: defaultLanguage,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    if (languageMode !== "bilingual") {
      return;
    }

    const stored = window.localStorage.getItem(storageKey);
    if (stored === "en" || stored === "zh") {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.language = language;

    if (languageMode === "bilingual") {
      window.localStorage.setItem(storageKey, language);
    }
  }, [language]);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(languageMode === "bilingual" ? nextLanguage : defaultLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function resolveText(value: LocalizedText, language: Language) {
  if (typeof value !== "string") {
    return value[language];
  }

  return language === "zh" ? zhDictionary[value] ?? value : value;
}

export function I18nText({ value }: { value: LocalizedText }) {
  const { language } = useLanguage();
  return <>{resolveText(value, language)}</>;
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  if (languageMode !== "bilingual") {
    return null;
  }

  return (
    <div className="inline-flex rounded-md border border-border bg-white p-1 text-sm shadow-sm" aria-label="Language">
      {(["en", "zh"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={
            "h-8 rounded px-3 font-medium transition " +
            (language === option ? "bg-accent text-white" : "text-slate-600 hover:bg-surface hover:text-ink")
          }
        >
          {option === "en" ? "EN" : "中文"}
        </button>
      ))}
    </div>
  );
}
`;
}

function frontendAppShell(context) {
  return text`
"use client";

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
import { I18nText, LanguageProvider, LanguageToggle } from "@/components/i18n";

const navigation = ${navigationItems(context)};

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
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
                  <I18nText value={item.label} />
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="lg:pl-64">
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
            <header className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="text-sm font-medium text-muted">${context.template.name}</p>
                <h2 className="text-2xl font-semibold text-ink">${i18nNode("Workspace", "工作区")}</h2>
              </div>
              <div className="flex items-center gap-3">
                <LanguageToggle />
                <div className="rounded-md border border-border bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                  ${i18nNode("Local demo", "本地演示")}
                </div>
              </div>
            </header>
            {children}
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
}
`;
}

function navigationItems(context) {
  const items = [
    "{ href: '/', label: 'Dashboard', icon: Home }",
    "{ href: '/users', label: 'Users', icon: Users }",
  ];
  for (const resource of blueprintResources(context)) {
    if (resource.route) {
      items.push(`{ href: '${resource.route}', label: '${resource.navLabel ?? resource.title}', icon: Database }`);
    }
  }
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
            <CardTitle>${i18nNode("AI usage", "AI 用量")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-ink">1.8k</p>
            <p className="mt-2 text-sm text-muted">${i18nNode("Mock provider calls this week", "本周模拟供应商调用")}</p>
          </CardContent>
        </Card>`
    : "";

  return text`
import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activities, metrics } from "@/lib/mock-data";

const stages = [
  {
    label: ${i18nValue("Acquisition", "获客")},
    description: ${i18nValue("Mock workflow lane for product teams.", "面向产品团队的模拟工作流泳道。")},
  },
  {
    label: ${i18nValue("Activation", "激活")},
    description: ${i18nValue("Mock workflow lane for product teams.", "面向产品团队的模拟工作流泳道。")},
  },
  {
    label: ${i18nValue("Retention", "留存")},
    description: ${i18nValue("Mock workflow lane for product teams.", "面向产品团队的模拟工作流泳道。")},
  },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardTitle><I18nText value={metric.label} /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-ink">{metric.value}</p>
              <p className="mt-2 text-sm text-muted"><I18nText value={metric.change} /></p>
            </CardContent>
          </Card>
        ))}
${aiCard}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>${i18nNode("Operating rhythm", "运营节奏")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              {stages.map((stage) => (
                <div key={stage.label.en} className="rounded-md border border-border bg-surface p-4">
                  <p className="text-sm font-semibold text-ink"><I18nText value={stage.label} /></p>
                  <p className="mt-2 text-sm text-muted"><I18nText value={stage.description} /></p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>${i18nNode("Activity", "动态")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink"><I18nText value={activity.title} /></p>
                    <p className="text-sm text-muted">{activity.actor}</p>
                  </div>
                  <Badge><I18nText value={activity.kind} /></Badge>
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
import { I18nText } from "@/components/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prototypeSteps } from "@/lib/mock-data";

export default function PrototypePage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {prototypeSteps.map((step) => (
          <Card key={step.title}>
            <CardHeader>
              <CardTitle><I18nText value={step.title} /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted"><I18nText value={step.description} /></p>
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
import { I18nText } from "@/components/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>${i18nNode("Workspace settings", "工作区设置")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid max-w-2xl gap-4">
            <Input label=${i18nProp("Workspace name", "工作区名称")} defaultValue="${context.displayName}" />
            <Input label=${i18nProp("API base URL", "API 基础地址")} defaultValue="http://localhost:${context.backendPort}" />
            <Input label=${i18nProp("Enabled modules", "已启用模块")} defaultValue="${context.modules.join(", ")}" />
            <div>
              <Button type="button"><I18nText value=${i18nProp("Save settings", "保存设置")} /></Button>
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
import { I18nText } from "@/components/i18n";
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
            <CardTitle>${i18nNode("Users", "用户")}</CardTitle>
            <Button type="button">${i18nNode("Invite", "邀请")}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-surface text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">${i18nNode("Name", "姓名")}</th>
                  <th className="px-4 py-3 font-medium">${i18nNode("Email", "邮箱")}</th>
                  <th className="px-4 py-3 font-medium">${i18nNode("Role", "角色")}</th>
                  <th className="px-4 py-3 font-medium">${i18nNode("Status", "状态")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {users.map((user) => (
                  <tr key={user.email}>
                    <td className="px-4 py-3 font-medium text-ink">{user.name}</td>
                    <td className="px-4 py-3 text-muted">{user.email}</td>
                    <td className="px-4 py-3 text-muted"><I18nText value={user.role} /></td>
                    <td className="px-4 py-3"><Badge><I18nText value={user.status} /></Badge></td>
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
import { I18nText } from "@/components/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { roles } from "@/lib/mock-data";

export default function RolesPage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardHeader>
              <CardTitle><I18nText value={role.name} /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted"><I18nText value={role.description} /></p>
              <p className="mt-4 text-sm font-medium text-ink">{role.members} <I18nText value="members" /></p>
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
import { I18nText } from "@/components/i18n";
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
            <CardTitle>${i18nNode("AI chat", "AI 对话")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="rounded-md bg-surface p-4 text-sm text-slate-700">
                ${i18nNode("Ask the mock provider to summarize product feedback.", "让模拟供应商总结产品反馈。")}
              </div>
              <div className="rounded-md border border-border bg-white p-4 text-sm text-slate-700">
                ${i18nNode("The provider abstraction is ready. Set AI_PROVIDER and API keys in .env.", "供应商抽象已准备好。可在 .env 中设置 AI_PROVIDER 和 API 密钥。")}
              </div>
              <div className="flex gap-3">
                <Input label=${i18nProp("Message", "消息")} placeholder="Summarize this week's usage" />
                <div className="pt-6">
                  <Button type="button">${i18nNode("Send", "发送")}</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>${i18nNode("Prompt library", "提示词库")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prompts.map((prompt) => (
                <div key={prompt.name} className="rounded-md border border-border p-3">
                  <p className="text-sm font-medium text-ink"><I18nText value={prompt.name} /></p>
                  <p className="mt-1 text-sm text-muted"><I18nText value={prompt.description} /></p>
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
import { I18nText } from "@/components/i18n";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auditLogs } from "@/lib/mock-data";

export default function AuditPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>${i18nNode("Audit logs", "审计日志")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-md border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-ink"><I18nText value={log.action} /></p>
                  <p className="text-sm text-muted">{log.actor} / <I18nText value={log.time} /></p>
                </div>
                <Badge><I18nText value={log.scope} /></Badge>
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
import { I18nText } from "@/components/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FilesPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>${i18nNode("Files", "文件")}</CardTitle>
            <Button type="button">${i18nNode("Upload", "上传")}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
            ${i18nNode("File storage module placeholder. Wire this to S3, R2, OSS, or local storage.", "文件存储模块占位。可接入 S3、R2、OSS 或本地存储。")}
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
import { I18nText } from "@/components/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function EmailPage() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>${i18nNode("Email preview", "邮件预览")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid max-w-2xl gap-4">
            <Input label=${i18nProp("Recipient", "收件人")} placeholder="founder@example.com" />
            <Input label=${i18nProp("Subject", "主题")} placeholder="Welcome to ProductFlow" />
            <Input label=${i18nProp("Template key", "模板键")} placeholder="welcome" />
            <div>
              <Button type="button">${i18nNode("Render preview", "生成预览")}</Button>
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
import { I18nText, type LocalizedText } from "@/components/i18n";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: LocalizedText;
};

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <I18nText value={label} />
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

function vueIndexHtml(context) {
  return text`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${context.displayName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`;
}

function vueMainTs() {
  return text`
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

createApp(App).mount("#app");
`;
}

function vueApp(context) {
  const resources = blueprintResources(context);
  return text`
<script setup lang="ts">
import { ref } from "vue";

type Language = "en" | "zh";

const languageMode = ${JSON.stringify(context.language)};
const defaultLanguage = ${JSON.stringify(frontendDefaultLanguage(context))} as Language;
const zhDictionary: Record<string, string> = ${JSON.stringify(zhDictionary(), null, 2)};
const metrics = ${JSON.stringify(blueprintMetrics(context), null, 2)};
const resources = ${JSON.stringify(resources, null, 2)};
const language = ref<Language>(defaultLanguage);

if (languageMode === "bilingual") {
  const stored = window.localStorage.getItem("productflow-language");
  if (stored === "en" || stored === "zh") {
    language.value = stored;
  }
}

function setLanguage(nextLanguage: Language) {
  language.value = languageMode === "bilingual" ? nextLanguage : defaultLanguage;
  document.documentElement.lang = language.value === "zh" ? "zh-CN" : "en";
  document.documentElement.dataset.language = language.value;

  if (languageMode === "bilingual") {
    window.localStorage.setItem("productflow-language", language.value);
  }
}

function t(value: string) {
  return language.value === "zh" ? zhDictionary[value] ?? value : value;
}

setLanguage(language.value);
</script>

<template>
  <main class="shell">
    <aside class="sidebar">
      <p class="eyebrow">ProductFlow</p>
      <h1>${context.displayName}</h1>
      <nav>
        <a href="#dashboard">{{ t("Dashboard") }}</a>
        <a v-for="resource in resources" :key="resource.id" :href="'#' + resource.id">
          {{ t(resource.navLabel || resource.title) }}
        </a>
        <a href="#settings">{{ t("Settings") }}</a>
      </nav>
    </aside>

    <section class="content">
      <header class="topbar">
        <div>
          <p class="eyebrow">${context.template.name}</p>
          <h2>{{ t("Vue admin workspace") }}</h2>
        </div>
        <div class="topbar-actions">
          <div v-if="languageMode === 'bilingual'" class="language-toggle" aria-label="Language">
            <button :class="{ active: language === 'en' }" type="button" @click="setLanguage('en')">EN</button>
            <button :class="{ active: language === 'zh' }" type="button" @click="setLanguage('zh')">中文</button>
          </div>
          <span class="badge">{{ t("Local demo") }}</span>
        </div>
      </header>

      <section id="dashboard" class="metrics">
        <article v-for="metric in metrics" :key="metric.label" class="card">
          <p class="label">{{ t(metric.label) }}</p>
          <strong>{{ metric.value }}</strong>
          <span>{{ t(metric.change) }}</span>
        </article>
      </section>

      <section v-for="resource in resources" :id="resource.id" :key="resource.id" class="panel">
        <div class="panel-header">
          <div>
            <h3>{{ t(resource.title) }}</h3>
            <p>{{ t(resource.description) }}</p>
          </div>
          <button>{{ t(resource.actionLabel || "Create") }}</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th v-for="field in resource.fields" :key="field.name">{{ t(field.label) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sample in resource.samples" :key="JSON.stringify(sample)">
                <td v-for="field in resource.fields" :key="field.name">{{ sample[field.name] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  </main>
</template>
`;
}

function vueStyle() {
  return text`
:root {
  color: #111827;
  background: #f7f7f2;
  font-family: Arial, Helvetica, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
}

.sidebar {
  border-right: 1px solid #d6d9e0;
  background: rgba(255, 255, 255, 0.92);
  padding: 24px 18px;
}

.sidebar h1 {
  margin: 4px 0 28px;
  font-size: 22px;
}

.sidebar nav {
  display: grid;
  gap: 6px;
}

.sidebar a {
  color: #475569;
  border-radius: 6px;
  padding: 10px 12px;
  text-decoration: none;
}

.sidebar a:hover {
  background: #f7f7f2;
  color: #111827;
}

.content {
  padding: 24px;
}

.topbar {
  align-items: center;
  border-bottom: 1px solid #d6d9e0;
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 18px;
}

.topbar h2 {
  margin: 0;
}

.topbar-actions {
  align-items: center;
  display: flex;
  gap: 12px;
}

.language-toggle {
  background: #ffffff;
  border: 1px solid #d6d9e0;
  border-radius: 6px;
  display: inline-flex;
  gap: 4px;
  padding: 4px;
}

.language-toggle button {
  background: transparent;
  color: #475569;
  height: 32px;
  padding: 0 12px;
}

.language-toggle button.active {
  background: #0f766e;
  color: #ffffff;
}

.eyebrow {
  color: #0f766e;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin: 0;
  text-transform: uppercase;
}

.badge {
  border: 1px solid #d6d9e0;
  border-radius: 6px;
  background: #ffffff;
  padding: 8px 12px;
}

.metrics {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 24px;
}

.card,
.panel {
  background: #ffffff;
  border: 1px solid #d6d9e0;
  border-radius: 8px;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.08);
}

.card {
  padding: 18px;
}

.card strong {
  display: block;
  font-size: 30px;
  margin: 8px 0;
}

.label,
.card span,
.panel p {
  color: #64748b;
}

.panel {
  margin-bottom: 20px;
}

.panel-header {
  align-items: center;
  border-bottom: 1px solid #d6d9e0;
  display: flex;
  justify-content: space-between;
  padding: 18px;
}

.panel-header h3 {
  margin: 0 0 6px;
}

button {
  background: #0f766e;
  border: 0;
  border-radius: 6px;
  color: #ffffff;
  font-weight: 700;
  height: 40px;
  padding: 0 16px;
}

.table-wrap {
  overflow: auto;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border-bottom: 1px solid #d6d9e0;
  padding: 12px 16px;
  text-align: left;
}

th {
  background: #f7f7f2;
  color: #475569;
  font-weight: 700;
}

@media (max-width: 900px) {
  .shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`;
}

function vueTsConfig() {
  return json({
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      module: "ESNext",
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      skipLibCheck: true,
      moduleResolution: "Bundler",
      allowImportingTsExtensions: true,
      isolatedModules: true,
      moduleDetection: "force",
      noEmit: true,
      jsx: "preserve",
      strict: true,
    },
    include: ["src/**/*.ts", "src/**/*.vue"],
  });
}

function vueViteConfig() {
  return text`
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
`;
}

function frontendApi(context) {
  return text`
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:${context.backendPort}";

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

function frontendBlueprintPage(resource) {
  const columns = resource.fields.map((field) => ({
    key: field.name,
    label: field.label,
  }));
  const rows = resource.samples.map((sample, index) => ({
    id: `${resource.id}_${index + 1}`,
    ...sample,
  }));

  return text`
import { AppShell } from "@/components/app-shell";
import { I18nText } from "@/components/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const columns: Array<{ key: string; label: string }> = ${JSON.stringify(columns, null, 2)};
const rows: Array<Record<string, string>> = ${JSON.stringify(rows, null, 2)};

export default function ${resource.className}Page() {
  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>${i18nNode(resource.title, zhText(resource.title))}</CardTitle>
              <p className="mt-1 text-sm text-muted">${i18nNode(resource.description, zhText(resource.description))}</p>
            </div>
            <Button type="button">${i18nNode(resource.actionLabel ?? "Create", zhText(resource.actionLabel ?? "Create"))}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-surface text-slate-600">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className="px-4 py-3 font-medium"><I18nText value={column.label} /></th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-white">
                {rows.map((row) => (
                  <tr key={row.id}>
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-slate-700">{row[column.key]}</td>
                    ))}
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

function frontendMockData(context) {
  const metrics = blueprintMetrics(context);
  return text`
export const metrics = ${JSON.stringify(metrics, null, 2)};

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

function frontendDockerfile(context) {
  if (frontendKind(context) === "vue") {
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
EXPOSE ${context.frontendPort}
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "${context.frontendPort}"]
`;
  }

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
EXPOSE ${context.frontendPort}
CMD ["npm", "run", "start"]
`;
}

function backendPom(context) {
  const dependencies = [
    dependency("org.springframework.boot", "spring-boot-starter-web"),
    dependency("org.springframework.boot", "spring-boot-starter-jdbc"),
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

function backendDockerfile(context) {
  return text`
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE ${context.backendPort}
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

function backendBlueprintController(resource) {
  const recordFields = resource.fields.map((field) => `String ${field.name}`).join(", ");
  const rows = resource.samples
    .map((sample, index) => {
      const values = resource.fields
        .map((field) => javaString(sample[field.name] ?? ""))
        .join(", ");
      return `            new ${resource.className}Dto("${resource.id}_${index + 1}", ${values})`;
    })
    .join(",\n");

  return text`
package ${JAVA_PACKAGE}.${resource.javaPackage};

import ${JAVA_PACKAGE}.common.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${resource.apiPath}")
public class ${resource.className}Controller {
    @GetMapping
    public ApiResponse<List<${resource.className}Dto>> list${resource.className}() {
        return ApiResponse.ok(List.of(
${rows}
        ));
    }

    public record ${resource.className}Dto(String id, ${recordFields}) {
    }
}
`;
}

function backendAuthenticatedUser() {
  return text`
package ${JAVA_PACKAGE}.auth;

public record AuthenticatedUser(Long id, String name, String email, String roleKey, String status) {
    public boolean isActive() {
        return "active".equalsIgnoreCase(status);
    }
}
`;
}

function backendAuthController() {
  return text`
package ${JAVA_PACKAGE}.auth;

import ${JAVA_PACKAGE}.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<AuthService.SessionResponse> register(@Valid @RequestBody AuthService.RegisterRequest request) {
        return ApiResponse.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthService.SessionResponse> login(@Valid @RequestBody AuthService.LoginRequest request) {
        return ApiResponse.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ApiResponse<AuthenticatedUser> me(Authentication authentication) {
        return ApiResponse.ok(currentUser(authentication));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestHeader(value = "Authorization", required = false) String authorization) {
        authService.logout(extractToken(authorization));
        return ApiResponse.ok(null);
    }

    private AuthenticatedUser currentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return user;
    }

    private String extractToken(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bearer token required");
        }
        return authorization.substring("Bearer ".length());
    }
}
`;
}

function backendAuthService(context) {
  const authoritiesForUser = has(context, "rbac")
    ? text`
    public List<GrantedAuthority> authoritiesFor(AuthenticatedUser user) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.roleKey().toUpperCase(Locale.ROOT)));
        jdbc.sql("""
            SELECT permission_key
            FROM role_permissions
            WHERE role_key = :roleKey
            """)
            .param("roleKey", user.roleKey())
            .query(String.class)
            .list()
            .forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission)));
        return authorities;
    }`
    : text`
    public List<GrantedAuthority> authoritiesFor(AuthenticatedUser user) {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.roleKey().toUpperCase(Locale.ROOT)));
    }`;

  return text`
package ${JAVA_PACKAGE}.auth;

import ${JAVA_PACKAGE}.audit.AuditLogService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final JdbcClient jdbc;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public AuthService(JdbcClient jdbc, PasswordEncoder passwordEncoder, AuditLogService auditLogService) {
        this.jdbc = jdbc;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public SessionResponse register(RegisterRequest request) {
        if (findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        Long userId = jdbc.sql("""
            INSERT INTO app_users (name, email, password_hash, role_key, status)
            VALUES (:name, :email, :passwordHash, 'member', 'active')
            RETURNING id
            """)
            .param("name", request.name())
            .param("email", request.email().toLowerCase(Locale.ROOT))
            .param("passwordHash", passwordEncoder.encode(request.password()))
            .query(Long.class)
            .single();

        AuthenticatedUser user = findUserById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User was not created"));
        auditLogService.record(user, "User registered", "auth", "email=" + user.email());
        return createSession(user);
    }

    @Transactional
    public SessionResponse login(LoginRequest request) {
        UserWithPassword user = findByEmail(request.email())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.passwordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        if (!"active".equalsIgnoreCase(user.status())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not active");
        }

        AuthenticatedUser authenticatedUser = new AuthenticatedUser(
            user.id(),
            user.name(),
            user.email(),
            user.roleKey(),
            user.status()
        );
        auditLogService.record(authenticatedUser, "User logged in", "auth", "email=" + user.email());
        return createSession(authenticatedUser);
    }

    @Transactional
    public void logout(String token) {
        jdbc.sql("""
            UPDATE auth_sessions
            SET revoked_at = NOW()
            WHERE token = :token AND revoked_at IS NULL
            """)
            .param("token", token)
            .update();
    }

    public Optional<AuthenticatedUser> findUserByToken(String token) {
        return jdbc.sql("""
            SELECT u.id, u.name, u.email, u.role_key AS roleKey, u.status
            FROM auth_sessions s
            JOIN app_users u ON u.id = s.user_id
            WHERE s.token = :token
              AND s.revoked_at IS NULL
              AND s.expires_at > NOW()
              AND u.status = 'active'
            """)
            .param("token", token)
            .query(AuthenticatedUser.class)
            .optional();
    }

${authoritiesForUser}

    private SessionResponse createSession(AuthenticatedUser user) {
        String token = UUID.randomUUID().toString().replace("-", "");
        Instant expiresAt = Instant.now().plus(Duration.ofHours(8));

        jdbc.sql("""
            INSERT INTO auth_sessions (token, user_id, expires_at)
            VALUES (:token, :userId, :expiresAt)
            """)
            .param("token", token)
            .param("userId", user.id())
            .param("expiresAt", expiresAt)
            .update();

        return new SessionResponse(token, user, expiresAt);
    }

    private Optional<UserWithPassword> findByEmail(String email) {
        return jdbc.sql("""
            SELECT id, name, email, role_key AS roleKey, status, password_hash AS passwordHash
            FROM app_users
            WHERE lower(email) = lower(:email)
            """)
            .param("email", email)
            .query(UserWithPassword.class)
            .optional();
    }

    private Optional<AuthenticatedUser> findUserById(Long id) {
        return jdbc.sql("""
            SELECT id, name, email, role_key AS roleKey, status
            FROM app_users
            WHERE id = :id
            """)
            .param("id", id)
            .query(AuthenticatedUser.class)
            .optional();
    }

    public record RegisterRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank String password
    ) {
    }

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {
    }

    public record SessionResponse(String token, AuthenticatedUser user, Instant expiresAt) {
    }

    private record UserWithPassword(
        Long id,
        String name,
        String email,
        String roleKey,
        String status,
        String passwordHash
    ) {
    }
}
`;
}

function backendSessionAuthFilter() {
  return text`
package ${JAVA_PACKAGE}.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class SessionAuthFilter extends OncePerRequestFilter {
    private final AuthService authService;

    public SessionAuthFilter(AuthService authService) {
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring("Bearer ".length());
            authService.findUserByToken(token).ifPresent(user -> {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    user,
                    token,
                    authService.authoritiesFor(user)
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            });
        }

        filterChain.doFilter(request, response);
    }
}
`;
}

function backendSecurityConfig(context) {
  return text`
package ${JAVA_PACKAGE}.config;

import ${JAVA_PACKAGE}.auth.SessionAuthFilter;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, SessionAuthFilter sessionAuthFilter) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(sessionAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:${context.frontendPort}", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
`;
}

function backendUserController(context) {
  const authImports = has(context, "auth")
    ? text`
import ${JAVA_PACKAGE}.auth.AuthenticatedUser;
import org.springframework.security.core.Authentication;`
    : "";
  const rbacImports = has(context, "rbac")
    ? text`
import ${JAVA_PACKAGE}.roles.PermissionGuard;`
    : "";
  const guardField = has(context, "rbac")
    ? text`
    private final PermissionGuard permissionGuard;`
    : "";
  const constructorArgs = has(context, "rbac") ? "UserService userService, PermissionGuard permissionGuard" : "UserService userService";
  const constructorBody = has(context, "rbac")
    ? text`
        this.userService = userService;
        this.permissionGuard = permissionGuard;`
    : text`
        this.userService = userService;`;
  const authParam = has(context, "auth") ? ", Authentication authentication" : "";
  const actorArg = has(context, "auth") ? "actor(authentication)" : "null";
  const actorHelper = has(context, "auth")
    ? text`
    private AuthenticatedUser actor(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof AuthenticatedUser user) {
            return user;
        }
        return null;
    }`
    : "";
  const requireRead = has(context, "rbac") ? "        permissionGuard.require(\"users:read\");\n" : "";
  const requireWrite = has(context, "rbac") ? "        permissionGuard.require(\"users:write\");\n" : "";

  return text`
package ${JAVA_PACKAGE}.users;

import ${JAVA_PACKAGE}.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
${authImports}${rbacImports}

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
${guardField}

    public UserController(${constructorArgs}) {
${constructorBody}
    }

    @GetMapping
    public ApiResponse<List<UserService.UserDto>> listUsers() {
${requireRead}        return ApiResponse.ok(userService.listUsers());
    }

    @PostMapping
    public ApiResponse<UserService.UserDto> createUser(
        @Valid @RequestBody UserService.CreateUserRequest request${authParam}
    ) {
${requireWrite}        return ApiResponse.ok(userService.createUser(request, ${actorArg}));
    }

    @PutMapping("/{id}")
    public ApiResponse<UserService.UserDto> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UserService.UpdateUserRequest request${authParam}
    ) {
${requireWrite}        return ApiResponse.ok(userService.updateUser(id, request, ${actorArg}));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id${authParam}) {
${requireWrite}        userService.disableUser(id, ${actorArg});
        return ApiResponse.ok(null);
    }

${actorHelper}
}
`;
}

function backendUserService(context) {
  const passwordEncoderImport = has(context, "auth")
    ? text`
import org.springframework.security.crypto.password.PasswordEncoder;`
    : "";
  const passwordField = has(context, "auth")
    ? text`
    private final PasswordEncoder passwordEncoder;`
    : "";
  const constructorArgs = has(context, "auth")
    ? "JdbcClient jdbc, AuditLogService auditLogService, PasswordEncoder passwordEncoder"
    : "JdbcClient jdbc, AuditLogService auditLogService";
  const constructorBody = has(context, "auth")
    ? text`
        this.jdbc = jdbc;
        this.auditLogService = auditLogService;
        this.passwordEncoder = passwordEncoder;`
    : text`
        this.jdbc = jdbc;
        this.auditLogService = auditLogService;`;
  const passwordHashLine = has(context, "auth")
    ? "String passwordHash = passwordEncoder.encode(request.password() == null || request.password().isBlank() ? \"password\" : request.password());"
    : "String passwordHash = \"{noop}\" + (request.password() == null || request.password().isBlank() ? \"password\" : request.password());";

  return text`
package ${JAVA_PACKAGE}.users;

import ${JAVA_PACKAGE}.audit.AuditLogService;
import ${JAVA_PACKAGE}.auth.AuthenticatedUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
${passwordEncoderImport}import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final JdbcClient jdbc;
    private final AuditLogService auditLogService;
${passwordField}

    public UserService(${constructorArgs}) {
${constructorBody}
    }

    public List<UserDto> listUsers() {
        return jdbc.sql("""
            SELECT id, name, email, role_key AS roleKey, status, created_at AS createdAt
            FROM app_users
            ORDER BY created_at DESC
            """)
            .query(UserDto.class)
            .list();
    }

    @Transactional
    public UserDto createUser(CreateUserRequest request, AuthenticatedUser actor) {
        ${passwordHashLine}
        Long id = jdbc.sql("""
            INSERT INTO app_users (name, email, password_hash, role_key, status)
            VALUES (:name, :email, :passwordHash, :roleKey, :status)
            RETURNING id
            """)
            .param("name", request.name())
            .param("email", request.email().toLowerCase(Locale.ROOT))
            .param("passwordHash", passwordHash)
            .param("roleKey", normalizeRole(request.roleKey()))
            .param("status", request.status() == null || request.status().isBlank() ? "active" : request.status())
            .query(Long.class)
            .single();

        UserDto user = getUser(id);
        auditLogService.record(actor, "User created", "users", "userId=" + user.id());
        return user;
    }

    @Transactional
    public UserDto updateUser(Long id, UpdateUserRequest request, AuthenticatedUser actor) {
        UserDto existing = getUser(id);
        jdbc.sql("""
            UPDATE app_users
            SET name = :name,
                role_key = :roleKey,
                status = :status,
                updated_at = NOW()
            WHERE id = :id
            """)
            .param("id", id)
            .param("name", request.name() == null || request.name().isBlank() ? existing.name() : request.name())
            .param("roleKey", request.roleKey() == null || request.roleKey().isBlank() ? existing.roleKey() : normalizeRole(request.roleKey()))
            .param("status", request.status() == null || request.status().isBlank() ? existing.status() : request.status())
            .update();

        UserDto user = getUser(id);
        auditLogService.record(actor, "User updated", "users", "userId=" + user.id());
        return user;
    }

    @Transactional
    public void disableUser(Long id, AuthenticatedUser actor) {
        getUser(id);
        jdbc.sql("""
            UPDATE app_users
            SET status = 'disabled', updated_at = NOW()
            WHERE id = :id
            """)
            .param("id", id)
            .update();
        auditLogService.record(actor, "User disabled", "users", "userId=" + id);
    }

    private UserDto getUser(Long id) {
        return jdbc.sql("""
            SELECT id, name, email, role_key AS roleKey, status, created_at AS createdAt
            FROM app_users
            WHERE id = :id
            """)
            .param("id", id)
            .query(UserDto.class)
            .optional()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private String normalizeRole(String roleKey) {
        return roleKey == null || roleKey.isBlank() ? "member" : roleKey.toLowerCase(Locale.ROOT);
    }

    public record UserDto(Long id, String name, String email, String roleKey, String status, Instant createdAt) {
    }

    public record CreateUserRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        String password,
        String roleKey,
        String status
    ) {
    }

    public record UpdateUserRequest(String name, String roleKey, String status) {
    }
}
`;
}

function backendRoleController(context) {
  const authImport = has(context, "auth")
    ? text`
import org.springframework.security.core.Authentication;`
    : "";
  const authParam = has(context, "auth") ? ", Authentication authentication" : "";

  return text`
package ${JAVA_PACKAGE}.roles;

import ${JAVA_PACKAGE}.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
${authImport}

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    private final RoleService roleService;
    private final PermissionService permissionService;
    private final PermissionGuard permissionGuard;

    public RoleController(RoleService roleService, PermissionService permissionService, PermissionGuard permissionGuard) {
        this.roleService = roleService;
        this.permissionService = permissionService;
        this.permissionGuard = permissionGuard;
    }

    @GetMapping
    public ApiResponse<List<RoleService.RoleDto>> listRoles() {
        permissionGuard.require("roles:read");
        return ApiResponse.ok(roleService.listRoles());
    }

    @PostMapping
    public ApiResponse<RoleService.RoleDto> createRole(@Valid @RequestBody RoleService.SaveRoleRequest request${authParam}) {
        permissionGuard.require("roles:write");
        return ApiResponse.ok(roleService.createRole(request));
    }

    @PutMapping("/{roleKey}")
    public ApiResponse<RoleService.RoleDto> updateRole(
        @PathVariable String roleKey,
        @Valid @RequestBody RoleService.SaveRoleRequest request${authParam}
    ) {
        permissionGuard.require("roles:write");
        return ApiResponse.ok(roleService.updateRole(roleKey, request));
    }

    @GetMapping("/permissions")
    public ApiResponse<List<PermissionService.PermissionDto>> listPermissions() {
        permissionGuard.require("roles:read");
        return ApiResponse.ok(permissionService.listPermissions());
    }

    @GetMapping("/menu")
    public ApiResponse<List<PermissionService.MenuItemDto>> listMenu() {
        return ApiResponse.ok(permissionService.listMenu());
    }
}
`;
}

function backendRoleService() {
  return text`
package ${JAVA_PACKAGE}.roles;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RoleService {
    private final JdbcClient jdbc;

    public RoleService(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<RoleDto> listRoles() {
        return jdbc.sql("""
            SELECT r.role_key AS roleKey,
                   r.name,
                   r.description,
                   COUNT(u.id) AS memberCount
            FROM roles r
            LEFT JOIN app_users u ON u.role_key = r.role_key AND u.status <> 'disabled'
            GROUP BY r.role_key, r.name, r.description
            ORDER BY r.role_key
            """)
            .query(RoleDto.class)
            .list();
    }

    @Transactional
    public RoleDto createRole(SaveRoleRequest request) {
        String roleKey = normalize(request.roleKey());
        jdbc.sql("""
            INSERT INTO roles (role_key, name, description)
            VALUES (:roleKey, :name, :description)
            """)
            .param("roleKey", roleKey)
            .param("name", request.name())
            .param("description", request.description())
            .update();

        replacePermissions(roleKey, request.permissions());
        return getRole(roleKey);
    }

    @Transactional
    public RoleDto updateRole(String roleKey, SaveRoleRequest request) {
        String normalized = normalize(roleKey);
        jdbc.sql("""
            UPDATE roles
            SET name = :name,
                description = :description
            WHERE role_key = :roleKey
            """)
            .param("roleKey", normalized)
            .param("name", request.name())
            .param("description", request.description())
            .update();

        replacePermissions(normalized, request.permissions());
        return getRole(normalized);
    }

    private RoleDto getRole(String roleKey) {
        return jdbc.sql("""
            SELECT r.role_key AS roleKey,
                   r.name,
                   r.description,
                   COUNT(u.id) AS memberCount
            FROM roles r
            LEFT JOIN app_users u ON u.role_key = r.role_key AND u.status <> 'disabled'
            WHERE r.role_key = :roleKey
            GROUP BY r.role_key, r.name, r.description
            """)
            .param("roleKey", roleKey)
            .query(RoleDto.class)
            .optional()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found"));
    }

    private void replacePermissions(String roleKey, List<String> permissions) {
        jdbc.sql("DELETE FROM role_permissions WHERE role_key = :roleKey")
            .param("roleKey", roleKey)
            .update();

        if (permissions == null) {
            return;
        }

        for (String permission : permissions) {
            jdbc.sql("""
                INSERT INTO role_permissions (role_key, permission_key)
                VALUES (:roleKey, :permission)
                ON CONFLICT DO NOTHING
                """)
                .param("roleKey", roleKey)
                .param("permission", permission)
                .update();
        }
    }

    private String normalize(String roleKey) {
        if (roleKey == null || roleKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role key is required");
        }
        return roleKey.toLowerCase(Locale.ROOT);
    }

    public record RoleDto(String roleKey, String name, String description, long memberCount) {
    }

    public record SaveRoleRequest(
        @NotBlank String roleKey,
        @NotBlank String name,
        String description,
        List<String> permissions
    ) {
    }
}
`;
}

function backendPermissionService() {
  return text`
package ${JAVA_PACKAGE}.roles;

import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

@Service
public class PermissionService {
    private final JdbcClient jdbc;

    public PermissionService(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<PermissionDto> listPermissions() {
        return jdbc.sql("""
            SELECT permission_key AS permissionKey, name, description
            FROM permissions
            ORDER BY permission_key
            """)
            .query(PermissionDto.class)
            .list();
    }

    public List<MenuItemDto> listMenu() {
        return List.of(
            new MenuItemDto("dashboard", "Dashboard", "/", "dashboard:view"),
            new MenuItemDto("users", "Users", "/users", "users:read"),
            new MenuItemDto("roles", "Roles", "/roles", "roles:read"),
            new MenuItemDto("ai", "AI Chat", "/ai", "ai:use"),
            new MenuItemDto("files", "Files", "/files", "files:write"),
            new MenuItemDto("email", "Email", "/email", "email:send"),
            new MenuItemDto("audit", "Audit Logs", "/audit", "audit:read"),
            new MenuItemDto("settings", "Settings", "/settings", "settings:write")
        );
    }

    public boolean userHasPermission(Long userId, String permission) {
        Long count = jdbc.sql("""
            SELECT COUNT(*)
            FROM app_users u
            JOIN role_permissions rp ON rp.role_key = u.role_key
            WHERE u.id = :userId AND rp.permission_key = :permission
            """)
            .param("userId", userId)
            .param("permission", permission)
            .query(Long.class)
            .single();
        return count != null && count > 0;
    }

    public record PermissionDto(String permissionKey, String name, String description) {
    }

    public record MenuItemDto(String key, String label, String path, String permission) {
    }
}
`;
}

function backendPermissionGuard(context) {
  if (!has(context, "auth")) {
    return text`
package ${JAVA_PACKAGE}.roles;

import org.springframework.stereotype.Service;

@Service
public class PermissionGuard {
    public void require(String permission) {
        // Templates without auth expose RBAC metadata but do not enforce request permissions.
    }
}
`;
  }

  return text`
package ${JAVA_PACKAGE}.roles;

import ${JAVA_PACKAGE}.auth.AuthenticatedUser;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PermissionGuard {
    private final PermissionService permissionService;

    public PermissionGuard(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    public void require(String permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        if (!permissionService.userHasPermission(user.id(), permission)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Missing permission: " + permission);
        }
    }
}
`;
}

function backendAiChatController(context) {
  const authImports = has(context, "auth")
    ? text`
import ${JAVA_PACKAGE}.auth.AuthenticatedUser;
import org.springframework.security.core.Authentication;`
    : "";
  const authParam = has(context, "auth") ? ", Authentication authentication" : "";
  const actorArg = has(context, "auth") ? "actor(authentication)" : "null";
  const actorHelper = has(context, "auth")
    ? text`
    private AuthenticatedUser actor(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof AuthenticatedUser user) {
            return user;
        }
        return null;
    }`
    : "";
  const rbacField = has(context, "rbac")
    ? text`
    private final ${JAVA_PACKAGE}.roles.PermissionGuard permissionGuard;`
    : "";
  const constructorArgs = has(context, "rbac")
    ? `AiProvider aiProvider, AiCallLogService aiCallLogService, ${JAVA_PACKAGE}.roles.PermissionGuard permissionGuard`
    : "AiProvider aiProvider, AiCallLogService aiCallLogService";
  const constructorBody = has(context, "rbac")
    ? text`
        this.aiProvider = aiProvider;
        this.aiCallLogService = aiCallLogService;
        this.permissionGuard = permissionGuard;`
    : text`
        this.aiProvider = aiProvider;
        this.aiCallLogService = aiCallLogService;`;
  const requireAi = has(context, "rbac") ? "        permissionGuard.require(\"ai:use\");\n" : "";

  return text`
package ${JAVA_PACKAGE}.ai;

import ${JAVA_PACKAGE}.common.ApiResponse;
import java.time.Instant;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
${authImports}

@RestController
@RequestMapping("/api/ai")
public class AiChatController {
    private final AiProvider aiProvider;
    private final AiCallLogService aiCallLogService;
${rbacField}

    public AiChatController(${constructorArgs}) {
${constructorBody}
    }

    @PostMapping("/chat")
    public ApiResponse<ChatResponse> chat(@Valid @RequestBody ChatRequest request${authParam}) {
${requireAi}        String response = aiProvider.complete(request.message());
        aiCallLogService.record(${actorArg}, "mock", request.message(), response);
        return ApiResponse.ok(new ChatResponse(response, Instant.now().toString()));
    }

    public record ChatRequest(String message) {
    }

    public record ChatResponse(String message, String createdAt) {
    }

${actorHelper}
}
`;
}

function backendAiCallLogService(context) {
  return text`
package ${JAVA_PACKAGE}.ai;

import ${JAVA_PACKAGE}.audit.AuditLogService;
import ${JAVA_PACKAGE}.auth.AuthenticatedUser;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AiCallLogService {
    private final JdbcClient jdbc;
    private final AuditLogService auditLogService;

    public AiCallLogService(JdbcClient jdbc, AuditLogService auditLogService) {
        this.jdbc = jdbc;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public void record(AuthenticatedUser actor, String provider, String prompt, String response) {
        jdbc.sql("""
            INSERT INTO ai_calls (user_id, provider, prompt, response, prompt_tokens, completion_tokens)
            VALUES (:userId, :provider, :prompt, :response, :promptTokens, :completionTokens)
            """)
            .param("userId", actor == null ? null : actor.id())
            .param("provider", provider)
            .param("prompt", prompt)
            .param("response", response)
            .param("promptTokens", estimateTokens(prompt))
            .param("completionTokens", estimateTokens(response))
            .update();
        auditLogService.record(actor, "AI chat completed", "ai", "provider=" + provider);
    }

    private int estimateTokens(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }
        return Math.max(1, value.length() / 4);
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

function backendAuditLogService() {
  return text`
package ${JAVA_PACKAGE}.audit;

import ${JAVA_PACKAGE}.auth.AuthenticatedUser;
import java.time.Instant;
import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {
    private final JdbcClient jdbc;

    public AuditLogService(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<AuditLogDto> listLogs() {
        return jdbc.sql("""
            SELECT id,
                   actor_email AS actorEmail,
                   action,
                   scope,
                   metadata,
                   created_at AS createdAt
            FROM audit_logs
            ORDER BY created_at DESC
            LIMIT 100
            """)
            .query(AuditLogDto.class)
            .list();
    }

    @Transactional
    public void record(AuthenticatedUser actor, String action, String scope, String metadata) {
        jdbc.sql("""
            INSERT INTO audit_logs (actor_user_id, actor_email, action, scope, metadata)
            VALUES (:actorUserId, :actorEmail, :action, :scope, :metadata)
            """)
            .param("actorUserId", actor == null ? null : actor.id())
            .param("actorEmail", actor == null ? "system" : actor.email())
            .param("action", action)
            .param("scope", scope)
            .param("metadata", metadata)
            .update();
    }

    public record AuditLogDto(
        Long id,
        String actorEmail,
        String action,
        String scope,
        String metadata,
        Instant createdAt
    ) {
    }
}
`;
}

function backendAuditLogController(context) {
  const guardField = has(context, "rbac")
    ? text`
    private final ${JAVA_PACKAGE}.roles.PermissionGuard permissionGuard;`
    : "";
  const constructorArgs = has(context, "rbac")
    ? `AuditLogService auditLogService, ${JAVA_PACKAGE}.roles.PermissionGuard permissionGuard`
    : "AuditLogService auditLogService";
  const constructorBody = has(context, "rbac")
    ? text`
        this.auditLogService = auditLogService;
        this.permissionGuard = permissionGuard;`
    : text`
        this.auditLogService = auditLogService;`;
  const requireAudit = has(context, "rbac") ? "        permissionGuard.require(\"audit:read\");\n" : "";

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
    private final AuditLogService auditLogService;
${guardField}

    public AuditLogController(${constructorArgs}) {
${constructorBody}
    }

    @GetMapping
    public ApiResponse<List<AuditLogService.AuditLogDto>> listAuditLogs() {
${requireAudit}        return ApiResponse.ok(auditLogService.listLogs());
    }
}
`;
}

function backendFileController(context) {
  const authImports = has(context, "auth")
    ? text`
import ${JAVA_PACKAGE}.auth.AuthenticatedUser;
import org.springframework.security.core.Authentication;`
    : "";
  const authParam = has(context, "auth") ? ", Authentication authentication" : "";
  const actorArg = has(context, "auth") ? "actor(authentication)" : "null";
  const actorHelper = has(context, "auth")
    ? text`
    private AuthenticatedUser actor(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof AuthenticatedUser user) {
            return user;
        }
        return null;
    }`
    : "";
  const guardField = has(context, "rbac")
    ? text`
    private final ${JAVA_PACKAGE}.roles.PermissionGuard permissionGuard;`
    : "";
  const constructorArgs = has(context, "rbac")
    ? `FileStorageService fileStorageService, ${JAVA_PACKAGE}.roles.PermissionGuard permissionGuard`
    : "FileStorageService fileStorageService";
  const constructorBody = has(context, "rbac")
    ? text`
        this.fileStorageService = fileStorageService;
        this.permissionGuard = permissionGuard;`
    : text`
        this.fileStorageService = fileStorageService;`;
  const requireRead = has(context, "rbac") ? "        permissionGuard.require(\"files:read\");\n" : "";
  const requireWrite = has(context, "rbac") ? "        permissionGuard.require(\"files:write\");\n" : "";

  return text`
package ${JAVA_PACKAGE}.files;

import ${JAVA_PACKAGE}.common.ApiResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
${authImports}

@RestController
@RequestMapping("/api/files")
public class FileController {
    private final FileStorageService fileStorageService;
${guardField}

    public FileController(${constructorArgs}) {
${constructorBody}
    }

    @GetMapping
    public ApiResponse<List<FileStorageService.FileAssetDto>> listFiles() {
${requireRead}        return ApiResponse.ok(fileStorageService.listFiles());
    }

    @PostMapping
    public ApiResponse<FileStorageService.FileAssetDto> upload(
        @RequestParam("file") MultipartFile file${authParam}
    ) throws IOException {
${requireWrite}        return ApiResponse.ok(fileStorageService.store(file, ${actorArg}));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {
${requireRead}        FileStorageService.DownloadableFile asset = fileStorageService.loadAsResource(id);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(asset.name()).build().toString())
            .header(HttpHeaders.CONTENT_TYPE, asset.contentType())
            .body(asset.resource());
    }

${actorHelper}
}
`;
}

function backendFileStorageService(context) {
  return text`
package ${JAVA_PACKAGE}.files;

import ${JAVA_PACKAGE}.audit.AuditLogService;
import ${JAVA_PACKAGE}.auth.AuthenticatedUser;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class FileStorageService {
    private final JdbcClient jdbc;
    private final AuditLogService auditLogService;
    private final Path storageDir;

    public FileStorageService(
        JdbcClient jdbc,
        AuditLogService auditLogService,
        @Value("\${productflow.files.storage-dir:uploads}") String storageDir
    ) {
        this.jdbc = jdbc;
        this.auditLogService = auditLogService;
        this.storageDir = Path.of(storageDir).toAbsolutePath().normalize();
    }

    public List<FileAssetDto> listFiles() {
        return jdbc.sql("""
            SELECT id,
                   name,
                   content_type AS contentType,
                   size_bytes AS sizeBytes,
                   '/api/files/' || id || '/download' AS downloadUrl,
                   created_at AS createdAt
            FROM file_assets
            ORDER BY created_at DESC
            """)
            .query(FileAssetDto.class)
            .list();
    }

    @Transactional
    public FileAssetDto store(MultipartFile file, AuthenticatedUser actor) throws IOException {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }

        Files.createDirectories(storageDir);
        String originalName = sanitize(file.getOriginalFilename());
        String storageName = UUID.randomUUID() + "-" + originalName;
        Path destination = storageDir.resolve(storageName).normalize();
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        Long id = jdbc.sql("""
            INSERT INTO file_assets (owner_user_id, name, content_type, size_bytes, storage_path)
            VALUES (:ownerUserId, :name, :contentType, :sizeBytes, :storagePath)
            RETURNING id
            """)
            .param("ownerUserId", actor == null ? null : actor.id())
            .param("name", originalName)
            .param("contentType", file.getContentType() == null ? "application/octet-stream" : file.getContentType())
            .param("sizeBytes", file.getSize())
            .param("storagePath", destination.toString())
            .query(Long.class)
            .single();

        auditLogService.record(actor, "File uploaded", "files", "fileId=" + id);
        return getFile(id);
    }

    public DownloadableFile loadAsResource(Long id) throws MalformedURLException {
        StoredFile file = jdbc.sql("""
            SELECT id,
                   name,
                   content_type AS contentType,
                   size_bytes AS sizeBytes,
                   storage_path AS storagePath
            FROM file_assets
            WHERE id = :id
            """)
            .param("id", id)
            .query(StoredFile.class)
            .optional()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));

        Resource resource = new UrlResource(Path.of(file.storagePath()).toUri());
        if (!resource.exists()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Stored file is missing");
        }
        return new DownloadableFile(file.name(), file.contentType(), resource);
    }

    private FileAssetDto getFile(Long id) {
        return jdbc.sql("""
            SELECT id,
                   name,
                   content_type AS contentType,
                   size_bytes AS sizeBytes,
                   '/api/files/' || id || '/download' AS downloadUrl,
                   created_at AS createdAt
            FROM file_assets
            WHERE id = :id
            """)
            .param("id", id)
            .query(FileAssetDto.class)
            .single();
    }

    private String sanitize(String fileName) {
        String name = fileName == null || fileName.isBlank() ? "upload.bin" : fileName;
        return name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    public record FileAssetDto(Long id, String name, String contentType, long sizeBytes, String downloadUrl, Instant createdAt) {
    }

    public record DownloadableFile(String name, String contentType, Resource resource) {
    }

    private record StoredFile(Long id, String name, String contentType, long sizeBytes, String storagePath) {
    }
}
`;
}

function backendEmailController(context) {
  const authImports = has(context, "auth")
    ? text`
import ${JAVA_PACKAGE}.auth.AuthenticatedUser;
import org.springframework.security.core.Authentication;`
    : "";
  const authParam = has(context, "auth") ? ", Authentication authentication" : "";
  const actorArg = has(context, "auth") ? "actor(authentication)" : "null";
  const actorHelper = has(context, "auth")
    ? text`
    private AuthenticatedUser actor(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof AuthenticatedUser user) {
            return user;
        }
        return null;
    }`
    : "";
  const guardField = has(context, "rbac")
    ? text`
    private final ${JAVA_PACKAGE}.roles.PermissionGuard permissionGuard;`
    : "";
  const constructorArgs = has(context, "rbac")
    ? `EmailService emailService, ${JAVA_PACKAGE}.roles.PermissionGuard permissionGuard`
    : "EmailService emailService";
  const constructorBody = has(context, "rbac")
    ? text`
        this.emailService = emailService;
        this.permissionGuard = permissionGuard;`
    : text`
        this.emailService = emailService;`;
  const requireSend = has(context, "rbac") ? "        permissionGuard.require(\"email:send\");\n" : "";

  return text`
package ${JAVA_PACKAGE}.email;

import ${JAVA_PACKAGE}.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
${authImports}

@RestController
@RequestMapping("/api/email")
public class EmailController {
    private final EmailService emailService;
${guardField}

    public EmailController(${constructorArgs}) {
${constructorBody}
    }

    @PostMapping("/preview")
    public ApiResponse<EmailService.EmailPreview> preview(@Valid @RequestBody EmailService.EmailRequest request) {
        return ApiResponse.ok(emailService.preview(request));
    }

    @PostMapping("/send")
    public ApiResponse<EmailService.EmailMessageDto> send(
        @Valid @RequestBody EmailService.EmailRequest request${authParam}
    ) {
${requireSend}        return ApiResponse.ok(emailService.send(request, ${actorArg}));
    }

    @GetMapping("/messages")
    public ApiResponse<List<EmailService.EmailMessageDto>> listMessages() {
${requireSend}        return ApiResponse.ok(emailService.listMessages());
    }

${actorHelper}
}
`;
}

function backendEmailService(context) {
  return text`
package ${JAVA_PACKAGE}.email;

import ${JAVA_PACKAGE}.audit.AuditLogService;
import ${JAVA_PACKAGE}.auth.AuthenticatedUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmailService {
    private final JdbcClient jdbc;
    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final AuditLogService auditLogService;

    public EmailService(
        JdbcClient jdbc,
        ObjectProvider<JavaMailSender> mailSenderProvider,
        AuditLogService auditLogService
    ) {
        this.jdbc = jdbc;
        this.mailSenderProvider = mailSenderProvider;
        this.auditLogService = auditLogService;
    }

    public EmailPreview preview(EmailRequest request) {
        return new EmailPreview(request.to(), request.subject(), renderBody(request));
    }

    @Transactional
    public EmailMessageDto send(EmailRequest request, AuthenticatedUser actor) {
        String body = renderBody(request);
        String status = "sent";

        try {
            JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
            if (mailSender == null) {
                status = "queued";
            } else {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(request.to());
                message.setSubject(request.subject());
                message.setText(body);
                mailSender.send(message);
            }
        } catch (RuntimeException ex) {
            status = "failed:" + ex.getClass().getSimpleName();
        }

        Long id = jdbc.sql("""
            INSERT INTO email_messages (sender_user_id, recipient, subject, body, template_key, status)
            VALUES (:senderUserId, :recipient, :subject, :body, :templateKey, :status)
            RETURNING id
            """)
            .param("senderUserId", actor == null ? null : actor.id())
            .param("recipient", request.to())
            .param("subject", request.subject())
            .param("body", body)
            .param("templateKey", request.templateKey())
            .param("status", status)
            .query(Long.class)
            .single();

        auditLogService.record(actor, "Email message processed", "email", "emailId=" + id + ",status=" + status);
        return getMessage(id);
    }

    public List<EmailMessageDto> listMessages() {
        return jdbc.sql("""
            SELECT id,
                   recipient,
                   subject,
                   template_key AS templateKey,
                   status,
                   created_at AS createdAt
            FROM email_messages
            ORDER BY created_at DESC
            LIMIT 100
            """)
            .query(EmailMessageDto.class)
            .list();
    }

    private EmailMessageDto getMessage(Long id) {
        return jdbc.sql("""
            SELECT id,
                   recipient,
                   subject,
                   template_key AS templateKey,
                   status,
                   created_at AS createdAt
            FROM email_messages
            WHERE id = :id
            """)
            .param("id", id)
            .query(EmailMessageDto.class)
            .single();
    }

    private String renderBody(EmailRequest request) {
        return "Template " + request.templateKey() + "\\n\\n" + request.body();
    }

    public record EmailRequest(
        @Email @NotBlank String to,
        @NotBlank String subject,
        @NotBlank String templateKey,
        @NotBlank String body
    ) {
    }

    public record EmailPreview(String to, String subject, String body) {
    }

    public record EmailMessageDto(
        Long id,
        String recipient,
        String subject,
        String templateKey,
        String status,
        Instant createdAt
    ) {
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

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "role_key", nullable = false)
    private String roleKey = "member";

    @Column(nullable = false)
    private String status = "active";

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    private Instant updatedAt;

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

    @Column(name = "role_key", nullable = false, unique = true)
    private String roleKey;

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
    String passwordHash,
    String roleKey,
    String status,
    Instant createdAt,
    Instant updatedAt
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
    String roleKey,
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
  port: \${SERVER_PORT:${context.backendPort}}

spring:
  application:
    name: ${context.packageName}
  datasource:
    url: \${DATABASE_URL:jdbc:postgresql://localhost:${context.databasePort}/${context.databaseName}}
    username: \${DATABASE_USERNAME:productflow}
    password: \${DATABASE_PASSWORD:productflow}
  flyway:
    enabled: true
    locations: classpath:db/migration
  servlet:
    multipart:
      max-file-size: 20MB
      max-request-size: 25MB
${jpaConfig}${mailConfig}

productflow:
  template: ${context.template.id}
  data-layer: ${context.dataLayer}
  ai:
    provider: \${AI_PROVIDER:mock}
  files:
    storage-dir: \${FILE_STORAGE_DIR:uploads}

${mybatisConfig}
`;
}

function backendMigration(context) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS app_users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(240) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_key VARCHAR(80) NOT NULL DEFAULT 'member',
  status VARCHAR(40) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);`,
    `CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
  actor_email VARCHAR(240) NOT NULL DEFAULT 'system',
  action VARCHAR(240) NOT NULL,
  scope VARCHAR(120) NOT NULL,
  metadata TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
  ];

  if (has(context, "auth")) {
    statements.push(`CREATE TABLE IF NOT EXISTS auth_sessions (
  id BIGSERIAL PRIMARY KEY,
  token VARCHAR(160) NOT NULL UNIQUE,
  user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`);
  }

  if (has(context, "rbac")) {
    statements.push(`CREATE TABLE IF NOT EXISTS roles (
  id BIGSERIAL PRIMARY KEY,
  role_key VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description TEXT
);`);
    statements.push(`CREATE TABLE IF NOT EXISTS permissions (
  id BIGSERIAL PRIMARY KEY,
  permission_key VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  description TEXT
);`);
    statements.push(`CREATE TABLE IF NOT EXISTS role_permissions (
  role_key VARCHAR(80) NOT NULL REFERENCES roles(role_key) ON DELETE CASCADE,
  permission_key VARCHAR(120) NOT NULL REFERENCES permissions(permission_key) ON DELETE CASCADE,
  PRIMARY KEY (role_key, permission_key)
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
  user_id BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
  provider VARCHAR(80) NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`);
  }

  if (has(context, "file-storage")) {
    statements.push(`CREATE TABLE IF NOT EXISTS file_assets (
  id BIGSERIAL PRIMARY KEY,
  owner_user_id BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
  name VARCHAR(240) NOT NULL,
  content_type VARCHAR(120) NOT NULL,
  size_bytes BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
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
    statements.push(`CREATE TABLE IF NOT EXISTS email_messages (
  id BIGSERIAL PRIMARY KEY,
  sender_user_id BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
  recipient VARCHAR(240) NOT NULL,
  subject VARCHAR(240) NOT NULL,
  body TEXT NOT NULL,
  template_key VARCHAR(120) NOT NULL,
  status VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`);
  }

  statements.push(`INSERT INTO app_users (name, email, password_hash, role_key, status)
VALUES ('Admin User', 'admin@example.com', '{noop}password', 'owner', 'active')
ON CONFLICT (email) DO NOTHING;`);

  if (has(context, "rbac")) {
    statements.push(`INSERT INTO roles (role_key, name, description) VALUES
  ('owner', 'Owner', 'Full workspace, billing, and security access'),
  ('admin', 'Admin', 'Manage users, roles, content, and operations'),
  ('member', 'Member', 'Use product workflows and assigned tools')
ON CONFLICT (role_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;`);
    statements.push(`INSERT INTO permissions (permission_key, name, description) VALUES
  ('dashboard:view', 'View dashboard', 'View workspace dashboard and metrics'),
  ('users:read', 'Read users', 'View users and profile metadata'),
  ('users:write', 'Write users', 'Create, update, and disable users'),
  ('roles:read', 'Read roles', 'View roles, permissions, and menus'),
  ('roles:write', 'Write roles', 'Create and update roles and permissions'),
  ('audit:read', 'Read audit logs', 'View audit trail entries'),
  ('ai:use', 'Use AI', 'Use AI chat and prompt tools'),
  ('files:read', 'Read files', 'List and download file assets'),
  ('files:write', 'Write files', 'Upload and manage file assets'),
  ('email:send', 'Send email', 'Preview and send email messages'),
  ('settings:write', 'Write settings', 'Manage workspace settings')
ON CONFLICT (permission_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;`);
    statements.push(`INSERT INTO role_permissions (role_key, permission_key)
SELECT 'owner', permission_key FROM permissions
ON CONFLICT DO NOTHING;`);
    statements.push(`INSERT INTO role_permissions (role_key, permission_key) VALUES
  ('admin', 'dashboard:view'),
  ('admin', 'users:read'),
  ('admin', 'users:write'),
  ('admin', 'roles:read'),
  ('admin', 'audit:read'),
  ('admin', 'ai:use'),
  ('admin', 'files:read'),
  ('admin', 'files:write'),
  ('admin', 'email:send'),
  ('member', 'dashboard:view'),
  ('member', 'ai:use'),
  ('member', 'files:read')
ON CONFLICT DO NOTHING;`);
  }

  for (const resource of blueprintResources(context)) {
    const columns = resource.fields
      .map((field) => `  ${field.column ?? toSnakeCase(field.name)} VARCHAR(240) NOT NULL`)
      .join(",\n");
    statements.push(`CREATE TABLE IF NOT EXISTS ${resource.table} (
  id BIGSERIAL PRIMARY KEY,
${columns},
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
