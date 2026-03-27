import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { auth } from '../auth.main';
import {
    GenerateTotpUriDto,
    EnableTwoFactorDto,
    DisableTwoFactorDto,
    VerifyTotpDto,
    VerifyBackupCodeDto,
    ViewBackupCodesDTO,
    GenerateBackupCodesDTO,
} from '../dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

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
