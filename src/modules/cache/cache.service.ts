import { Injectable } from '@nestjs/common';
import type { QueryResultRow } from 'pg';

import { PgPoolService } from '../database/pg-pool.service';

/**
 * Cache row stored in PostgreSQL.
 *
 * @template TValue - Cached value type.
 */
export interface CacheEntry<TValue = unknown> extends QueryResultRow {
    key: string;
    value: TValue;
    expires_at: Date;
}

/**
 * Result returned by {@link CacheService.getOrSet}.
 *
 * @template TValue - Cached value type.
 */
export interface CacheResult<TValue> {
    /** Cached or freshly computed value. */
    value: TValue;
    /** `true` when the value was already in cache. */
    hit: boolean;
    /** `true` when the returned value is expired (stale-while-revalidate). */
    stale: boolean;
}

/**
 * PostgreSQL-backed key/value cache with TTL and stale-while-revalidate support.
 *
 * Values are stored as JSONB. Expired values may optionally be returned while a
 * background refresh runs, keeping hot paths fast.
 *
 * @example
 * ```ts
 * await this.cacheService.set('user:1', { name: 'Alice' }, 300);
 *
 * const result = await this.cacheService.getOrSet(
 *   'stats',
 *   () => this.fetchStats(),
 *   300,
 *   true,
 * );
 * console.log(result.value, result.stale);
 * ```
 */
@Injectable()
export class CacheService {
    constructor(private readonly pgPool: PgPoolService) {}

    /**
     * Retrieves a value if it exists and has not expired.
     *
     * @template TValue - Expected value type.
     * @param key - Cache key.
     * @returns Cached value, or `undefined` if missing or expired.
     */
    async get<TValue = unknown>(key: string): Promise<TValue | undefined> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-redundant-type-constituents
        const result = await this.pgPool.query<{ value: TValue } & QueryResultRow>(
            `SELECT value
             FROM cache
             WHERE key = $1
               AND expires_at > NOW()`,
            [key],
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return result.rows[0]?.value;
    }

    /**
     * Stores or updates a cached value.
     *
     * Uses `ON CONFLICT DO UPDATE` so concurrent writers don't race.
     *
     * @template TValue - Value type.
     * @param key - Cache key.
     * @param value - JSON-serialisable value.
     * @param ttlSeconds - Time-to-live in seconds. Defaults to 3600.
     */
    async set<TValue>(key: string, value: TValue, ttlSeconds = 3600): Promise<void> {
        await this.pgPool.query(
            `INSERT INTO cache (key, value, expires_at)
             VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 second'))
             ON CONFLICT (key) DO UPDATE
                 SET value      = EXCLUDED.value,
                     expires_at = EXCLUDED.expires_at`,
            [key, value, ttlSeconds],
        );
    }

    /**
     * Deletes a cached value.
     *
     * @param key - Cache key.
     */
    async delete(key: string): Promise<void> {
        await this.pgPool.query(`DELETE FROM cache WHERE key = $1`, [key]);
    }

    /**
     * Removes all expired cache entries.
     *
     * Call periodically (e.g. via a `@Cron` in a separate scheduler service)
     * to keep the table from growing unboundedly.
     */
    async cleanup(): Promise<void> {
        await this.pgPool.query(`DELETE FROM cache WHERE expires_at < NOW()`);
    }

    /**
     * Retrieves a cached value or computes and stores it.
     *
     * Stale-while-revalidate behaviour:
     * - **Fresh hit** → returned immediately, no factory call.
     * - **Miss** → factory is awaited, result is stored, returned.
     * - **Stale hit + `allowStale = true`** → stale value returned immediately,
     *   factory runs in the background to refresh the entry.
     * - **Stale hit + `allowStale = false`** → factory is awaited synchronously.
     *
     * @template TValue - Value type.
     * @param key - Cache key.
     * @param factory - Async function that produces a fresh value.
     * @param ttlSeconds - TTL for newly stored values. Defaults to 3600.
     * @param allowStale - Whether a stale value may be returned while refreshing. Defaults to `true`.
     */
    async getOrSet<TValue>(
        key: string,
        factory: () => Promise<TValue>,
        ttlSeconds = 3600,
        allowStale = true,
    ): Promise<CacheResult<TValue>> {
        const row = await this.getRaw<TValue>(key);

        if (!row) {
            const value = await factory();
            await this.set(key, value, ttlSeconds);
            return { value, hit: false, stale: false };
        }

        const isStale = row.expires_at <= new Date();

        if (!isStale) {
            return { value: row.value, hit: true, stale: false };
        }

        if (!allowStale) {
            const value = await factory();
            await this.set(key, value, ttlSeconds);
            return { value, hit: false, stale: false };
        }

        // Return stale immediately and refresh in the background.
        this.scheduleRefresh(key, factory, ttlSeconds).catch(() => {
            // Intentionally swallowed — background refresh must not affect callers.
        });

        return { value: row.value, hit: true, stale: true };
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    /** Retrieves a cache entry regardless of expiry. */
    private async getRaw<TValue = unknown>(key: string): Promise<CacheEntry<TValue> | undefined> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await this.pgPool.query<CacheEntry<TValue>>(
            `SELECT key, value, expires_at FROM cache WHERE key = $1`,
            [key],
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return result.rows[0];
    }

    /** Computes a fresh value and writes it to cache. Errors are intentionally swallowed by the caller. */
    private async scheduleRefresh<TValue>(
        key: string,
        factory: () => Promise<TValue>,
        ttlSeconds: number,
    ): Promise<void> {
        const fresh = await factory();
        await this.set(key, fresh, ttlSeconds);
    }
}
