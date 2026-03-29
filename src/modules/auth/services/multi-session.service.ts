import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { auth } from '../auth.main';
import { SetActiveSessionDto } from '../dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

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
