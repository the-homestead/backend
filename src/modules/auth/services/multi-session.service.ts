import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { auth } from '../auth.main';
import { SetActiveSessionDto } from '../dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

/**
 * Service for advanced multi-session management (device/browser sessions).
 *
 * Integrates with Better Auth to provide device session listing, activation, and revocation.
 *
 * Note: As of now, there is no official Better Auth documentation page for multi-session APIs. See project discussions for details.
 */
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
