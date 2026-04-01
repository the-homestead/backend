import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { auth } from '../auth.main';
import { SendEmailOtpDto, SignInWithEmailOtpDto, VerifyEmailOtpDto } from '../dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

/**
 * Service for email-based one-time password (OTP) authentication flows.
 *
 * Integrates with Better Auth to provide email OTP send, verify, and sign-in flows.
 *
 * @see {@link https://better-auth.com/docs/plugins/email-otp Better Auth: Email OTP Plugin}
 */
@Injectable()
export class EmailOtpService {
    /**
     * Send a one-time password (OTP) to the user's email address.
     * @param body DTO with email address
     * @param req Express request object
     * @returns Result of OTP send operation
     */
    sendOtp(body: SendEmailOtpDto, req: Request): Promise<Response> {
        return auth.api.sendVerificationOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Verify an email OTP code.
     * @param body DTO with email and OTP code
     * @param req Express request object
     * @returns Result of verification
     */
    verifyEmail(body: VerifyEmailOtpDto, req: Request): Promise<Response> {
        return auth.api.verifyEmailOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Sign in using an email OTP code.
     * @param body DTO with email and OTP code
     * @param req Express request object
     * @returns Result of sign-in
     */
    signIn(body: SignInWithEmailOtpDto, req: Request): Promise<Response> {
        return auth.api.signInEmailOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}
