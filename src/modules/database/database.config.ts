import { registerAs } from '@nestjs/config';
import * as z from 'zod';

// ── Validation schema ──────────────────────────────────────────────────────────
// Call validateDatabaseConfig() on app bootstrap to catch missing env vars early.
export const databaseEnvSchema = z.object({
    DB_HOST: z.string().nonempty(),
    DB_PORT: z.number().default(5432),
    DB_USERNAME: z.string().nonempty(),
    DB_PASSWORD: z.string().nonempty(),
    DB_NAME: z.string().nonempty(),
    DB_SSL_MODE: z.enum(['disable', 'require']).default('disable'),
    DB_POOL_MAX: z.number().default(10),
    DB_POOL_MIN: z.number().default(2),
    DB_MIGRATIONS_RUN: z.boolean().default(false),
});

// ── Typed config namespace ─────────────────────────────────────────────────────
export default registerAs('database', () => ({
    host: process.env.PGHOST ?? 'localhost',
    port: parseInt(process.env.PGPORT ?? '5432', 10),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    name: process.env.PGDATABASE,
    sslMode: process.env.PGSSLMODE ?? 'disable',
    poolMax: parseInt(process.env.PGPOOL_MAX ?? '10', 10),
    poolMin: parseInt(process.env.PGPOOL_MIN ?? '2', 10),
    migrationsRun: process.env.PGMIGRATIONS_RUN === 'true',
}));
