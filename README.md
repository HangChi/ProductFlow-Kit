# ProductFlow Kit

面向 SaaS、后台管理和 AI 应用的开源工程模板库。

ProductFlow Kit 的目标不是堆一组零散 demo，而是提供一套可生成、可运行、可二次开发的产品级项目骨架。第一版主线采用 `React/Next.js + Spring Boot + PostgreSQL + Docker Compose`，并通过 CLI 脚手架生成干净的独立项目。

[English README](./README.en.md)

## 核心能力

- 一键生成可运行项目，而不是复制零散代码片段。
- 首批提供 `saas-admin` 和 `ai-saas` 两套模板。
- 前端默认使用 Next.js、React、TypeScript、Tailwind CSS。
- 后端默认使用 Spring Boot、Java 21、PostgreSQL。
- 数据层支持 `JPA + Flyway` 和 `MyBatis-Plus + Flyway`。
- 支持模块化选择：`auth`、`rbac`、`ai`、`file-storage`、`email`、`audit-log`。
- 生成项目统一包含 `.env.example`、`docker-compose.yml`、双语 README、前后端基础测试入口。

## 快速开始

当前仓库尚未发布到 npm，可以先在本地使用 CLI：

```bash
node packages/create-productflow-kit/bin/productflow.mjs list
```

生成 SaaS/Admin 项目：

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-saas --template saas-admin --data jpa --modules auth,rbac,audit-log
```

生成 AI SaaS 项目：

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-ai-app --template ai-saas --data mybatis --modules auth,rbac,ai,audit-log
```

进入生成后的项目并启动：

```bash
cd my-ai-app
cp .env.example .env
docker compose up --build
```

启动后：

- 前端：http://localhost:3000
- 后端：http://localhost:8080

## 模板

### `saas-admin`

适合构建 SaaS 控制台、后台管理系统和企业内部工具，包含：

- 登录与当前用户接口
- 用户管理
- 角色权限
- 仪表盘
- 设置页
- 表格与表单页面
- 代码化 UI 原型路由
- 审计日志模块

### `ai-saas`

在 `saas-admin` 基础上增加 AI 应用能力，包含：

- AI Chat 页面
- Prompt 管理原型
- AI 调用记录表结构
- 用量统计卡片
- 后端 AI Provider 抽象
- 本地 mock provider

## CLI 用法

```bash
productflow create <app-name> [options]
```

常用参数：

```text
--template  saas-admin | ai-saas
--data      jpa | jpa-flyway | mybatis | mybatis-plus
--modules   auth,rbac,ai,file-storage,email,audit-log
--language  en | zh | bilingual
--force
```

示例：

```bash
productflow create my-app --template ai-saas --data jpa --modules auth,rbac,ai,audit-log
```

发布到 npm 后，目标使用方式是：

```bash
npm create productflow-kit@latest my-app -- --template ai-saas --data jpa
```

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | Next.js, React, TypeScript, Tailwind CSS |
| 后端 | Spring Boot, Java 21 |
| 数据库 | PostgreSQL |
| 数据层 | JPA + Flyway / MyBatis-Plus + Flyway |
| 本地运行 | Docker Compose |
| 脚手架 | Node.js zero-dependency CLI |

## 本地开发

运行 CLI 测试：

```bash
node --test packages/create-productflow-kit/test/*.test.mjs
```

如果本机安装了 npm，也可以运行：

```bash
npm test
```

## 仓库状态

这是第一版 MVP，当前重点是跑通模板库的核心闭环：

1. 维护模板 manifest。
2. 通过 CLI 选择模板、数据层和模块。
3. 生成干净的独立项目。
4. 生成项目包含前端、后端、数据库迁移、Docker Compose 和基础测试入口。

后续可以继续增强真实认证、权限模型、AI provider、文件存储、邮件发送、发布 npm 包和模板预览站点。

## License

[MIT](./LICENSE)
