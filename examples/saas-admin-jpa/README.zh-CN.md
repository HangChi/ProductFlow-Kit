# Saas Admin Jpa

本项目由 ProductFlow Kit 生成。

## 技术栈

- 前端：Next.js、React、TypeScript、Tailwind CSS。
- 后端：Spring Boot、Java 21。
- 数据层：JPA + Flyway。
- 数据库：PostgreSQL。
- 已启用模块：auth、rbac、audit-log。

## 本地运行

```bash
cp .env.example .env
docker compose up --build
```

前端：http://localhost:3000

后端：http://localhost:8080

## 常用命令

```bash
npm --prefix frontend run dev
mvn -f backend/pom.xml spring-boot:run
npm test
```

## API

- `/api/users/*`
- `/api/auth/*`：启用 auth 模块时可用。
- `/api/roles/*`：启用 rbac 模块时可用。
- `/api/ai/chat`：启用 ai 模块时可用。
- `/api/audit-logs`：启用 audit-log 模块时可用。
