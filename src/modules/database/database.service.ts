import { Injectable, Logger, type OnApplicationShutdown, type OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
    private readonly logger = new Logger(DatabaseService.name);

    constructor(
        @InjectDataSource()
        private readonly _dataSource: DataSource,
    ) {}

    // ── Lifecycle ──────────────────────────────────────────────────────────────

    async onModuleInit(): Promise<void> {
        await this.checkConnection();
    }

    async onApplicationShutdown(signal?: string): Promise<void> {
        this.logger.log(`Shutting down database connection (signal: ${signal})`);
        if (this._dataSource.isInitialized) {
            await this._dataSource.destroy();
            this.logger.log('Database connection closed.');
        }
    }

    // ── Health / diagnostics ───────────────────────────────────────────────────

    /**
     * Sends a lightweight `SELECT 1` to verify the PostgreSQL connection.
     * Used by health checks and on module init.
     */
    async checkConnection(): Promise<boolean> {
        try {
            await this._dataSource.query('SELECT 1');
            this.logger.log('PostgreSQL connection established successfully.');
            return true;
        } catch (error) {
            this.logger.error('PostgreSQL connection failed.', (error as Error).stack);
            return false;
        }
    }

    /**
     * Returns key runtime stats about the connection pool and database.
     * Useful for a /health endpoint or admin dashboards.
     */
    async getDatabaseInfo(): Promise<{
        isConnected: boolean;
        database: string;
        host: string;
        port: number;
        migrations: string[];
        entities: string[];
    }> {
        const options = this._dataSource.options as {
            host: string;
            port: number;
            database: string;
        };

        const isConnected = await this.checkConnection();
        const executedMigrations = isConnected
            ? await this._dataSource
                  .showMigrations()
                  .then(() =>
                      this._dataSource.query<{ name: string }[]>(
                          `SELECT name FROM typeorm_migrations ORDER BY id DESC LIMIT 10`,
                      ),
                  )
                  .catch(() => [])
            : [];

        return {
            isConnected,
            database: options.database,
            host: options.host,
            port: options.port,
            migrations: (executedMigrations as { name: string }[]).map((m) => m.name),
            entities: this._dataSource.entityMetadatas.map((e) => e.name),
        };
    }

    // ── Migration helpers ──────────────────────────────────────────────────────

    /** Run all pending migrations programmatically (e.g. in tests or CI). */
    async runMigrations(): Promise<void> {
        this.logger.log('Running pending migrations...');
        const ran = await this._dataSource.runMigrations({
            transaction: 'all',
        });
        if (ran.length === 0) {
            this.logger.log('No pending migrations.');
        } else {
            ran.forEach((m) => this.logger.log(`Ran migration: ${m.name}`));
        }
    }

    /** Revert the last executed migration (use with caution). */
    async revertLastMigration(): Promise<void> {
        this.logger.warn('Reverting last migration...');
        await this._dataSource.undoLastMigration({ transaction: 'all' });
        this.logger.warn('Last migration reverted.');
    }

    // ── Raw access (escape hatch) ─────────────────────────────────────────────

    /**
     * Exposes the raw DataSource for edge-cases where injecting it
     * directly into a feature service isn't possible.
     */
    getDataSource(): DataSource {
        return this._dataSource;
    }
}
