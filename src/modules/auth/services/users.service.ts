import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { auth } from '../auth.main';
import type {
    LinkSocialDto,
    RevokeSessionDto,
    UnlinkSocialDto,
    UpdateSessionDto,
} from '../dto/users.dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

@Injectable()
export class UsersService {
    listActiveSessions(req: Request): Promise<Response> {
        return auth.api.listSessions({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    revokeSession(body: RevokeSessionDto, req: Request): Promise<Response> {
        return auth.api.revokeSession({
            body: { token: body.token },
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    revokeOtherSessions(req: Request): Promise<Response> {
        return auth.api.revokeOtherSessions({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    revokeAllSessions(req: Request): Promise<Response> {
        return auth.api.revokeSessions({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    listAccounts(req: Request): Promise<Response> {
        return auth.api.listUserAccounts({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    linkSocial(body: LinkSocialDto, req: Request): Promise<Response> {
        return auth.api.linkSocialAccount({
            body: {
                provider: body.provider as any,
                callbackURL: body.callbackURL,
            },
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    unlinkSocial(body: UnlinkSocialDto, req: Request): Promise<Response> {
        return auth.api.unlinkAccount({
            body: { providerId: body.providerId, accountId: body.accountId },
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    updateSession(body: UpdateSessionDto, req: Request): Promise<Response> {
        return auth.api.updateSession({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}
