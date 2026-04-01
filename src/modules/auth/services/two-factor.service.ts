import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { auth } from '../auth.main';
import {
    DisableTwoFactorDto,
    EnableTwoFactorDto,
    GenerateBackupCodesDTO,
    GenerateTotpUriDto,
    VerifyBackupCodeDto,
    VerifyTotpDto,
    ViewBackupCodesDTO,
} from '../dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

/**
 * Service for two-factor authentication (2FA) operations.
 *
 * Integrates with Better Auth to provide TOTP, backup codes, and 2FA enable/disable flows.
 *
 * @see {@link https://better-auth.com/docs/plugins/2fa Better Auth: Two-Factor Authentication (2FA) Plugin}
 */
@Injectable()
export class TwoFactorService {
    /**
     * Generate a TOTP URI for 2FA setup (e.g., for use with authenticator apps).
     * @param body DTO with user/session info
     * @param req Express request object
     * @returns TOTP URI and QR code data
     */
    generateTotpUri(body: GenerateTotpUriDto, req: Request): Promise<Response> {
        return auth.api.generateTOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Enable two-factor authentication for a user.
     * @param body DTO with TOTP code and user info
     * @param req Express request object
     * @returns Result of enabling 2FA
     */
    enableTwoFactor(body: EnableTwoFactorDto, req: Request): Promise<Response> {
        return auth.api.enableTwoFactor({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Disable two-factor authentication for a user.
     * @param body DTO with user info
     * @param req Express request object
     * @returns Result of disabling 2FA
     */
    disableTwoFactor(body: DisableTwoFactorDto, req: Request): Promise<Response> {
        return auth.api.disableTwoFactor({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Verify a TOTP code for 2FA.
     * @param body DTO with TOTP code and user info
     * @param req Express request object
     * @returns Result of verification
     */
    verifyTotp(body: VerifyTotpDto, req: Request): Promise<Response> {
        return auth.api.verifyTOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Verify a backup code for 2FA.
     * @param body DTO with backup code and user info
     * @param req Express request object
     * @returns Result of verification
     */
    verifyBackupCode(body: VerifyBackupCodeDto, req: Request): Promise<Response> {
        return auth.api.verifyBackupCode({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * View all backup codes for the user.
     * @param body DTO with user info
     * @param req Express request object
     * @returns List of backup codes
     */
    viewBackupCodes(body: ViewBackupCodesDTO, req: Request): Promise<Response> {
        return auth.api.viewBackupCodes({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    /**
     * Generate new backup codes for the user (invalidates old ones).
     * @param body DTO with user info
     * @param req Express request object
     * @returns List of new backup codes
     */
    generateBackupCodes(body: GenerateBackupCodesDTO, req: Request): Promise<Response> {
        return auth.api.generateBackupCodes({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}
