import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { ConfigModule } from '@homestead/api/modules/config/config.module';

import { BunnyStorageService } from './services/storage.service';

/**
 * BunnyModule
 *
 * Internal storage handler for all Bunny.net storage zone communication.
 * No controllers are exposed — consumed by feature modules via DI.
 *
 * Config is read from AppConfigService under the `bunny` namespace:
 *   bunny.region       — e.g. "falkenstein"
 *   bunny.storageZone  — storage zone name from Bunny dashboard
 *   bunny.accessKey    — storage zone password / access key
 *   bunny.publicUrl    — CDN URL for serving files
 *
 * NOTE: install the SDK first:
 *   pnpm add @bunny.net/storage-sdk
 */
@Module({
    imports: [
        // Both are @Global but explicit imports keep the dependency graph clear
        // and satisfy the NestJS typed module checker / eslint-plugin-nestjs-typed.
        ConfigModule,
        LoggerModule,
    ],
    providers: [BunnyStorageService],
    exports: [BunnyStorageService],
})
export class BunnyModule {}
