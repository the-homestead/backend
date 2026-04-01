import type { IncomingMessage } from 'node:http';

import { Injectable, Logger } from '@nestjs/common';

import { RoleOrArray } from '../access/auth.access';
import { auth } from '../auth.main';

/**
 * AdminService
 *
 * All operations require a valid admin session — the caller must have the
 * 'admin' role or their userId listed in adminUserIds in auth.main.ts.
 * Every auth.api call passes the request headers so better-auth can verify
 * the session server-side.
 *
 * API reference: https://better-auth.com/docs/plugins/admin
 */
@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);

    private toHeaders(req: IncomingMessage): Headers {
        return new Headers(req.headers as Record<string, string>);
    }

    // ── User management ──────────────────────────────────────────────────────

    /** Create a new user account. */
    async createUser(
        req: IncomingMessage,
        body: {
            email: string;
            password: string | undefined;
            name: string;
            role?: RoleOrArray;
            data?: Record<string, unknown>;
        },
    ) {
        return auth.api.createUser({
            headers: this.toHeaders(req),
            body,
        });
    }

    /** List users with optional search, filter, sort, and pagination. */
    async listUsers(
        req: IncomingMessage,
        query?: {
            searchValue?: string | undefined;
            searchField?: 'email' | 'name' | undefined;
            searchOperator?: 'contains' | 'starts_with' | 'ends_with' | undefined;
            limit?: string | number;
            offset?: string | number | undefined;
            sortBy?: string | undefined;
            sortDirection?: 'asc' | 'desc' | undefined;
            filterField?: string | undefined;
            filterValue?: string | number | boolean | string[] | number[] | undefined;
            filterOperator?:
                | 'contains'
                | 'starts_with'
                | 'ends_with'
                | 'eq'
                | 'ne'
                | 'gt'
                | 'gte'
                | 'lt'
                | 'lte'
                | 'in'
                | 'not_in'
                | undefined;
        },
    ) {
        return auth.api.listUsers({
            headers: this.toHeaders(req),
            query: query ?? {},
        });
    }

    /** Update arbitrary fields on a user. */
    async updateUser(req: IncomingMessage, userId: string, data: Record<string, unknown>) {
        return auth.api.adminUpdateUser({
            headers: this.toHeaders(req),
            body: { userId, data },
        });
    }

    /** Set a user's role. */
    async setRole(req: IncomingMessage, userId: string, role: RoleOrArray) {
        return auth.api.setRole({
            headers: this.toHeaders(req),
            body: { userId, role },
        });
    }

    /** Reset a user's password without requiring the current password. */
    async setUserPassword(req: IncomingMessage, userId: string, newPassword: string) {
        return auth.api.setUserPassword({
            headers: this.toHeaders(req),
            body: { userId, newPassword },
        });
    }

    // ── Ban / unban ──────────────────────────────────────────────────────────

    /**
     * Ban a user. Prevents sign-in and revokes all existing sessions.
     * @param banExpiresIn  Seconds until the ban expires. Omit for a permanent ban.
     */
    async banUser(
        req: IncomingMessage,
        userId: string,
        banReason?: string,
        banExpiresIn?: number,
    ): Promise<void> {
        await auth.api.banUser({
            headers: this.toHeaders(req),
            body: { userId, banReason, banExpiresIn },
        });
        this.logger.warn(`Banned user ${userId}. Reason: ${banReason ?? 'unspecified'}`);
    }

    /** Remove a ban, allowing the user to sign in again. */
    async unbanUser(req: IncomingMessage, userId: string): Promise<void> {
        await auth.api.unbanUser({
            headers: this.toHeaders(req),
            body: { userId },
        });
        this.logger.log(`Unbanned user ${userId}`);
    }

    // ── Session management ────────────────────────────────────────────────────

    /** List all active sessions for a given user. */
    async listUserSessions(req: IncomingMessage, userId: string) {
        return auth.api.listUserSessions({
            headers: this.toHeaders(req),
            body: { userId },
        });
    }

    /** Revoke a specific session by its token. */
    async revokeUserSession(req: IncomingMessage, sessionToken: string): Promise<void> {
        await auth.api.revokeUserSession({
            headers: this.toHeaders(req),
            body: { sessionToken },
        });
        this.logger.log('User session revoked');
    }

    /** Revoke all sessions for a given user (e.g. after a password reset). */
    async revokeAllUserSessions(req: IncomingMessage, userId: string): Promise<void> {
        await auth.api.revokeUserSessions({
            headers: this.toHeaders(req),
            body: { userId },
        });
        this.logger.log(`All sessions revoked for user ${userId}`);
    }

    // ── Impersonation ─────────────────────────────────────────────────────────

    /**
     * Create a session that mimics the specified user.
     * Active for 1 hour or until the browser session ends.
     */
    async impersonate(req: IncomingMessage, userId: string) {
        return auth.api.impersonateUser({
            headers: this.toHeaders(req),
            body: { userId },
        });
    }

    /** Stop an active impersonation and return to the admin session. */
    async stopImpersonating(req: IncomingMessage) {
        return auth.api.stopImpersonating({
            headers: this.toHeaders(req),
        });
    }

    // ── API Keys ──────────────────────────────────────────────────────────────

    /** Create an API key on behalf of a user. */
    async createApiKey(
        req: IncomingMessage,
        userId: string,
        options?: { name?: string; expiresIn?: number; metadata?: Record<string, unknown> },
    ) {
        return auth.api.createApiKey({
            headers: this.toHeaders(req),
            body: { userId, ...options },
        });
    }

    /** Revoke an API key by its ID. */
    async revokeApiKey(req: IncomingMessage, keyId: string): Promise<void> {
        await auth.api.deleteApiKey({
            headers: this.toHeaders(req),
            body: { keyId },
        });
        this.logger.log(`API key ${keyId} revoked`);
    }

    /** List all API keys for a user. */
    async listApiKeys(req: IncomingMessage, userId: string) {
        //! TODO: better-auth doesnt provide a listApiKeys endpoing with user specific filtering, so this currently only returns api keys for the user making the request via headers given, which is not ideal for admin use cases. We should add a listApiKeys endpoint that accepts a userId in the body for admin users, and update the type definitions accordingly.
        // return auth.api.listApiKeys({
        //   headers: this.toHeaders(req),
        //   body: { userId },
        // });
    }
}
