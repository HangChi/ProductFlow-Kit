# Example Validation

This repository includes two generated reference examples:

- `examples/saas-admin-jpa`
- `examples/ai-saas-mybatis`

Run the full validation flow:

```bash
npm run examples:validate
```

The validation script performs these checks:

- Regenerates both examples from the CLI generator.
- Runs the CLI test suite.
- Builds each frontend in Docker, including `npm install` and `npm run build`.
- Runs each backend with Maven + JDK 21 using `mvn test package`.
- Starts each generated app through Docker Compose.
- Probes the generated backend at `http://127.0.0.1:8080/api/users`.
- Probes the generated frontend at `http://127.0.0.1:3000`.
- Tears down Compose containers, networks, and volumes after each example.

## Latest Local Result

Date: 2026-06-27

Environment:

- Docker Desktop 29.1.3
- Docker Compose v2.40.3
- Node.js v24.14.0 for repository scripts
- Containerized Node 22 for frontend builds
- Containerized Maven 3.9 + Eclipse Temurin JDK 21 for backend builds

Result:

```text
CLI tests: 17 passed / 0 failed
saas-admin-jpa: frontend build passed, backend test/package passed, Docker Compose HTTP probes passed
ai-saas-mybatis: frontend build passed, backend test/package passed, Docker Compose HTTP probes passed
```
