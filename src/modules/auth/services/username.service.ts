import { Injectable } from '@nestjs/common';
import { auth } from '../auth.main';
import { SignInUsernameDto, UpdateUsernameDto } from '../dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';
import type { Request } from 'express';

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
