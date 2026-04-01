
# Homestead Systems Backend

NestJS backend for Homestead Systems. Handles auth, organizations, teams, and a handful of domain modules (game, modpack, project). Uses TypeORM + PostgreSQL for data and [Better Auth](https://better-auth.com) for all things authentication.

---

## Stack

- **[NestJS](https://github.com/nestjs/nest)** — main framework
- **TypeORM + PostgreSQL** — data layer and migrations
- **[Better Auth](https://better-auth.com)** — auth (2FA, orgs, API keys, OAuth, passkeys, sessions)
- **Bun** — runtime and package manager (tests coming soon too)
- **nestjs-zod** — validation and serialization
- **nestjs-pino** — structured logging

---

## Project Structure

```
src/
  app/         # App bootstrap, global providers, middleware
  assets/      # Static assets
  entities/    # TypeORM entities by domain (auth, game, modpack, project)
  lib/         # Shared utilities
  modules/     # Feature modules (auth, bunny, config, database, health, etc.)
```

### Modules

- **app** — wires everything together, sets up logging and DI
- **auth** — wraps Better Auth; handles 2FA, orgs, teams, API keys, OAuth, passkeys. Routes are auth-required by default — use `@AllowAnonymous()` or `@OptionalAuth()` to opt out
- **bunny** — BunnyCDN integration for file storage
- **database** — TypeORM setup, data source config, migration helpers
- **health** — basic health check endpoints
- **game / modpack / project** — domain modules, each owns its entities, services, and controllers

Entities live under `src/entities/` grouped by domain. Each module handles its own DTOs and services.

---

## Auth & Security

Everything goes through Better Auth. No custom auth logic — the library handles sessions, tokens, OAuth flows, passkeys, and all the plugin stuff.

Route access is controlled via decorators:
- `@Roles()` / `@OrgRoles()` — system-level and org-scoped RBAC
- `@AllowAnonymous()` — skip auth entirely
- `@OptionalAuth()` — auth optional, user attached if present

See `src/modules/auth/README.md` and `src/modules/auth/auth.main.ts` for config details.

---

## Getting Started

```bash
bun install
bun run start:dev
```

Swagger docs are available at `/swagger` once the server is running.

---

## Commands

**Dev:**
```bash
bun run start          # start
bun run start:dev      # watch mode
bun run start:prod     # production
```

**Tests:**
```bash
bun run test           # unit
bun run test:e2e       # e2e
bun run test:cov       # coverage
```

**Lint / Format:**
```bash
bun run lint
bun run format
```

**Migrations:**
```bash
bun run to:generate    # generate
bun run to:run         # run
bun run to:revert      # revert last
```

**Docs:**
```bash
bun run doc:gen
bun run doc:serve
```

---

## Roadmap

- Better test coverage across all modules
- Projects module (management, collaboration)
- Modpacks module (versioning, distribution)
- Admin module (users, orgs, games)
- More external integrations

---

## Security

See [SECURITY.md](SECURITY.md) for vulnerability disclosure and security policies.

---

## Resources

- [NestJS Docs](https://docs.nestjs.com)
- [Better Auth Docs](https://better-auth.com/docs/introduction) · [GitHub](https://github.com/better-auth/better-auth)
- [TypeORM Docs](https://typeorm.io/)
- [Bun Docs](https://bun.sh/docs)

---

© Homestead Systems 2026, Davin L. (ItzDabbzz). All Rights Reserved.