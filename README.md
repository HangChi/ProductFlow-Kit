# ProductFlow Kit

面向 SaaS、后台管理、AI 应用和企业业务原型的开源工程模板库。

ProductFlow Kit 的目标不是堆一组零散 demo，而是提供一套可生成、可运行、可二次开发的产品级项目骨架。当前主线采用 `React/Next.js + Spring Boot + PostgreSQL + Docker Compose`，并通过零依赖 CLI 生成干净的独立项目。

[English README](./README.en.md)

## 核心能力

- 一键生成可运行项目，而不是复制零散代码片段。
- 支持模板预览、dry-run、交互式创建和模块追加。
- 支持配置项目名、package name、展示名称、前端端口、后端端口、数据库端口和数据库名。
- 可选自动 `git init` 和依赖安装。
- 前端支持 Next.js，也支持 Vue 3 + Vite 模板。
- 后端默认 Spring Boot、Java 21、PostgreSQL。
- 数据层支持 `JPA + Flyway` 和 `MyBatis-Plus + Flyway`。
- 支持模块化选择：`auth`、`rbac`、`ai`、`file-storage`、`email`、`audit-log`。

## 真实业务能力

生成项目现在不只是 mock API，已内置一套可落库的业务基础能力：

- 登录、注册、退出和 `/api/auth/me`。
- 基于 `auth_sessions` 表的 Bearer session 鉴权。
- 用户 CRUD：创建、列表、更新、禁用用户。
- RBAC：角色、权限点、角色权限绑定、菜单权限元数据。
- 接口权限校验：用户、角色、AI、文件、邮件、审计等接口会按权限拦截。
- 审计日志真实落库，记录登录、用户管理、AI 调用、文件上传、邮件处理等动作。
- AI Chat 调用记录真实落库，包含 prompt、response、provider 和 token 估算。
- 文件上传保存到本地存储目录，并把文件元数据写入 PostgreSQL。
- 邮件模块使用 `JavaMailSender` 发送或排队，并记录发送状态。

默认管理员账号：

```text
admin@example.com
password
```

## 模板

| 模板 | 场景 | 前端 | 后端 |
| --- | --- | --- | --- |
| `saas-admin` | SaaS 控制台、后台管理、企业内部工具 | Next.js | Spring Boot |
| `ai-saas` | AI Chat、Prompt 管理、AI 调用记录、用量统计 | Next.js | Spring Boot |
| `landing-page` | 官网落地页、定价页、线索收集 | Next.js | Spring Boot |
| `crm-admin` | 客户、商机、销售管道和跟进记录 | Next.js | Spring Boot |
| `content-platform` | 内容生产、发布日历、栏目专题 | Next.js | Spring Boot |
| `knowledge-base` | 知识库、帮助中心、文档搜索反馈 | Next.js | Spring Boot |
| `workflow-approval` | 审批请求、审批队列、审批规则 | Next.js | Spring Boot |
| `spring-api` | 纯 Spring Boot API 服务 | 无 | Spring Boot |
| `vue-admin` | Vue 3 + Vite 后台模板 | Vue 3 + Vite | Spring Boot |

## 快速开始

当前仓库尚未发布到 npm，可以先在本地使用 CLI：

```bash
node packages/create-productflow-kit/bin/productflow.mjs list
```

预览模板：

```bash
node packages/create-productflow-kit/bin/productflow.mjs preview ai-saas
```

生成 SaaS/Admin 项目：

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-saas --template saas-admin --data jpa --modules auth,rbac,audit-log
```

生成完整 AI SaaS 项目：

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-ai --template ai-saas --data jpa --modules auth,rbac,ai,file-storage,email,audit-log
```

生成 CRM 项目：

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-crm --template crm-admin --data jpa
```

生成纯后端 API 项目：

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-api --template spring-api --data jpa
```

生成 Vue Admin 项目：

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-vue-admin --template vue-admin --data mybatis
```

先查看生成计划但不写文件：

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-app --template saas-admin --dry-run
```

进入生成后的项目并启动：

```bash
cd my-saas
cp .env.example .env
docker compose up --build
```

默认启动后：

- 前端：http://localhost:3000
- 后端：http://localhost:8080

## CLI 用法

```bash
productflow create <app-name> [options]
productflow preview <template-id>
productflow add module <module-id>
productflow list
```

常用创建参数：

```text
--template          saas-admin | ai-saas | landing-page | crm-admin | content-platform | knowledge-base | workflow-approval | spring-api | vue-admin
--data              jpa | jpa-flyway | mybatis | mybatis-plus
--modules           auth,rbac,ai,file-storage,email,audit-log
--language          en | zh | bilingual
--package-name      生成项目的 npm package name
--display-name      产品展示名称
--frontend-port     前端端口，默认 3000
--backend-port      后端端口，默认 8080
--database-port     PostgreSQL 本地端口，默认 5432
--database-name     PostgreSQL 数据库名，默认 productflow
--package-manager   npm | pnpm
--dry-run           只预览生成文件，不写入磁盘
--init-git          生成后自动执行 git init
--install           生成后自动安装依赖
--force             允许写入非空目录
```

给已有生成项目追加模块：

```bash
cd my-saas
productflow add module ai
```

发布到 npm 后，目标使用方式是：

```bash
npm create productflow-kit@latest my-app -- --template ai-saas --data jpa
```

## 本地开发

运行 CLI 测试：

```bash
node --test packages/create-productflow-kit/test/*.test.mjs
```

如果本机安装了 npm，也可以运行：

```bash
npm test
```

重新生成内置示例项目：

```bash
npm run examples:generate
```

执行完整示例验证：

```bash
npm run examples:validate
```

`examples:validate` 会完成这些动作：

- 生成 `examples/saas-admin-jpa`。
- 生成 `examples/ai-saas-mybatis`。
- 跑 CLI 测试。
- 使用 Docker 构建前端，过程中会执行 `npm install` 和 `npm run build`。
- 使用 Maven + JDK 21 容器执行后端 `mvn test package`。
- 使用 Docker Compose 启动生成项目，并探测前端和后端 HTTP 服务。

## License

[MIT](./LICENSE)
