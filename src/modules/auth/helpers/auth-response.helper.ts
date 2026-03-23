import { HttpException } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';

export class AuthResponseHelper {
    /**
     * Parses a better-auth Response:
     * - Forwards Set-Cookie headers onto the Express response (passthrough)
     * - Throws an HttpException with better-auth's error body on non-2xx
     * - Returns the parsed JSON body on success
     *
     * @param authResponse  - The Response returned by better-auth with asResponse: true
     * @param res           - Express response (use @Res({ passthrough: true }))
     *                        Only required for endpoints that set cookies (sign-in, sign-up, etc.)
     */
    async handle<T = unknown>(authResponse: Response, res?: ExpressResponse): Promise<T> {
        if (res) {
            this.applyCookies(authResponse, res);
        }

        if (!authResponse.ok) {
            let errorBody: unknown;
            try {
                errorBody = await authResponse.json();
            } catch {
                errorBody = { message: authResponse.statusText };
            }
            throw new HttpException(errorBody as object, authResponse.status);
        }

        const contentType = authResponse.headers.get('content-type') ?? '';

        if (contentType.includes('application/json')) {
            return authResponse.json() as Promise<T>;
        }

        return {} as T;
    }

    /**
     * Copies Set-Cookie headers from a better-auth Response onto the Express response.
     * Must be called before any body is written.
     */
    applyCookies(authResponse: Response, res: ExpressResponse): void {
        const cookies =
            typeof authResponse.headers.getSetCookie === 'function'
                ? authResponse.headers.getSetCookie()
                : [];

        if (cookies.length > 0) {
            const existing = res.getHeader('Set-Cookie');
            const merged = existing
                ? [...(Array.isArray(existing) ? existing : [existing as string]), ...cookies]
                : cookies;
            res.setHeader('Set-Cookie', merged);
        }
    }
}
