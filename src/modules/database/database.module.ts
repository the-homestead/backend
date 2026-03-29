import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig from './database.config';
import { DatabaseService } from './database.service';
import { PgPoolService } from './pg-pool.service';

@Module({
    imports: [
        ConfigModule.forFeature(databaseConfig),

        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',

                // ── Connection ──────────────────────────────────────────────────────
                host: config.getOrThrow<string>('database.host'),
                port: config.getOrThrow<number>('database.port'),
                username: config.getOrThrow<string>('database.username'),
                password: config.getOrThrow<string>('database.password'),
                database: config.getOrThrow<string>('database.name'),

                // ── SSL (auto-on in production) ─────────────────────────────────────
                ssl:
                    config.get<string>('database.sslMode') === 'require'
                        ? { rejectUnauthorized: false }
                        : false,

                // ── Entity discovery ────────────────────────────────────────────────
                autoLoadEntities: true,
                entities: [`${__dirname}/../**/*.entity{.ts,.js}`],

                // ── Migrations ──────────────────────────────────────────────────────
                migrations: [`${__dirname}/migrations/*{.ts,.js}`],
                migrationsTableName: 'typeorm_migrations',
                migrationsRun: config.get<boolean>('database.migrationsRun', false),

                // ── Dev / Prod behaviour ────────────────────────────────────────────
                synchronize: config.get<string>('NODE_ENV') === 'development',
                dropSchema: false,

                // ── Connection pool (pg-specific) ───────────────────────────────────
                extra: {
                    max: config.get<number>('database.poolMax', 10),
                    min: config.get<number>('database.poolMin', 2),
                    idleTimeoutMillis: 30_000,
                    connectionTimeoutMillis: 5_000,
                },

                // ── Logging ─────────────────────────────────────────────────────────
                logging:
                    config.get<string>('NODE_ENV') === 'development'
                        ? ['query', 'error', 'warn', 'schema', 'migration']
                        : ['error', 'warn', 'migration'],
                logger: 'advanced-console',
            }),
        }),
    ],
    providers: [DatabaseService, PgPoolService],
    exports: [DatabaseService, PgPoolService],
})
export class DatabaseModule {}
