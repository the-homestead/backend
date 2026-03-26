/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import type { Notification, PoolClient } from 'pg';
import { PgPoolService } from '../database/pg-pool.service';

/**
 * Callback invoked when a message is received on a channel.
 *
 * @template T - Message payload type.
 */
export type MessageCallback<T = unknown> = (message: T) => void;

/**
 * PostgreSQL pub/sub service using `LISTEN` / `NOTIFY`.
 *
 * Each subscribed channel holds a **dedicated** `PoolClient` in listening mode.
 * Publishing uses the shared pool and releases the client immediately after.
 *
 * The service implements `OnApplicationShutdown` to cleanly `UNLISTEN` and
 * release all held clients when the application stops.
 *
 * > **Important:** PostgreSQL does not allow parameterised identifiers in
 * > `LISTEN` / `UNLISTEN` statements. Channel names must be validated or
 * > allowlisted by the caller before being passed to {@link subscribe}.
 *
 * @example
 * ```ts
 * await this.pubSubService.subscribe<{ text: string }>('chat', (msg) => {
 *   console.log(msg.text);
 * });
 *
 * await this.pubSubService.publish('chat', { text: 'hello' });
 * ```
 */
@Injectable()
export class PubSubService implements OnApplicationShutdown {
    private readonly logger = new Logger(PubSubService.name);
    private readonly listeners = new Map<string, PoolClient>();

    constructor(private readonly pgPool: PgPoolService) {}

    // ── Lifecycle ──────────────────────────────────────────────────────────────

    /**
     * Unlistens and releases all active channel clients on shutdown.
     */
    async onApplicationShutdown(signal?: string): Promise<void> {
        this.logger.log(
            `Shutting down PubSubService (signal: ${signal ?? 'unknown'}). Releasing ${this.listeners.size} listener(s).`,
        );

        await Promise.allSettled([...this.listeners.keys()].map((ch) => this.unsubscribe(ch)));
    }

    // ── Public API ─────────────────────────────────────────────────────────────

    /**
     * Publishes a message to a PostgreSQL channel.
     *
     * The payload is JSON-serialised before being passed to `pg_notify`.
     *
     * @template T - Message payload type.
     * @param channel - Target channel name.
     * @param message - JSON-serialisable message payload.
     */
    async publish<T>(channel: string, message: T): Promise<void> {
        const payload = JSON.stringify(message);
        await this.pgPool.query('SELECT pg_notify($1, $2)', [channel, payload]);
    }

    /**
     * Subscribes to a channel and registers a message callback.
     *
     * Acquires a dedicated `PoolClient` and keeps it in `LISTEN` mode.
     * Calling this again for the same channel replaces the existing subscription.
     *
     * @template T - Expected message payload type.
     * @param channel - Channel name (must be trusted / pre-validated).
     * @param callback - Handler invoked for each incoming message.
     */
    async subscribe<T>(channel: string, callback: MessageCallback<T>): Promise<void> {
        if (this.listeners.has(channel)) {
            await this.unsubscribe(channel);
        }

        const client = await this.pgPool.connect();

        // pg identifiers cannot be parameterised — channel names must be trusted.
        await client.query(`LISTEN ${channel}`);

        client.on('notification', (msg: Notification) => {
            if (msg.channel !== channel || !msg.payload) return;

            try {
                callback(JSON.parse(msg.payload) as T);
            } catch (error) {
                this.logger.error(
                    `Failed to parse message on channel "${channel}"`,
                    (error as Error).stack,
                );
            }
        });

        this.listeners.set(channel, client);
        this.logger.debug(`Subscribed to channel "${channel}".`);
    }

    /**
     * Unsubscribes from a channel and releases its dedicated client.
     *
     * No-op if the channel was never subscribed.
     *
     * @param channel - Channel name.
     */
    async unsubscribe(channel: string): Promise<void> {
        const client = this.listeners.get(channel);
        if (!client) return;

        try {
            await client.query(`UNLISTEN ${channel}`);
        } catch (error) {
            this.logger.warn(
                `Error during UNLISTEN for channel "${channel}": ${(error as Error).message}`,
            );
        } finally {
            client.release();
            this.listeners.delete(channel);
            this.logger.debug(`Unsubscribed from channel "${channel}".`);
        }
    }

    /**
     * Returns the set of channels currently being listened on.
     */
    get activeChannels(): string[] {
        return [...this.listeners.keys()];
    }
}
