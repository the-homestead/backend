# Copilot Instructions for Homestead Systems Backend

## Overview
- **Framework:** NestJS (TypeScript), TypeORM, PostgreSQL, Better Auth
- **Purpose:** Modular backend for Homestead Systems, supporting authentication, organizations, teams, and extensible modules (game, modpack, project, etc.)
- **Key Directories:**
  - `src/app/` — App entrypoint, global providers, and main module wiring
  - `src/modules/` — Feature modules (auth, bunny, config, database, health, etc.)
  - `src/entities/` — TypeORM entities, grouped by domain
  - `src/modules/auth/` — Deep integration with Better Auth (see `auth.main.ts` and `README.md`)

## Architecture & Patterns
- **Modular Structure:** Each domain (auth, game, modpack, project) is a module under `src/modules/` and has its own entities under `src/entities/`.
- **Auth:**
  - Uses Better Auth with many plugins (2FA, orgs, API keys, OAuth, passkey, etc.)
  - All routes are protected by default via a global AuthGuard. Use `@AllowAnonymous()` or `@OptionalAuth()` to override per route/controller.
  - Role-based access: Use `@Roles()` for system roles, `@OrgRoles()` for org-scoped roles. See `src/modules/auth/README.md` for examples.
  - Social login providers are configured via environment variables in `auth.main.ts`.
- **Database:**
  - TypeORM is configured via `AppDataSource` in `src/modules/database/data-source.ts`.
  - Migrations live in `/migrations/` and are managed via scripts (see below).
- **Logging:** Uses `nestjs-pino` for structured logging, configured in `app.module.ts`.
- **Validation:** Uses `nestjs-zod` for validation and serialization globally.
- **Swagger:** API docs at `/swagger-main` (see `main.ts`).

## Developer Workflows
- **Install:** `bun install`
- **Run (dev):** `bun run start:dev`
- **Run (prod):** `bun run start:prod`
- **Test:** `bun run test` (unit), `bun run test:e2e` (E2E), `bun run test:cov` (coverage)
- **Lint/Format:** `bun run lint`, `bun run format`
- **Migrations:**
  - Generate: `bun run to:generate`
  - Run: `bun run to:run`
  - Revert: `bun run to:revert`
- **Docs:**
  - Generate: `bun run doc:gen`
  - Serve: `bun run doc:serve`

## Project-Specific Conventions
- **All routes are protected by default.** Use explicit decorators to allow anonymous/optional access.
- **Session and user are attached to the request object.**
- **Custom fields:** User and session objects have additional fields (see `auth.main.ts`).
- **Email sending is stubbed to console by default.** Replace with real service for production.
- **Environment variables** control most sensitive config (see `.env` and `auth.main.ts`).
- **Use generics with `AuthService`** to access plugin-extended API methods.

## Integration Points
- **Better Auth**: Deeply integrated, see `src/modules/auth/README.md` and `auth.main.ts` for plugin setup and extension points.
- **Bunny Storage**: See `bunny` module for storage integration.
- **Health checks**: `/health` endpoint via `health` module.

## Examples
- See `src/modules/auth/README.md` for usage of decorators, hooks, and advanced auth patterns.
- See `src/main.ts` and `src/app/app.module.ts` for global setup and middleware.
- See `src/modules/auth/auth.main.ts` for all Better Auth plugin configuration and extension.

---

For more details, see the main `README.md` and module-specific docs. If a pattern or workflow is unclear, check for examples in the relevant module or ask for clarification.
