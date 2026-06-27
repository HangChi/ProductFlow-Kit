# ProductFlow Kit

Open-source starter templates for SaaS, admin, and AI applications.

ProductFlow Kit is designed to generate ready-to-run product foundations rather than disconnected demos. The first release focuses on `React/Next.js + Spring Boot + PostgreSQL + Docker Compose`, with a zero-dependency CLI that generates clean starter projects.

[中文 README](./README.md)

## Quick Start

```bash
node packages/create-productflow-kit/bin/productflow.mjs list
```

Generate a SaaS/Admin app:

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-saas --template saas-admin --data jpa --modules auth,rbac,audit-log
```

Generate an AI SaaS app:

```bash
node packages/create-productflow-kit/bin/productflow.mjs create my-ai-app --template ai-saas --data mybatis --modules auth,rbac,ai,audit-log
```

Run the generated project:

```bash
cd my-ai-app
cp .env.example .env
docker compose up --build
```

Frontend: http://localhost:3000

Backend: http://localhost:8080

## Templates

- `saas-admin`: login, users, roles, dashboard, settings, tables, forms, prototype routes, and audit logs.
- `ai-saas`: SaaS/Admin plus AI chat, prompt management, call history, usage cards, and a mock AI provider.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS.
- Backend: Spring Boot, Java 21.
- Database: PostgreSQL.
- Data layers: JPA + Flyway, or MyBatis-Plus + Flyway.
- Runtime: Docker Compose.

## Development

```bash
node --test packages/create-productflow-kit/test/*.test.mjs
```

## License

[MIT](./LICENSE)
