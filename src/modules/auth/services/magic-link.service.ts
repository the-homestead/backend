import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { auth } from '../auth.main';
import { SendMagicLinkDto } from '../dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

/**
 * Service for magic link authentication flows.
 *
 * Integrates with Better Auth to provide magic link send and verify flows.
 *
 * @see {@link https://better-auth.com/docs/plugins/magic-link Better Auth: Magic Link Plugin}
 */
@Injectable()
export class MagicLinkService {
    /**
     * Send a magic link to the user's email address.
     * @param body DTO with email address
     * @param req Express request object
     * @returns Result of magic link send operation
     */
    sendMagicLink(body: SendMagicLinkDto, req: Request): Promise<Response> {
        return auth.api.signInMagicLink({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Verify a magic link token.
     * @param query Object with token and optional callback URL
     * @param req Express request object
     * @returns Result of magic link verification
     */
    verifyMagicLink(
        query: { token: string; callbackURL?: string },
        req: Request,
    ): Promise<Response> {
        return auth.api.magicLinkVerify({
            query,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}
