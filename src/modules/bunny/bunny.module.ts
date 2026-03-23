import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { BunnyStorageService } from './services/storage.service';

/**
 * BunnyModule
 *
 * Internal storage handler for all Bunny.net storage zone communication.
 * No controllers are exposed — this module is consumed by other feature
 * modules (e.g. mods, projects) via DI.
 *
 * Required config keys (resolved via ConfigService under the `bunny` namespace):
 *   bunny.region       — storage region key, e.g. "falkenstein"
 *   bunny.storageZone  — storage zone name as shown in Bunny dashboard
 *   bunny.accessKey    — storage zone password / access key
 *
 * NOTE: `@bunny.net/storage-sdk` is not yet in package.json — add it:
 *   pnpm add @bunny.net/storage-sdk
 */
@Module({
    imports: [
        // ConfigModule must be globally registered in AppModule.
        // If it isn't global, import it explicitly here.
        ConfigModule,
        // LoggerModule must be globally registered in AppModule via LoggerModule.forRoot().
        // If it isn't global, import it explicitly here.
        LoggerModule,
    ],
    providers: [BunnyStorageService],
    exports: [BunnyStorageService],
})
export class BunnyModule {}
