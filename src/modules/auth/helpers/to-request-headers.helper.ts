import type { IncomingHttpHeaders } from 'node:http';

/**
 * Converts Node.js IncomingHttpHeaders to a Web API Headers object.
 * better-auth's api methods expect a Web API Headers instance.
 */
export function toRequestHeaders(nodeHeaders: IncomingHttpHeaders): Headers {
    const headers = new Headers();
    for (const [key, value] of Object.entries(nodeHeaders)) {
        if (!value) continue;
        if (Array.isArray(value)) {
            value.forEach((v) => headers.append(key, v));
        } else {
            headers.set(key, value);
        }
    }
    return headers;
}
