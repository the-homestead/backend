import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { auth } from '../auth.main';
import type {
    CreateApiKeyDto,
    GenerateBackupCodesDTO,
    GenerateTotpUriDto,
    SendEmailOtpDto,
    SendMagicLinkDto,
    SetActiveSessionDto,
    SignInUsernameDto,
    SignInWithEmailOtpDto,
    UpdateApiKeyDto,
    UpdateUsernameDto,
    VerifyEmailOtpDto,
    VerifyPasskeyAuthenticationDto,
    VerifyPasskeyRegistrationDto,
    ViewBackupCodesDTO,
} from '../dto/misc.dto';
import type {
    DisableTwoFactorDto,
    EnableTwoFactorDto,
    VerifyBackupCodeDto,
    VerifyTotpDto,
} from '../dto/two-factor.dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';
// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class TwoFactorService {
    generateTotpUri(body: GenerateTotpUriDto, req: Request): Promise<Response> {
        return auth.api.generateTOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    enableTwoFactor(body: EnableTwoFactorDto, req: Request): Promise<Response> {
        return auth.api.enableTwoFactor({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    disableTwoFactor(body: DisableTwoFactorDto, req: Request): Promise<Response> {
        return auth.api.disableTwoFactor({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    verifyTotp(body: VerifyTotpDto, req: Request): Promise<Response> {
        return auth.api.verifyTOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    verifyBackupCode(body: VerifyBackupCodeDto, req: Request): Promise<Response> {
        return auth.api.verifyBackupCode({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    viewBackupCodes(body: ViewBackupCodesDTO, req: Request): Promise<Response> {
        return auth.api.viewBackupCodes({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    generateBackupCodes(body: GenerateBackupCodesDTO, req: Request): Promise<Response> {
        return auth.api.generateBackupCodes({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class MagicLinkService {
    sendMagicLink(body: SendMagicLinkDto, req: Request): Promise<Response> {
        return auth.api.signInMagicLink({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

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

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class EmailOtpService {
    sendOtp(body: SendEmailOtpDto, req: Request): Promise<Response> {
        return auth.api.sendVerificationOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    verifyEmail(body: VerifyEmailOtpDto, req: Request): Promise<Response> {
        return auth.api.verifyEmailOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    signIn(body: SignInWithEmailOtpDto, req: Request): Promise<Response> {
        return auth.api.signInEmailOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class PasskeyService {
    getRegistrationOptions(req: Request): Promise<Response> {
        return auth.api.generatePasskeyRegistrationOptions({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    verifyRegistration(body: VerifyPasskeyRegistrationDto, req: Request): Promise<Response> {
        return auth.api.verifyPasskeyRegistration({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    getAuthenticationOptions(req: Request): Promise<Response> {
        return auth.api.generatePasskeyAuthenticationOptions({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    verifyAuthentication(body: VerifyPasskeyAuthenticationDto, req: Request): Promise<Response> {
        return auth.api.verifyPasskeyAuthentication({
            body: body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    listPasskeys(req: Request): Promise<Response> {
        return auth.api.listPasskeys({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    deletePasskey(body: { id: string }, req: Request): Promise<Response> {
        return auth.api.deletePasskey({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class UsernameService {
    signIn(body: SignInUsernameDto, req: Request): Promise<Response> {
        return auth.api.signInUsername({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    updateUsername(body: UpdateUsernameDto, req: Request): Promise<Response> {
        return auth.api.updateUser({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class MultiSessionService {
    listDeviceSessions(req: Request): Promise<Response> {
        return auth.api.listDeviceSessions({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    setActiveSession(body: SetActiveSessionDto, req: Request): Promise<Response> {
        return auth.api.setActiveSession({
            body: { sessionToken: body.sessionToken },
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    revokeDeviceSession(body: { sessionToken: string }, req: Request): Promise<Response> {
        return auth.api.revokeDeviceSession({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class ApiKeyService {
    createApiKey(body: CreateApiKeyDto, req: Request): Promise<Response> {
        return auth.api.createApiKey({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    getApiKey(query: { id: string }, req: Request): Promise<Response> {
        return auth.api.getApiKey({
            query,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    updateApiKey(body: { keyId: string } & UpdateApiKeyDto, req: Request): Promise<Response> {
        return auth.api.updateApiKey({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    deleteApiKey(body: { keyId: string }, req: Request): Promise<Response> {
        return auth.api.deleteApiKey({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    listApiKeys(req: Request): Promise<Response> {
        return auth.api.listApiKeys({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}
