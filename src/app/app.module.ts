import 'reflect-metadata';

import { randomUUID } from 'crypto';
import { IncomingMessage, ServerResponse } from 'http';

import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';

import { AuthModule } from '@homestead/api/modules/auth/auth.module';
import { BunnyModule } from '@homestead/api/modules/bunny/bunny.module';
import { ConfigModule } from '@homestead/api/modules/config/config.module';
import { DatabaseModule } from '@homestead/api/modules/database/database.module';
import { AuthService } from '@thallesp/nestjs-better-auth';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from '../modules/health/health.module';

// Safe to read before ConfigModule bootstraps — only used for logger transport
// selection, not for any business logic or secrets.
const isDev = process.env.NODE_ENV !== 'production';

@Module({
    imports: [
        // ── Logging ────────────────────────────────────────────────────────────
        // Must be first so every subsequent module's PinoLogger injections resolve.
        LoggerModule.forRoot({
            pinoHttp: {
                name: 'homestead',
                level: isDev ? 'debug' : 'info',
                base: {
                    env: process.env.NODE_ENV,
                    version: '1.0.0',
                    service: 'homestead-api',
                },
                transport: isDev
                    ? {
                          target: 'pino-pretty',
                          options: {
                              colorize: true,
                              levelFirst: true,
                              translateTime: 'SYS:HH:MM:ss',
                              ignore: 'pid,hostname,req.headers,req.remoteAddress,req.remotePort',
                              messageFormat: '{req.method} {req.url} → {msg}',
                              singleLine: false,
                          },
                      }
                    : undefined,

                ...(isDev
                    ? {}
                    : {
                          timestamp: () => `,"time":"${new Date().toISOString()}"`,
                          stream: pino.destination({
                              dest: './logs/app.log',
                              minLength: 4096,
                              sync: false,
                          }),
                      }),

                genReqId: (req: IncomingMessage) =>
                    (req.headers['x-request-id'] as string) ?? randomUUID(),

                redact: ['req.headers.authorization', 'req.headers.cookie', 'req.cookies'],

                autoLogging: {
                    ignore: (req: IncomingMessage) =>
                        typeof req.url === 'string' && ['/health', '/metrics'].includes(req.url),
                },

                serializers: {
                    req: (req: IncomingMessage & { id: string }) => ({
                        id: req.id,
                        method: req.method,
                        url: req.url,
                    }),
                    res: (res: ServerResponse) => ({
                        statusCode: res.statusCode,
                    }),
                },
            },
        }),

        // ── Config ─────────────────────────────────────────────────────────────
        // Global + validates all env vars at startup via EnvSchema.
        // Provides AppConfigService to every module without local imports.
        // Replaces the raw ConfigModule.forRoot() that was here before.
        ConfigModule,

        // ── Features ───────────────────────────────────────────────────────────
        DatabaseModule, // TypeORM + DataSource, depends on ConfigModule (database.*)
        AuthModule, // Better Auth globally, depends on DatabaseModule
        BunnyModule, // Bunny storage handler, depends on ConfigModule (bunny.*)
        HealthModule, // /health endpoint with app + dependency health checks
    ],
    controllers: [AppController],
    providers: [AppService, AuthService],
})
export class AppModule {}
