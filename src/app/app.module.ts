import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import 'reflect-metadata';
import { AuthModule } from '../modules/auth/auth.module';
import { DatabaseModule } from 'src/modules/database/database.module';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import { ServerResponse } from 'http';
import { AuthService } from '@thallesp/nestjs-better-auth';


const isDev = process.env.NODE_ENV !== 'production';
@Module({
    imports: [
        LoggerModule.forRoot({
            pinoHttp: {
                name: 'homestead',
                level: isDev ? 'debug' : 'info',
                base: {
                    env: process.env.NODE_ENV,
                    version: '1.0.0',
                    service: 'homestead-api',
                },
                // Dev: pretty-print with all the useful bits
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

                // Prod: structured JSON with buffered file output
                ...(isDev
                    ? {}
                    : {
                          timestamp: () => `,"time":"${new Date().toISOString()}"`,
                          base: { env: process.env.NODE_ENV, version: '1.0.0' },
                          stream: pino.destination({
                              dest: './logs/app.log',
                              minLength: 4096,
                              sync: false,
                          }),
                      }),

                genReqId: (req) => (req.headers['x-request-id'] as string) ?? randomUUID(),

                redact: ['req.headers.authorization', 'req.headers.cookie', 'req.cookies'],

                autoLogging: {
                    ignore: (req) =>
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
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
        }),
        DatabaseModule, // Initializes TypeORM and makes DataSource/repositories injectable
        AuthModule, // Integrates Better Auth globally (depends on DatabaseModule)
    ],
    controllers: [AppController],
    providers: [AppService, AuthService],
})
export class AppModule {}
