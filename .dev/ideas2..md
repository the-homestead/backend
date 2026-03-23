# Homestead — Architecture & Stack Reference

## Monorepo Structure

```
homestead.systems/
  apps/
    api/          ← NestJS core monolith (auth, projects, orgs/teams, billing)
    backend/      ← Elysia/Bun (CDN routing, file manifests, background jobs, queue worker)
    foundry/      ← Vite + TanStack Router — builds to Web or Tauri Desktop
      src/
        routes/
          _web/       ← web-only routes (SEO pages, marketing crossover)
          _desktop/   ← desktop-only routes (mod mgmt, game dirs, git, packs)
          (shared)/   ← browse, project pages, user profile, org/team pages, docs
      src-tauri/      ← Tauri backend source (Rust commands, native APIs)
      package.json
    home/         ← Next.JS marketing & home site
    admin/        ← Next.JS internal admin panel
    iam/          ← Next.JS IAM site (better-auth login, org invite, 2FA setup flows)
    discord/      ← Discord Bot (CommandKit) — imports from packages/shared/types/
  packages/
    shared/
      database/   ← TypeORM entities, migrations
      types/      ← Re-exports `type AppRouter` from api/ (type-only, no runtime code) + shared Zod schemas
      config/     ← Shared tsconfigs, env validation, build configs
    react/
      ui/         ← Shared Shadcn/UI lib + custom TSX components
      markdown/   ← react-markdown viewer, custom remark & rehype plugins
                     (project descriptions, changelogs, docs, realtime editor)
      emails/     ← react-email (marketing, org, static, stripe, user — w/ i18n)
```

---

## Apps

### `api/` — NestJS Core Monolith

Core domain: auth, mod/project registry, orgs/teams, billing. Owns all tRPC router definitions.

**tRPC Structure**

```
api/src/trpc/
  context.ts        ← createContext, Context type (session, isDesktop, db, scopes)
  procedures.ts     ← base procedures (public, authed, publisher, admin, desktop)
  routers/
    mods.ts         ← publicProcedure + authedProcedure
    upload.ts       ← publisherProcedure + withOrgRole('member')
    orgs.ts         ← withOrgRole(variable)
    billing.ts      ← withOrgRole('owner')
    user.ts         ← authedProcedure
    admin.ts        ← adminProcedure
    system.ts       ← desktopProcedure (desktop-only)
  index.ts          ← composes appRouter, exports AppRouter type
```

`packages/shared/types/` re-exports only the type — zero server code ships to clients:
```typescript
export type { AppRouter } from '@homestead/api/trpc'
```

**Framework Plugins**

| Package | Purpose |
|---|---|
| `nestjs-resilience` | Circuit breakers, retry, fallback — wrap CDN origin + external calls |
| `nestjs-graceful-shutdown` | Clean shutdown on SIGTERM |
| `@nestjs/terminus` | Tiered health checks (Postgres, pgmq queue depth, CDN origin) |
| `nestjs-pino` | Structured logging with request correlation IDs |
| `opentelemetry-nestjs` / `nestjs-otel` | Traces + metrics via OTLP — backend-agnostic |
| `@nestjs/swagger` | OpenAPI docs for public REST surface (OAuth clients, mod managers) |
| `nestjs-trpc` | tRPC router integration for internal & client APIs |
| `nestjs-zod` | Zod-based validation pipes |
| `@nestjs/event-emitter` (EventEmitter2) | Internal domain events |
| `nestjs-pg-notify` | pg_notify pub/sub wrapper for real-time events |
| `eslint-plugin-nestjs-typed` | Lint enforcement for NestJS typing patterns |
| `nestjs-i18n` | Internationalisation for API responses |

**API Surface**

- **tRPC** — internal APIs consumed by `foundry/`, `admin/`, `discord/`
- **REST + OAuth** — public surface for third-party mod launchers and external clients (via `better-auth` OAuth Provider plugin)

---

### `backend/` — Elysia/Bun

High-throughput, stateless services. No NestJS overhead.

- CDN file manifest resolution & download routing
- Background job processing (consumes pgmq queues)
- Extends `pg-queue` with `pg_cron` for scheduled/recurring jobs
- Unified `QueueService` abstraction:
  - **pgmq** → immediate async jobs (mod processing, CDN propagation)
  - **pg_cron** → scheduled/recurring jobs (nightly cleanup, stats aggregation, cache sweeps)

