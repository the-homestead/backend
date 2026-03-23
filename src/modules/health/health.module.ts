import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';

import { ConfigModule } from '@homestead/api/modules/config/config.module';

import { HealthController } from './health.controller';

@Module({
    imports: [
        TerminusModule.forRoot({
            // Give in-flight requests time to drain before the process exits.
            // 200ms is too tight for any real I/O — 3s is a safer default.
            gracefulShutdownTimeoutMs: 3000,
            // Suppress Terminus's own logger in favour of Pino so all logs
            // go through the same structured pipeline.
            logger: false,
        }),
        HttpModule,
        ConfigModule,
        LoggerModule,
    ],
    controllers: [HealthController],
})
export class HealthModule {}
