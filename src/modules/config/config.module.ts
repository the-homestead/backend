import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { AppConfigService } from './config.service';
import { validateEnv } from './env.schema';
import { appConfig } from './namespaces/app.config';
import { authConfig } from './namespaces/auth.config';
import { bunnyConfig } from './namespaces/bunny.config';
import { databaseConfig } from './namespaces/database.config';
import { stripeConfig } from './namespaces/stripe.config';

/**
 * ConfigModule
 *
 * Marked `@Global` so every module in the app can inject `AppConfigService`
 * without importing ConfigModule locally. Register this once in AppModule.
 *
 * On startup:
 *  1. Loads .env / process.env
 *  2. Validates all variables against EnvSchema (crashes fast on missing/bad values)
 *  3. Maps variables into typed namespaced config objects via `registerAs`
 *  4. Provides `AppConfigService` as the typed accessor across the app
 */
@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            validate: validateEnv,
            load: [appConfig, authConfig, bunnyConfig, databaseConfig, stripeConfig],
        }),
    ],
    providers: [AppConfigService],
    exports: [AppConfigService],
})
export class ConfigModule {}
