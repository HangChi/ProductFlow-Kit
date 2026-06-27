# ProductFlow Kit

ProductFlow Kit is an open-source template library for product teams that want a ready-to-run foundation instead of a pile of disconnected demos.

The first release focuses on `React/Next.js + Spring Boot + PostgreSQL + Docker Compose`, with a zero-dependency CLI that generates clean starter projects.

## Quick Start

```bash
npm run create -- create my-saas -- --template saas-admin --data jpa --modules auth,rbac,audit-log
```

When published, the intended public interface is:

```bash
npm create productflow-kit@latest my-saas -- --template saas-admin --data jpa
productflow create my-ai-app --template ai-saas --data mybatis --modules auth,rbac,ai,audit-log
```

## Templates

- `saas-admin`: login, users, roles, dashboard, settings, tables, forms, and prototype routes.
- `ai-saas`: SaaS/Admin plus AI chat, prompt management, usage cards, and a mock AI provider.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui-style primitives.
- Backend: Spring Boot, Java 21, PostgreSQL.
- Data layers: JPA + Flyway, or MyBatis-Plus + Flyway.
- Runtime: Docker Compose for PostgreSQL, backend, and frontend.

## Development

```bash
npm test
```

The CLI tests generate multiple template/data-layer combinations and assert that the expected project files are created.

## Chinese

中文说明见 [README.zh-CN.md](./README.zh-CN.md).
