# Ai Saas Mybatis

Generated with ProductFlow Kit.

## Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS.
- Backend: Spring Boot, Java 21.
- Data layer: MyBatis-Plus + Flyway.
- Database: PostgreSQL.
- Modules: auth, rbac, ai, audit-log.

## Run Locally

```bash
cp .env.example .env
docker compose up --build
```

Frontend: http://localhost:3000

Backend: http://localhost:8080

## Language

- Generated language mode: `bilingual`.
- Use `--language zh`, `--language en`, or `--language bilingual`. Bilingual frontend projects include an in-app language switch.

## Useful Commands

```bash
npm --prefix frontend run dev
mvn -f backend/pom.xml spring-boot:run
npm test
```

## API Surface

- `/api/auth/*` when the auth module is enabled.
- `/api/users/*`.
- `/api/roles/*` when RBAC is enabled.
- `/api/ai/chat` when AI is enabled.
- `/api/audit-logs` when audit logs are enabled.
