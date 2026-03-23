# Homestead Backend

## Base Runtime Frameworks
- NestJS
    - Plugin/Addon Ideas
        - https://github.com/SocketSomeone/nestjs-resilience
        - https://github.com/tygra-io/nestjs-graceful-shutdown
        - https://github.com/nestjsx/crud or https://github.com/woowabros/nestjs-library-crud or https://github.com/purerosefallen/nicot
        - https://nestjs-i18n.com/api
        - https://nestjs-trpc.io
        - https://github.com/nestjs/swagger
        - https://github.com/wbhob/nest-middlewares/tree/master
        - https://github.com/darraghoriordan/eslint-plugin-nestjs-typed
        - https://github.com/iamolegga/nestjs-pino
        - https://github.com/amplication/opentelemetry-nestjs | https://github.com/pragmaticivan/nestjs-otel
        - https://github.com/nestjs/terminus
        - https://github.com/pvarentsov/nestjs-pg-notify
- ElysiaJS/Bun (https://elysiajs.com)
    - Built on bun
    - Comes with Eden ( ETE Type Safety) (https://elysiajs.com/eden/overview)
- Bun Only (https://bun.com/docs/runtime/http/server)
    - Plugin/Addon Ideas
        - If we use TRPC we can yoink the adapter idea from https://github.com/cah4a/trpc-bun-adapter.git


## Base Librarys
- Auth: https://better-auth.com
    - Plugins
        - https://better-auth.com/docs/plugins/organization.mdx
        - https://better-auth.com/docs/plugins/oauth-provider.mdx
        - https://better-auth.com/docs/plugins/2fa.mdx
        - https://better-auth.com/docs/plugins/username.mdx
        - https://better-auth.com/docs/plugins/magic-link.mdx
        - https://better-auth.com/docs/plugins/email-otp.mdx
        - https://better-auth.com/docs/plugins/passkey.mdx
        - https://better-auth.com/docs/plugins/captcha.mdx
        - https://better-auth.com/docs/plugins/have-i-been-pwned.mdx
        - https://better-auth.com/docs/plugins/i18n.mdx
        - https://better-auth.com/docs/plugins/last-login-method.mdx
        - https://better-auth.com/docs/plugins/multi-session.mdx
        - https://better-auth.com/docs/plugins/open-api.mdx
        - https://better-auth.com/docs/plugins/jwt.mdx
        - https://better-auth.com/docs/plugins/test-utils.mdx
- Database: TypeORM / Postgresql
    - Currently leaning towards typeorm more than anything, if not we'd probably go raw pg library. we do utilize quite a complex postgres setup if we cant utilize our pg plugins with typeorm

        | Extension | Version | Purpose | TypeORM Compatibility |
        |---|---|---|---|
        | [pgvector](https://github.com/pgvector/pgvector) | 0.8.2 | Vector similarity search | ✅ Native since v0.3.27 — `type: 'vector'` / `type: 'halfvec'`. `bit` & `sparsevec` not yet merged, use raw column type |
        | [pgvectorscale](https://github.com/timescale/pgvectorscale) | 0.9.0 | High-performance vector indexing (DiskANN) | ⚙️ Migration only — `CREATE INDEX ... USING diskann` via `queryRunner.query()` |
        | [TimescaleDB](https://github.com/timescale/timescaledb) | 2.25.1 | Time-series data management and analytics | ⚙️ Migration only — `select create_hypertable(...)` after table creation; entity columns work normally |
        | [PostGIS](https://postgis.net/) | 3.x | Geospatial data types and queries | ✅ Native — `type: 'geography'` or `type: 'geometry'` + `Point` imported from `typeorm`. No extra package needed |
        | [PGroonga](https://pgroonga.github.io/) | latest | Full-text search for all languages | ⚙️ Migration only — create index via migration, query with `&@~` operator in raw SQL |
        | [pg_cron](https://github.com/citusdata/pg_cron) | latest | In-database job scheduling | 🔴 No ORM mapping — manage entirely via `dataSource.query('SELECT cron.schedule(...)')` |
        | [pgmq](https://github.com/pgmq/pgmq) | 1.11.0 | Lightweight message queue inside Postgres | 🔴 No ORM mapping — wrap `pgmq.*` functions in a service using raw queries |
        | [pg_later](https://github.com/ChuckHend/pg_later) | 0.4.0 | Async query execution (requires pgmq) | 🔴 No ORM mapping — raw `query()` calls only |
        | [pgaudit](https://github.com/pgaudit/pgaudit) | 18.0 | Full audit logging of SQL statements | 🔴 No ORM mapping — configured at DB/session level; optionally `SET pgaudit.log` per session |
        | [pg_squeeze](https://github.com/cybertec-postgresql/pg_squeeze) | latest | Online table/index bloat reclamation without locking | 🔴 No ORM mapping — trigger via raw query, typically scheduled through pg_cron |
        | [postgresql_anonymizer](https://gitlab.com/dalibo/postgresql_anonymizer) | 3.0.13 | Data masking and anonymization | 🔴 No ORM mapping — migration-driven via `anon.init()` and `SECURITY LABEL` statements |
        | [pg-safeupdate](https://github.com/eradman/pg-safeupdate) | latest | Prevents `UPDATE`/`DELETE` without a `WHERE` clause | ⚙️ Session config — load via `postgresql.conf` or enforce in TypeORM using an `EntitySubscriber` |

        **Key:**
        - ✅ Native TypeORM support
        - ⚙️ Partial — entity/column mapping works but extension features need migrations or raw SQL
        - 🔴 No ORM mapping — raw SQL only
- Validation: https://github.com/typestack/class-validator (if nestjs https://github.com/BenLorantfy/nestjs-zod) | or https://zod.dev
- End-to-End typesafe API's: https://trpc.io
    - Use https://github.com/aidansunbury/trpc-ui to debug
- If events are needed: https://github.com/EventEmitter2/EventEmitter2 | (w/ nestjs https://github.com/nestjs/event-emitter)
- Testing is done through https://bun.com/docs/test
- Package manager is https://bun.com/docs/pm/cli/install

## Notes

- For queue/cache/and pub/sub comminications, we will be using postgres. pub/sub wrapper utilizes pg_notify. for queue, i'm going to extend our already written pg-queue to utilize pg_cron also.
- I want to utilize decorators around the mono-repo.
- https://fossa.com - Utilize this for security assistance
- Remember this paper while doing metrics, traces, and logs https://github.com/cncf/tag-observability/blob/main/whitepaper.md
