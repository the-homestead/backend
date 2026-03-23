/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { beforeEach, describe, expect, it, jest } from 'bun:test';
import { HealthCheckResult, HealthCheckService, HealthCheckStatus } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

import { AppConfigService } from '@homestead/api/modules/config/config.service';

import { HealthController } from './health.controller';

// ---------------------------------------------------------------------------
// Shared mock factories
// ---------------------------------------------------------------------------

const mockHealthResult = (status: HealthCheckStatus): HealthCheckResult => ({
    status,
    details: {
        api: { status: status === 'ok' ? 'up' : 'down' },
        database: { status: status === 'ok' ? 'up' : 'down' },
        memory_heap: { status: 'up' },
        memory_rss: { status: 'up' },
        storage: { status: 'up' },
    },
    error: {},
    info: {},
});

const makeMocks = () => ({
    healthService: {
        check: jest.fn(),
    },
    http: { pingCheck: jest.fn() },
    db: { pingCheck: jest.fn() },
    memory: {
        checkHeap: jest.fn(),
        checkRSS: jest.fn(),
    },
    disk: { checkStorage: jest.fn() },
    config: {
        app: { host: 'http://localhost:3000' },
    },
    logger: {
        debug: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('HealthController', () => {
    let controller: HealthController;
    let mocks: ReturnType<typeof makeMocks>;

    beforeEach(async () => {
        mocks = makeMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                { provide: HealthCheckService, useValue: mocks.healthService },
                { provide: 'HttpHealthIndicator', useValue: mocks.http },
                { provide: 'TypeOrmHealthIndicator', useValue: mocks.db },
                { provide: 'MemoryHealthIndicator', useValue: mocks.memory },
                { provide: 'DiskHealthIndicator', useValue: mocks.disk },
                { provide: AppConfigService, useValue: mocks.config },
                {
                    provide: PinoLogger,
                    useValue: mocks.logger,
                },
            ],
        }).compile();

        controller = module.get<HealthController>(HealthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('check()', () => {
        it('returns status "up" when all indicators pass', async () => {
            mocks.healthService.check.mockResolvedValueOnce(mockHealthResult('ok'));

            const result = await controller.check();

            expect(result.status).toBe('up');
            expect(result.checks).toBeDefined();
        });

        it('returns status "down" with failed list when a check throws', async () => {
            const degradedDetails = {
                api: { status: 'up' },
                database: { status: 'down' },
                memory_heap: { status: 'up' },
                memory_rss: { status: 'up' },
                storage: { status: 'up' },
            };

            mocks.healthService.check.mockRejectedValueOnce({
                response: { details: degradedDetails },
            });

            const result = await controller.check();

            expect(result.status).toBe('down');

            if (result.status === 'down') {
                expect(result.failed).toContain('database');
                expect(result.failed).not.toContain('api');
            }
        });

        it('returns empty checks when error has no response details', async () => {
            mocks.healthService.check.mockRejectedValueOnce(new Error('Unexpected failure'));

            const result = await controller.check();

            expect(result.status).toBe('down');
            expect(result.checks).toEqual({});
        });

        it('logs a warning when checks degrade', async () => {
            mocks.healthService.check.mockRejectedValueOnce({
                response: { details: { database: { status: 'down' } } },
            });

            await controller.check();

            expect(mocks.logger.warn).toHaveBeenCalled();
        });

        it('logs debug on success', async () => {
            mocks.healthService.check.mockResolvedValueOnce(mockHealthResult('ok'));

            await controller.check();

            expect(mocks.logger.debug).toHaveBeenCalled();
        });
    });
});
