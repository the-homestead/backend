import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { auth } from '../auth.main';
import { VerifyPasskeyAuthenticationDto, VerifyPasskeyRegistrationDto } from '../dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

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
