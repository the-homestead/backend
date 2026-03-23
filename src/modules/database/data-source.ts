/**
 * data-source.ts
 *
 * Standalone DataSource used exclusively by the TypeORM CLI and
 * the better-auth TypeORM adapter for schema generation.
 *
 * Usage:
 *   bun typeorm migration:generate -d apps/backend/src/database/data-source.ts
 *   bun typeorm migration:run     -d apps/backend/src/database/data-source.ts
 *   bun typeorm migration:revert  -d apps/backend/src/database/data-source.ts
 *
 * Also pass this instance to @hedystia/better-auth-typeorm:
 *   import { AppDataSource } from './data-source';
 *   typeormAdapter(AppDataSource, { ... })
 */
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import 'dotenv/config'; // Load env vars from .env file into process.env

export const AppDataSource = new DataSource({
    type: 'postgres',

    host: process.env.PGHOST ?? 'localhost',
    port: parseInt(process.env.PGPORT ?? '5432', 10),
    username: process.env.PGUSER ?? 'postgres',
    password: process.env.PGPASSWORD ?? 'postgres',
    database: process.env.PGDATABASE ?? 'backend',

    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,

    // Discover all entities in the NX app + any shared libs
    entities: ['./src/**/*.entity{.ts,.js}'],

    migrations: ['./migrations/*{.ts,.js}'],

    migrationsTableName: 'typeorm_migrations',

    // Never use synchronize via CLI tool
    synchronize: false,
    logging: ['query', 'error', 'warn', 'schema', 'migration'],
});
