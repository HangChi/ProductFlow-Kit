# ProductFlow Kit

ProductFlow Kit 是一套开源产品工程模板库，目标是帮助开发者快速生成可运行、可二次开发、可扩展的 SaaS/Admin 和 AI 应用项目。

第一版主线技术栈：

- 前端：Next.js、React、TypeScript、Tailwind CSS、shadcn/ui 风格组件。
- 后端：Spring Boot、Java 21、PostgreSQL。
- 数据层：支持 JPA + Flyway，也支持 MyBatis-Plus + Flyway。
- 本地运行：Docker Compose。

## 快速开始

```bash
npm run create -- create my-saas -- --template saas-admin --data jpa --modules auth,rbac,audit-log
```

发布后的目标使用方式：

```bash
npm create productflow-kit@latest my-saas -- --template saas-admin --data jpa
productflow create my-ai-app --template ai-saas --data mybatis --modules auth,rbac,ai,audit-log
```

## 首批模板

- `saas-admin`：登录、用户管理、角色权限、仪表盘、表格、表单、设置页、代码化 UI 原型。
- `ai-saas`：继承 SaaS/Admin 基础能力，增加 AI Chat、Prompt 管理、调用记录、用量统计和 mock provider。

## 开发

```bash
npm test
```

测试会生成多个模板和数据层组合，验证 CLI 输出的项目结构是否完整。
