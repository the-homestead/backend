import getBaseDomain from '@homestead/api/lib/get-base-domain';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
    DiskHealthIndicator,
    HealthCheckService,
    HttpHealthIndicator,
    MemoryHealthIndicator,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

type HealthStatus = 'up' | 'down';

interface HealthIndicatorResult {
    status: HealthStatus;
    message?: string;
}

type HealthDetails = Record<string, HealthIndicatorResult>;

interface HealthCheckError {
    response?: {
        details?: HealthDetails;
    };
}

@ApiTags('Health')
@Controller('health')
@AllowAnonymous()
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private db: TypeOrmHealthIndicator,
        private memory: MemoryHealthIndicator,
        private readonly disk: DiskHealthIndicator,
    ) {}

    baseURL = getBaseDomain();

    @ApiOkResponse()
    @Get()
    async check() {
        try {
            const result = await this.health.check([
                () => this.http.pingCheck('trpc', `${this.baseURL}/trpc`),
                () => this.http.pingCheck('DNS', 'https://dns.homestead.systems'),
                () => this.db.pingCheck('database'),
                async () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
                async () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024),
                () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.25 }),
            ]);

            const details = result.details as HealthDetails;

            return {
                status: 'up',
                checks: Object.fromEntries(
                    Object.entries(details).map(([key, value]) => [key, value.status]),
                ),
            };
        } catch (error: unknown) {
            const err = error as HealthCheckError;

            const details: HealthDetails = err.response?.details ?? {};

            const failed = Object.entries(details)
                .filter(([, value]) => value.status === 'down')
                .map(([key]) => key);

            return {
                status: 'down',
                failed,
                checks: Object.fromEntries(
                    Object.entries(details).map(([key, value]) => [key, value.status]),
                ),
            };
        }
    }
}
