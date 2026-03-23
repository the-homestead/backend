import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiServiceUnavailableResponse, ApiTags } from '@nestjs/swagger';
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckResult,
    HealthCheckService,
    HttpHealthIndicator,
    MemoryHealthIndicator,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { AppConfigService } from '@homestead/api/modules/config/config.service';

/** Response body when all checks pass. */
interface HealthUpResponse {
    status: 'up';
    checks: Record<string, 'up' | 'down'>;
}

/** Response body when one or more checks fail. */
interface HealthDownResponse {
    status: 'down';
    failed: string[];
    checks: Record<string, 'up' | 'down'>;
}

type HealthResponse = HealthUpResponse | HealthDownResponse;

@ApiTags('Health')
@Controller('health')
@AllowAnonymous()
export class HealthController {
    private readonly baseUrl: string;

    constructor(
        @InjectPinoLogger(HealthController.name)
        private readonly logger: PinoLogger,
        private readonly health: HealthCheckService,
        private readonly http: HttpHealthIndicator,
        private readonly db: TypeOrmHealthIndicator,
        private readonly memory: MemoryHealthIndicator,
        private readonly disk: DiskHealthIndicator,
        private readonly config: AppConfigService,
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        this.baseUrl = this.config.app.host;
    }

    @Get()
    @HealthCheck()
    @ApiOkResponse({ description: 'All systems operational' })
    @ApiServiceUnavailableResponse({ description: 'One or more checks failed' })
    async check(): Promise<HealthResponse> {
        try {
            const result: HealthCheckResult = await this.health.check([
                () => this.db.pingCheck('database'),
                () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
                () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024),
                () =>
                    this.disk.checkStorage('storage', {
                        path: '/',
                        // Warn when less than 25% disk space remains
                        thresholdPercent: 0.75,
                    }),
            ]);

            const checks = this.buildChecks(result.details);

            this.logger.debug({ checks }, 'Health check passed');

            return { status: 'up', checks };
        } catch (error: unknown) {
            const checks = this.extractChecks(error);
            const failed = Object.entries(checks)
                .filter(([, status]) => status === 'down')
                .map(([key]) => key);

            this.logger.warn({ failed, checks }, 'Health check degraded');

            return { status: 'down', failed, checks };
        }
    }

    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    private buildChecks(details: HealthCheckResult['details']): Record<string, 'up' | 'down'> {
        return Object.fromEntries(
            Object.entries(details).map(([key, value]) => {
                const indicator = value;
                const status: 'up' | 'down' = indicator?.status === 'up' ? 'up' : 'down';
                return [key, status];
            }),
        );
    }

    private extractChecks(error: unknown): Record<string, 'up' | 'down'> {
        if (
            error !== null &&
            typeof error === 'object' &&
            'response' in error &&
            error.response !== null &&
            typeof error.response === 'object' &&
            'details' in error.response &&
            typeof error.response.details === 'object' &&
            error.response.details !== null
        ) {
            return this.buildChecks(error.response.details as HealthCheckResult['details']);
        }

        return {};
    }
}
