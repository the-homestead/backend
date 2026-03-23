import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    ssl: boolean;
    pool: {
        min: number;
        max: number;
    };
    migrationsRun: boolean;
}

export const databaseConfig = registerAs(
    'database',
    (): DatabaseConfig => ({
        host: process.env.PGHOST!,
        port: parseInt(process.env.PGPORT!, 10),
        username: process.env.PGUSER!,
        password: process.env.PGPASSWORD!,
        database: process.env.PGDATABASE!,
        ssl: process.env.PGSSLMODE === 'require',
        pool: {
            min: parseInt(process.env.PGPOOL_MIN!, 10),
            max: parseInt(process.env.PGPOOL_MAX!, 10),
        },
        migrationsRun: process.env.PGMIGRATIONS_RUN === 'true',
    }),
);
