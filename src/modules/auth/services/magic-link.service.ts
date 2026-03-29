import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { auth } from '../auth.main';
import { SendMagicLinkDto } from '../dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

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
