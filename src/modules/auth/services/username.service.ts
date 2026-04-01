import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { auth } from '../auth.main';
import { SignInUsernameDto, UpdateUsernameDto } from '../dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

/**
 * Service for username/password authentication flows.
 *
 * Integrates with Better Auth to provide username/password sign-in and update flows.
 *
 * @see {@link https://better-auth.com/docs/basic-usage#email--password Better Auth: Email & Password}
 */
@Injectable()
export class UsernameService {
    /**
     * Sign in using username and password.
     * @param body DTO with username and password
     * @param req Express request object
     * @returns Result of sign-in
     */
    signIn(body: SignInUsernameDto, req: Request): Promise<Response> {
        return auth.api.signInUsername({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Update the user's username.
     * @param body DTO with new username
     * @param req Express request object
     * @returns Result of update
     */
    updateUsername(body: UpdateUsernameDto, req: Request): Promise<Response> {
        return auth.api.updateUser({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}
