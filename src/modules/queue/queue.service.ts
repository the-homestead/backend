/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { randomUUID } from 'node:crypto';

import { Injectable } from '@nestjs/common';
import type { QueryResultRow } from 'pg';

import { PgPoolService } from '../database/pg-pool.service';

/**
 * Represents a job stored in the queue.
 *
 * @template TPayload - JSON payload type stored with the job.
 */
export interface Job<TPayload = unknown> extends QueryResultRow {
    id: number;
    queue: string;
    payload: TPayload;
    attempts: number;
    max_attempts: number;
    scheduled_at: Date;
    locked_at: Date | null;
    lock_token: string | null;
}

/**
 * Job returned from dequeue operations.
 *
 * Includes a lock token required to complete, retry, or fail the job.
 *
 * @template TPayload - Payload type.
 */
export type LeasedJob<TPayload = unknown> = Job<TPayload> & {
    lockToken: string;
};

/**
 * PostgreSQL-backed durable job queue using visibility-timeout leasing.
 *
 * Workers lease jobs for a fixed duration. If a worker crashes, the lease
 * expires and another worker may safely retry the job, allowing safe
 * horizontal scaling with multiple workers.
 *
 * @example
 * ```ts
 * const job = await this.queueService.dequeue<{ email: string }>('emails');
 * if (!job) return;
 *
 * try {
 *   await sendEmail(job.payload.email);
 *   await this.queueService.complete(job.id, job.lockToken);
 * } catch (err) {
 *   await this.queueService.retry(job.id, job.lockToken, 30);
 * }
 * ```
 */
@Injectable()
export class QueueService {
    constructor(private readonly pgPool: PgPoolService) {}

    /**
     * Adds a new job to the queue.
     *
     * @template TPayload - JSON payload type.
     * @param queue - Queue name.
     * @param payload - Job payload.
     * @param scheduledAt - Time when the job becomes eligible for processing. Defaults to now.
     */
    async enqueue<TPayload>(
        queue: string,
        payload: TPayload,
        scheduledAt: Date = new Date(),
    ): Promise<void> {
        await this.pgPool.query(
            `INSERT INTO jobs (queue, payload, scheduled_at)
             VALUES ($1, $2, $3)`,
            [queue, payload, scheduledAt],
        );
    }

    /**
     * Leases the next available job from a queue.
     *
     * A lease prevents other workers from processing the same job until the
     * visibility timeout expires.
     *
     * @template TPayload - Expected payload type.
     * @param queue - Queue name.
     * @param visibilityTimeoutSeconds - Lease duration in seconds. Defaults to 60.
     * @returns A leased job, or `undefined` if none are available.
     */
    async dequeue<TPayload = unknown>(
        queue: string,
        visibilityTimeoutSeconds = 60,
    ): Promise<LeasedJob<TPayload> | undefined> {
        const lockToken = randomUUID();

        const result = await this.pgPool.query<Job<TPayload>>(
            `
            WITH next_job AS (
                SELECT id
                FROM jobs
                WHERE queue = $1
                  AND attempts < max_attempts
                  AND scheduled_at <= NOW()
                  AND (
                    locked_at IS NULL
                    OR locked_at < NOW() - ($2 || ' seconds')::interval
                  )
                ORDER BY scheduled_at
                LIMIT 1
                FOR UPDATE SKIP LOCKED
            )
            UPDATE jobs
            SET attempts    = attempts + 1,
                locked_at   = NOW(),
                lock_token  = $3
            FROM next_job
            WHERE jobs.id = next_job.id
            RETURNING jobs.*
            `,
            [queue, visibilityTimeoutSeconds, lockToken],
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const job = result.rows[0];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return job ? { ...job, lockToken } : undefined;
    }

    /**
     * Marks a leased job as successfully completed and removes it.
     *
     * @param jobId - Job ID.
     * @param lockToken - Lease token received from {@link dequeue}.
     */
    async complete(jobId: number, lockToken: string): Promise<void> {
        await this.pgPool.query(
            `DELETE FROM jobs
             WHERE id = $1
               AND lock_token = $2`,
            [jobId, lockToken],
        );
    }

    /**
     * Releases a leased job back to the queue and schedules it for retry.
     *
     * @param jobId - Job ID.
     * @param lockToken - Lease token received from {@link dequeue}.
     * @param delaySeconds - Delay before the job becomes available again. Defaults to 30.
     */
    async retry(jobId: number, lockToken: string, delaySeconds = 30): Promise<void> {
        await this.pgPool.query(
            `UPDATE jobs
             SET locked_at    = NULL,
                 lock_token   = NULL,
                 scheduled_at = NOW() + ($3 || ' seconds')::interval
             WHERE id = $1
               AND lock_token = $2`,
            [jobId, lockToken, delaySeconds],
        );
    }

    /**
     * Permanently marks a job as failed by exhausting its remaining attempts.
     *
     * The error message is merged into the job's JSONB payload under the key `error`.
     *
     * @param jobId - Job ID.
     * @param lockToken - Lease token received from {@link dequeue}.
     * @param error - Error object or message string.
     */
    async fail(jobId: number, lockToken: string, error: unknown): Promise<void> {
        const message = error instanceof Error ? error.message : String(error);

        await this.pgPool.query(
            `UPDATE jobs
             SET attempts   = max_attempts,
                 locked_at  = NULL,
                 lock_token = NULL,
                 payload    = payload || jsonb_build_object('error', $3)
             WHERE id = $1
               AND lock_token = $2`,
            [jobId, lockToken, message],
        );
    }
}
