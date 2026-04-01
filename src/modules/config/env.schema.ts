import { z } from 'zod';

/**
 * Master environment schema.
 *
 * Every variable declared in .env.example must appear here.
 * Validation runs once at startup via ConfigModule — a missing or malformed
 * variable will crash the process immediately rather than failing silently
 * at runtime when a feature is first used.
 */
export const EnvSchema = z.object({
    // ── Shared ─────────────────────────────────────────────────────────────────
    TZ: z.string().default('UTC'),
    LANG: z.string().default('en-US'),
    CURRENCY: z.string().length(3, 'Must be an ISO 4217 currency code').default('USD'),
    COUNTRY: z.string().length(2, 'Must be an ISO 3166-1 alpha-2 country code').default('US'),
    COMPANY_NAME: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // ── API Server ──────────────────────────────────────────────────────────────
    HOST: z.url('HOST must be a valid URL'),
    PORT_BACKEND: z.coerce.number().int().min(1).max(65535).default(3000),
    PORT_WEB_IAM: z.coerce.number().int().min(1).max(65535).default(3001),
    PORT_WEB_ADMIN: z.coerce.number().int().min(1).max(65535).default(3002),
    PORT_WEB_FOUNDRY: z.coerce.number().int().min(1).max(65535).default(3003),
    PORT_WEB_HOME: z.coerce.number().int().min(1).max(65535).default(3004),
    REGISTRATION_ENABLED: z
        .enum(['true', 'false'])
        .transform((v) => v === 'true')
        .default(true),

    // ── Database ────────────────────────────────────────────────────────────────
    PGHOST: z.string().min(1),
    PGPORT: z.coerce.number().int().min(1).max(65535).default(5432),
    PGUSER: z.string().min(1),
    PGPASSWORD: z.string().min(1),
    PGDATABASE: z.string().min(1),
    PGSSLMODE: z.enum(['disable', 'require']).default('disable'),
    PGPOOL_MIN: z.coerce.number().int().min(0).default(2),
    PGPOOL_MAX: z.coerce.number().int().min(1).default(10),
    PGMIGRATIONS_RUN: z
        .enum(['true', 'false'])
        .transform((v) => v === 'true')
        .default(false),

    // ── Better Auth ─────────────────────────────────────────────────────────────
    BETTER_AUTH_URL: z.url('BETTER_AUTH_URL must be a valid URL'),
    BETTER_AUTH_API_KEY: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32, 'Secret must be at least 32 characters'),
    BETTER_AUTH_TRUSTED_ORIGINS: z.string().min(1),
    BETTER_AUTH_COOKIE_DOMAIN: z.string().optional(),

    // OAuth providers — all optional so the app starts without every provider configured
    AUTH_STEAM_SECRET: z.string().optional(),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),
    AUTH_DISCORD_ID: z.string().optional(),
    AUTH_DISCORD_SECRET: z.string().optional(),
    AUTH_GITHUB_ID: z.string().optional(),
    AUTH_GITHUB_SECRET: z.string().optional(),
    AUTH_TWITCH_ID: z.string().optional(),
    AUTH_TWITCH_SECRET: z.string().optional(),

    // ── Bunny CDN ───────────────────────────────────────────────────────────────
    BUNNY_STORAGE_ZONE: z.string().min(1),
    BUNNY_STORAGE_ZONE_ID: z.coerce.number().int().positive().default(0),
    BUNNY_ACCESS_KEY: z.string().min(1),
    BUNNY_ACT_API_KEY: z.string().min(1),
    BUNNY_PUBLIC_URL: z.url('BUNNY_PUBLIC_URL must be a valid URL'),
    BUNNY_STORAGE_ROOT: z.string().optional(),
    // NOTE: Add BUNNY_REGION to your .env — see bunny.config.ts for valid values.
    BUNNY_REGION: z.string().default('new_york'),

    // ── Stripe ──────────────────────────────────────────────────────────────────
    PUBLIC_STRIPE_KEY_LIVE: z.string().optional(),
    STRIPE_SECRET_KEY_LIVE: z.string().optional(),
    PUBLIC_STRIPE_KEY_TEST: z.string().optional(),
    STRIPE_SECRET_KEY_TEST: z.string().optional(),
    STRIPE_WEBHOOK_SECRET_TEST: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

/**
 * Adapter used by NestJS ConfigModule's `validate` option.
 * Throws on parse failure, which aborts the bootstrap process with a clear message.
 */
export function validateEnv(config: Record<string, unknown>): Env {
    const result = EnvSchema.safeParse(config);

    if (!result.success) {
        const issues = result.error.issues
            .map((i) => `  • ${i.path.join('.')} — ${i.message}`)
            .join('\n');

        throw new Error(`Environment validation failed:\n${issues}`);
    }

    return result.data;
}
