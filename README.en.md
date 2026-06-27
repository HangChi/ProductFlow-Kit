# ProductFlow Kit

Open-source starter templates for SaaS, admin, AI applications, and enterprise product prototypes.

ProductFlow Kit generates ready-to-run product foundations rather than disconnected demos. The current stack focuses on `React/Next.js + Spring Boot + PostgreSQL + Docker Compose`, with a zero-dependency CLI that creates clean standalone projects.

[中文 README](./README.md)

## Features

- Generate runnable projects instead of copying scattered snippets.
- Preview templates, run dry-runs, create interactively, and add modules later.
- Configure package name, display name, frontend port, backend port, database port, and database name.
- Optional `git init` and dependency installation.
- Frontend support for Next.js and Vue 3 + Vite.
- Backend default: Spring Boot, Java 21, PostgreSQL.
- Data layers: `JPA + Flyway` or `MyBatis-Plus + Flyway`.
- Optional modules: `auth`, `rbac`, `ai`, `file-storage`, `email`, `audit-log`.

## Templates

| Template | Use case | Frontend | Backend |
| --- | --- | --- | --- |
| `saas-admin` | SaaS consoles, admin panels, internal tools | Next.js | Spring Boot |
| `ai-saas` | AI chat, prompt management, call history, usage dashboards | Next.js | Spring Boot |
| `landing-page` | Marketing sites, pricing signals, lead capture | Next.js | Spring Boot |
| `crm-admin` | Accounts, deals, sales pipeline, follow-ups | Next.js | Spring Boot |
| `content-platform` | Articles, collections, publishing calendars | Next.js | Spring Boot |
| `knowledge-base` | Help centers, docs, search feedback | Next.js | Spring Boot |
| `workflow-approval` | Requests, approval queues, approval rules | Next.js | Spring Boot |
| `spring-api` | Pure Spring Boot API services | None | Spring Boot |
| `vue-admin` | Vue 3 + Vite admin applications | Vue 3 + Vite | Spring Boot |

## Quick Start

```bash
node packages/create-productflow-kit/bin/productflow.mjs list
```

Preview a template:

```bash
node packages/create-productflow-kit/bin/productflow.mjs preview ai-saas
```

Generate a SaaS/Admin app:

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-saas --template saas-admin --data jpa --modules auth,rbac,audit-log
```

Generate a CRM app:

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-crm --template crm-admin --data jpa
```

Generate a pure backend API:

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-api --template spring-api --data jpa
```

Generate a Vue Admin app:

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-vue-admin --template vue-admin --data mybatis
```

Run the generated project:

```bash
cd my-saas
cp .env.example .env
docker compose up --build
```

Frontend: http://localhost:3000

Backend: http://localhost:8080

## Development

```bash
node --test packages/create-productflow-kit/test/*.test.mjs
```

Generate built-in examples:

```bash
npm run examples:generate
```

Run full example validation:

```bash
npm run examples:validate
```

`examples:validate` generates both examples, runs CLI tests, builds the frontend through Docker, runs backend `mvn test package` in a Maven + JDK 21 container, starts Docker Compose, and probes the generated frontend/backend HTTP services.

## License

[MIT](./LICENSE)
