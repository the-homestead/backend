import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { auth } from '../auth.main';
import type {
    LinkSocialDto,
    RevokeSessionDto,
    UnlinkSocialDto,
    UpdateSessionDto,
} from '../dto/users.dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

/**
 * Service for user session and social account management.
 *
 * Provides methods to list, revoke, and update user sessions, as well as link/unlink social accounts.
 * All methods forward requests to the Better Auth API and attach request headers for context.
 *
 * @see {@link https://better-auth.com/docs/introduction Better Auth}
 */
@Injectable()
export class UsersService {
    /**
     * List all active sessions for the current user.
     * @param req Express request object
     * @returns List of active sessions
     */
    listActiveSessions(req: Request): Promise<Response> {
        return auth.api.listSessions({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Revoke a specific session by token.
     * @param body DTO containing the session token
     * @param req Express request object
     * @returns Result of the revoke operation
     */
    revokeSession(body: RevokeSessionDto, req: Request): Promise<Response> {
        return auth.api.revokeSession({
            body: { token: body.token },
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Revoke all sessions except the current one.
     * @param req Express request object
     * @returns Result of the revoke operation
     */
    revokeOtherSessions(req: Request): Promise<Response> {
        return auth.api.revokeOtherSessions({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Revoke all sessions for the current user.
     * @param req Express request object
     * @returns Result of the revoke operation
     */
    revokeAllSessions(req: Request): Promise<Response> {
        return auth.api.revokeSessions({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * List all linked accounts for the current user.
     * @param req Express request object
     * @returns List of linked accounts
     */
    listAccounts(req: Request): Promise<Response> {
        return auth.api.listUserAccounts({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Link a new social account to the user.
     * @param body DTO containing provider and callback URL
     * @param req Express request object
     * @returns Result of the link operation
     */
    linkSocial(body: LinkSocialDto, req: Request): Promise<Response> {
        return auth.api.linkSocialAccount({
            body: {
                provider: body.provider as any,
                callbackURL: body.callbackURL,
            },
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Unlink a social account from the user.
     * @param body DTO containing providerId and accountId
     * @param req Express request object
     * @returns Result of the unlink operation
     */
    unlinkSocial(body: UnlinkSocialDto, req: Request): Promise<Response> {
        return auth.api.unlinkAccount({
            body: { providerId: body.providerId, accountId: body.accountId },
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Update the current session (e.g., metadata).
     * @param body DTO with session update data
     * @param req Express request object
     * @returns Result of the update operation
     */
    updateSession(body: UpdateSessionDto, req: Request): Promise<Response> {
        return auth.api.updateSession({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}