---

### `foundry/` — Vite + TanStack Router (Web + Tauri Desktop)

Single codebase. Builds to static web deployment or Tauri desktop app.

- **Why not Next.js:** Mod pages are cache-served at the CDN layer. Browse/filter UI is explicitly client-side heavy. Tauri wrapping requires static output — Vite is first-class, Next.js is a workaround.
- **Desktop-only routes** gated by `isTauri()` guard — file system, game dirs, mod packs, git integration, direct upload
- **Shared routes** — browse, project pages, user/org profile, docs
- Native features (`install_mod`, background download, system tray) via `invoke()` from `@tauri-apps/api`

---

### `discord/` — CommandKit

Standalone Discord bot service.

---

## Packages

### `packages/shared/database/`

TypeORM + PostgreSQL. Extension compatibility:

| Extension | Version | Purpose | TypeORM Compatibility |
|---|---|---|---|
| [pgvector](https://github.com/pgvector/pgvector) | 0.8.2 | Vector similarity search (mod recommendations, semantic search) | ✅ Native since v0.3.27 — `type: 'vector'` / `type: 'halfvec'`. `bit` & `sparsevec` not yet merged, use raw column type |
| [pgvectorscale](https://github.com/timescale/pgvectorscale) | 0.9.0 | High-performance ANN indexing (DiskANN) for large vector sets | ⚙️ Migration only — `CREATE INDEX ... USING diskann` via `queryRunner.query()` |
| [TimescaleDB](https://github.com/timescale/timescaledb) | 2.25.1 | Download telemetry, bandwidth metrics, mod popularity time-series | ⚙️ Migration only — `select create_hypertable(...)` after table creation; entity columns work normally |
| [PostGIS](https://postgis.net/) | 3.x | CDN node proximity routing, geospatial queries | ✅ Native — `type: 'geography'` or `type: 'geometry'` + `Point` imported from `typeorm`. No extra package needed |
| [PGroonga](https://pgroonga.github.io/) | latest | Full-text mod/project search across all languages & scripts | ⚙️ Migration only — create index via migration, query with `&@~` operator in raw SQL |
| [pg_cron](https://github.com/citusdata/pg_cron) | latest | In-database job scheduling (nightly cleanup, stats, cache sweeps) | 🔴 No ORM mapping — manage via `dataSource.query('SELECT cron.schedule(...)')` |
| [pgmq](https://github.com/pgmq/pgmq) | 1.11.0 | Async mod processing pipeline (upload → validate → index → propagate) | 🔴 No ORM mapping — wrap `pgmq.*` functions in unified `QueueService` |
| [pg_later](https://github.com/ChuckHend/pg_later) | 0.4.0 | Async query execution (requires pgmq) | 🔴 No ORM mapping — raw `query()` calls only |
| [pgaudit](https://github.com/pgaudit/pgaudit) | 18.0 | Full audit logging — critical for abuse detection (mass uploads, scraping) | 🔴 No ORM mapping — configured at DB/session level; optionally `SET pgaudit.log` per session |
| [pg_squeeze](https://github.com/cybertec-postgresql/pg_squeeze) | latest | Online table/index bloat reclamation without locking | 🔴 No ORM mapping — trigger via raw query, typically scheduled through pg_cron |
| [postgresql_anonymizer](https://gitlab.com/dalibo/postgresql_anonymizer) | 3.0.13 | GDPR/privacy — mask download history and user PII in analytics exports | 🔴 No ORM mapping — migration-driven via `anon.init()` and `SECURITY LABEL` statements |
| [pg-safeupdate](https://github.com/eradman/pg-safeupdate) | latest | Prevents `UPDATE`/`DELETE` without a `WHERE` clause | ⚙️ Session config — load via `postgresql.conf` or enforce in TypeORM using an `EntitySubscriber` |

**Key:** ✅ Native TypeORM support · ⚙️ Partial (migrations/raw SQL for extension features) · 🔴 Raw SQL only

**Postgres as infrastructure** (no external services needed for these):
- **Pub/sub** — `pg_notify` via `nestjs-pg-notify`
- **Queue** — `pgmq` + extended `pg-queue`, unified in `QueueService`
- **Scheduling** — `pg_cron` (extends `QueueService` for recurring jobs)

---

### `packages/shared/types/`

- Re-exports `type AppRouter` from `api/` — type-only, zero runtime server code ships to clients
- Shared Zod schemas — validation source of truth across all apps (`api/`, `foundry/`, `admin/`, `discord/`)

---

### `packages/react/ui/`

- Shadcn/UI base
- Custom TSX components shared across `foundry/`, `home/`, `admin/`, `iam/`

### `packages/react/markdown/`

- `react-markdown` + custom remark/rehype plugins
- Used for: project descriptions, changelogs, docs pages, realtime editor

### `packages/react/emails/`

- `react-email` templates with i18n
- Categories: marketing, org, static, Stripe, user

---

## Auth — `better-auth`

Hosted in `iam/` (Next.JS). OAuth Provider plugin makes Homestead the identity provider for third-party mod launchers.

**Active Plugins**

| Plugin | Reason |
|---|---|
| `organization` | Mod teams, publisher orgs, per-org permission scopes |
| `oauth-provider` | Expose OAuth so third-party launchers authenticate against Homestead |
| `2fa` | Required for publisher accounts that own mods |
| `passkey` | Passkey support for power users |
| `have-i-been-pwned` | Non-negotiable for any new auth system |
| `jwt` | CDN signed URL generation + service-to-service auth |
| `magic-link` | Low-friction auth for casual users |
| `email-otp` | Alternative second factor |
| `multi-session` | Users running multiple game clients simultaneously |
| `username` | Display name / handle support |
| `open-api` | Auth endpoint documentation |
| `i18n` | Internationalised auth flows |
| `last-login-method` | UX hint on returning login |
| `captcha` | Deferred — add when spam becomes a problem |

---

## Observability

Follows the CNCF Observability Whitepaper pillars (logs, traces, metrics).

**Logging — `nestjs-pino`**
- Structured JSON logs with correlation ID (`x-request-id` → `ulid()` fallback)
- ID flows through: HTTP → queue jobs → CDN events
- Key log domains: mod upload lifecycle, CDN routing decisions, all better-auth flows

**Tracing — OpenTelemetry (`nestjs-otel`)**
- Auto-instruments HTTP + TypeORM queries
- Manual spans: CDN propagation per file, pgmq enqueue→dequeue latency, pgvector query latency
- Emits via OTLP — backend-agnostic (Jaeger / Tempo / Honeycomb)

**Metrics — Prometheus (via `nestjs-otel`)**

| Metric | Type | Labels |
|---|---|---|
| `mod_uploads_total` | Counter | `status` (success/rejected/pending) |
| `cdn_propagation_duration_seconds` | Histogram | — |
| `download_requests_total` | Counter | `region`, `mod_id` |
| `pgmq_queue_depth` | Gauge | `queue_name` |
| `vector_search_duration_seconds` | Histogram | — |

**Health — `nestjs-terminus`**
- Postgres ping
- CDN origin HTTP probe
- pgmq queue depth threshold check

---

## API Contract

| Surface | Technology | Consumers |
|---|---|---|
| Internal APIs | tRPC — defined in `api/src/trpc/`, type re-exported via `packages/shared/types/` | `foundry/`, `admin/`, `discord/` |
| Public/external | REST + OAuth (better-auth oauth-provider) | Third-party mod launchers, external clients |

**tRPC + better-auth context pattern:**
```typescript
export const createContext = async ({ req }) => {
  const session = await auth.api.getSession({ headers: req.headers });
  return { session, db: dataSource };
};

const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});
```

---

## Tooling

| Concern | Tool |
|---|---|
| Package manager | Bun (`bun install`) |
| Testing | Bun test |
| Validation (NestJS) | `nestjs-zod` |
| Validation (shared) | Zod |
| tRPC debug UI | `trpc-ui` |
| Security / license scanning | FOSSA |
| Observability reference | CNCF Observability Whitepaper |

---

## Notes

- Decorators used broadly across the monorepo — NestJS DI, TypeORM entities, tRPC procedures, better-auth session context
- `QueueService` is the single abstraction over pgmq (async) + pg_cron (scheduled) — application code never calls either directly
- `foundry/` desktop-only routes gated by `isTauri()` — same codebase, progressive feature unlock on desktop