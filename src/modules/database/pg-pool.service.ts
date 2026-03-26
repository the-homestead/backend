import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { DataSource, Driver } from 'typeorm';

/**
 * Narrows the TypeORM `Driver` interface to the shape of the postgres driver,
 * which stores the underlying `pg.Pool` on `master`.
 */
interface PostgresDriver extends Driver {
    master: Pool;
}

/**
 * Typed wrapper around the `pg.Pool` extracted from the TypeORM `DataSource`.
 *
 * Injecting this concrete class (rather than a Symbol token) means ESLint can
 * fully resolve all method types — eliminating unsafe-call / unsafe-member
 * errors on every `.query()` or `.connect()` call in consumer services.
 *
 * Zero extra database connections are created: this service re-uses the pool
 * that TypeORM already manages internally.
 *
 * @example
 * ```ts
 * constructor(private readonly pgPool: PgPoolService) {}
 *
 * const result = await this.pgPool.query('SELECT 1');
 * ```
 */
@Injectable()
export class PgPoolService {
    private readonly pool: Pool;

    constructor(
        @InjectDataSource()
        dataSource: DataSource,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.pool = (dataSource.driver as PostgresDriver).master;
    }

    /**
     * Runs a parameterised SQL query against the pool.
     *
     * A client is checked out, the query is executed, and the client is
     * returned to the pool automatically.
     *
     * @template TRow - Shape of each row in the result set.
     * @param sql - SQL string with `$1`, `$2`, … placeholders.
     * @param params - Positional parameter values.
     */
    async query<TRow extends QueryResultRow = QueryResultRow>(
        sql: string,
        params?: unknown[],
    ): Promise<QueryResult<TRow>> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return await this.pool.query<TRow>(sql, params);
    }

    /**
     * Acquires a dedicated client from the pool.
     *
     * The caller **must** call `client.release()` when finished, or the
     * connection will leak. Prefer {@link query} for one-shot statements.
     */
    async connect(): Promise<PoolClient> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return await this.pool.connect();
    }
}
