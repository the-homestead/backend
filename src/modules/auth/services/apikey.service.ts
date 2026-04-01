import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { auth } from '../auth.main';
import { CreateApiKeyDto, UpdateApiKeyDto } from '../dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

/**
 * Service for API key management flows.
 *
 * Integrates with Better Auth to provide API key creation, update, deletion, and listing.
 *
 * @see {@link https://better-auth.com/docs/plugins/api-key/advanced Better Auth: API Key Advanced}
 */
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
