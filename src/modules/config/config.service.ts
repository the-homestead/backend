import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { AppConfig } from './namespaces/app.config';
import { AuthConfig } from './namespaces/auth.config';
import { BunnyConfig } from './namespaces/bunny.config';
import { DatabaseConfig } from './namespaces/database.config';
import { StripeConfig } from './namespaces/stripe.config';

/**
 * Shape of the full config map — passed to NestConfigService as a generic so
 * `getOrThrow('namespace')` returns a concrete type instead of flowing through
 * `any`, which would trigger @typescript-eslint/no-unsafe-* across consumers.
 */
interface ConfigMap {
    app: AppConfig;
    auth: AuthConfig;
    bunny: BunnyConfig;
    database: DatabaseConfig;
    stripe: StripeConfig;
}

/**
 * Typed wrapper over NestJS ConfigService.
 *
 * Instead of calling `configService.get<SomeType>('namespace.key')` with
 * string keys scattered across the codebase, inject this service and access
 * each namespace as a strongly-typed property.
 *
 * @example
 * ```typescript
 * constructor(private readonly config: AppConfigService) {}
 *
 * doSomething() {
 *   const port = this.config.app.port;
 *   const dbHost = this.config.database.host;
 * }
 * ```
 */
@Injectable()
export class AppConfigService {
    constructor(
        // `true` as second generic enables strict mode — getOrThrow('bunny') now
        // returns `BunnyConfig` directly, not `any`, so consumers stay type-safe.
        private readonly config: NestConfigService<ConfigMap, true>,
    ) {}

    get app(): AppConfig {
        return this.config.getOrThrow('app');
    }

    get auth(): AuthConfig {
        return this.config.getOrThrow('auth');
    }

    get bunny(): BunnyConfig {
        return this.config.getOrThrow('bunny');
    }

    get database(): DatabaseConfig {
        return this.config.getOrThrow('database');
    }

    get stripe(): StripeConfig {
        return this.config.getOrThrow('stripe');
    }

    /** Shorthand: is the app running in production? */
    get isProduction(): boolean {
        return this.app.env === 'production';
    }

    /** Shorthand: is the app running in development? */
    get isDevelopment(): boolean {
        return this.app.env === 'development';
    }

    /** Shorthand: is the app running in test? */
    get isTest(): boolean {
        return this.app.env === 'test';
    }
}
