import { ReadableStream } from 'node:stream/web';

import * as BunnyStorageSDK from '@bunny.net/storage-sdk';
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Region & Zone
// ---------------------------------------------------------------------------

/**
 * The primary storage region of your Bunny storage zone.
 *
 * Maps to the regional subdomain used when constructing storage API URLs.
 *
 * @see {@link https://docs.bunny.net/reference/storage-api Bunny Storage API}
 */
export type BunnyStorageRegion =
    (typeof BunnyStorageSDK.regions.StorageRegion)[keyof typeof BunnyStorageSDK.regions.StorageRegion];

// ---------------------------------------------------------------------------
// DTOs & Schemas
// ---------------------------------------------------------------------------

/**
 * Input DTO for operations that target a single file or directory path.
 *
 * @property path - Absolute path within the storage zone, e.g. `"/mods/my-mod/file.zip"`.
 *   Must begin with a leading slash.
 */
export interface StoragePathDto {
    readonly path: string;
}

const StoragePathSchema = z.object({
    path: z.string().min(1).startsWith('/'),
});

/**
 * Input DTO for uploading a file stream.
 *
 * @property path       - Destination path within the storage zone, e.g. `"/mods/my-mod/file.zip"`.
 * @property stream     - Readable byte stream of the file content.
 * @property checksum   - Optional SHA-256 hex digest. When provided, Bunny will reject the upload if the digest does not match, protecting against corruption in transit.
 * @property contentType - Optional MIME type override. If omitted, Bunny stores the file as`application/octet-stream`.
 */
export interface UploadFileDto {
    readonly path: string;
    readonly stream: ReadableStream<Uint8Array>;
    readonly checksum?: string;
    readonly contentType?: string;
}

const UploadFileSchema = z.object({
    path: z.string().min(1).startsWith('/'),
    stream: z.custom<ReadableStream<Uint8Array>>((val) => val instanceof ReadableStream, {
        message: 'stream must be a ReadableStream<Uint8Array>',
    }),
    checksum: z.string().optional(),
    contentType: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

/**
 * Result returned by {@link BunnyStorageService.download}.
 *
 * @property stream   - Raw binary stream of the file content. The caller is responsible for consuming or cancelling the stream to avoid resource leaks.
 * @property response - The underlying HTTP response, useful for inspecting additional headers such as `ETag` or `Last-Modified`.
 * @property length   - Content length in bytes, if the server provided a `Content-Length` header. May be absent for chunked transfers.
 */
export interface BunnyDownloadResult {
    readonly stream: ReadableStream<Uint8Array>;
    readonly response: Response;
    readonly length?: number;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * NestJS service wrapping the Bunny Storage SDK.
 *
 * Provides strongly-typed, validated methods for all common storage operations:
 * listing, metadata retrieval, streaming downloads and uploads, and file/directory
 * deletion. All inputs are validated with Zod before any network call is made.
 *
 * Directory deletion bypasses the SDK to preserve HTTP status codes, enabling
 * accurate error discrimination (404 vs 401 vs 5xx) that the SDK collapses into
 * a boolean.
 *
 * @example
 * ```typescript
 * const service = new BunnyStorageService(
 *   BunnyStorageSDK.regions.StorageRegion.Falkenstein,
 *   'my-zone',
 *   process.env.BUNNY_ACCESS_KEY,
 * );
 *
 * const files = await service.list({ path: '/' });
 * const download = await service.download({ path: '/mods/my-mod/file.zip' });
 * ```
 */
@Injectable()
export class BunnyStorageService {
    /**
     * The connected Bunny storage zone used for all operations.
     * Constructed once at service initialisation and reused across calls.
     */
    private readonly zone: BunnyStorageSDK.zone.StorageZone;

    /**
     * @param logger    - Pino logger instance injected by `nestjs-pino`.
     * @param region    - The Bunny storage region hosting your zone, e.g. `BunnyStorageSDK.regions.StorageRegion.Falkenstein`.
     * @param zoneName  - The name of your Bunny storage zone.
     * @param accessKey - The access key for the storage zone. Source from an environment variable — never hard-code this value.
     */
    constructor(
        @InjectPinoLogger(BunnyStorageService.name)
        private readonly logger: PinoLogger,
        private readonly region: BunnyStorageRegion,
        private readonly zoneName: string,
        private readonly accessKey: string,
    ) {
        this.zone = BunnyStorageSDK.zone.connect_with_accesskey(region, zoneName, accessKey);
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * List all files and directories at the given path.
     *
     * @param input - An object containing the `path` of the directory to list, e.g. `{ path: "/" }`.
     * @returns An array of {@link BunnyStorageSDK.file.StorageFile} entries. Empty directories return an empty array.
     *
     * @throws {NotFoundException} If the path does not exist in the storage zone.
     * @throws {UnauthorizedException} If the access key is invalid or lacks permission.
     * @throws {InternalServerErrorException} On unexpected SDK or network failures.
     */
    async list(input: StoragePathDto): Promise<BunnyStorageSDK.file.StorageFile[]> {
        const dto = this.validate(StoragePathSchema, input, 'list');

        this.logger.debug(`[LIST] ▶ ${dto.path}`);

        try {
            const files = await BunnyStorageSDK.file.list(this.zone, dto.path);
            this.logger.debug(`[LIST] ✔ ${dto.path} — ${files.length} entries`);
            return files;
        } catch (err) {
            this.mapSdkError('list', dto.path, err);
        }
    }

    /**
     * Fetch the metadata of a single file or directory without downloading its content.
     *
     * To stream the file's content, call `.data()` on the returned object, or use {@link download} directly.
     *
     * @param input - An object containing the `path` of the file to describe,e.g. `{ path: "/mods/my-mod/file.zip" }`.
     * @returns A {@link BunnyStorageSDK.file.StorageFile} populated with metadata.
     *
     * @throws {NotFoundException} If the file does not exist.
     * @throws {UnauthorizedException} If the access key is invalid or lacks permission.
     * @throws {InternalServerErrorException} On unexpected SDK or network failures.
     */
    async get(input: StoragePathDto): Promise<BunnyStorageSDK.file.StorageFile> {
        const dto = this.validate(StoragePathSchema, input, 'get');

        this.logger.debug(`[GET] ▶ ${dto.path}`);

        try {
            const file = await BunnyStorageSDK.file.get(this.zone, dto.path);
            this.logger.debug(`[GET] ✔ ${dto.path}`);
            return file;
        } catch (err) {
            this.mapSdkError('get', dto.path, err);
        }
    }

    /**
     * Download a file as a binary stream.
     *
     * This calls Bunny's download endpoint directly — it does **not** make a prior
     * metadata request. Prefer this over `get().data()` when you only need the
     * stream, as it saves one round-trip.
     *
     * The caller is responsible for consuming or cancelling the stream to avoid resource leaks.
     *
     * @param input - An object containing the `path` of the file to download, e.g. `{ path: "/mods/my-mod/file.zip" }`.
     * @returns A {@link BunnyDownloadResult} containing the stream, raw HTTP response, and optionally the content length in bytes.
     *
     * @throws {NotFoundException} If the file does not exist.
     * @throws {UnauthorizedException} If the access key is invalid or lacks permission.
     * @throws {InternalServerErrorException} On unexpected SDK or network failures.
     */
    async download(input: StoragePathDto): Promise<BunnyDownloadResult> {
        const dto = this.validate(StoragePathSchema, input, 'download');
        const start = performance.now();

        this.logger.info(`[DOWNLOAD] ▶ ${dto.path}`);

        try {
            const result = await BunnyStorageSDK.file.download(this.zone, dto.path);
            const elapsed = (performance.now() - start).toFixed(1);
            const sizeLabel = result.length
                ? `${(result.length / 1_048_576).toFixed(2)} MB`
                : 'unknown size';

            this.logger.info(
                `[DOWNLOAD] ✔ ${dto.path} — ${sizeLabel} (${elapsed}ms, HTTP ${result.response.status})`,
            );

            return result;
        } catch (err) {
            this.mapSdkError('download', dto.path, err);
        }
    }

    /**
     * Upload a file stream to the storage zone.
     *
     * Supports optional SHA-256 checksum verification and content-type override.
     * For large files, the stream is piped directly to Bunny without buffering.
     *
     * @param input - Upload parameters including the destination `path`, the stream` to upload, and optional `checksum` and `contentType` overrides. See {@link UploadFileDto} for full field documentation.
     *
     * @throws {UnauthorizedException} If the access key is invalid or lacks permission.
     * @throws {InternalServerErrorException} If Bunny rejects the upload (e.g. invalid path, checksum mismatch) or on unexpected network failures.
     */
    async upload(input: UploadFileDto): Promise<void> {
        const dto = this.validate(UploadFileSchema, input, 'upload');
        const start = performance.now();

        this.logger.info(`[UPLOAD] ▶ ${dto.path}`);

        try {
            await BunnyStorageSDK.file.upload(this.zone, dto.path, dto.stream, {
                sha256Checksum: dto.checksum,
                contentType: dto.contentType,
            });

            const elapsed = (performance.now() - start).toFixed(1);
            this.logger.info(`[UPLOAD] ✔ ${dto.path} (${elapsed}ms)`);
        } catch (err) {
            this.mapSdkError('upload', dto.path, err);
        }
    }

    /**
     * Delete a single file from the storage zone.
     *
     * This method is **not** recursive. To delete a directory and all its contents, use {@link deleteDirectory} instead.
     *
     * @param input - An object containing the `path` of the file to delete, e.g. `{ path: "/mods/my-mod/file.zip" }`.
     *
     * @throws {NotFoundException} If the file does not exist.
     * @throws {UnauthorizedException} If the access key is invalid or lacks permission.
     * @throws {InternalServerErrorException} On unexpected SDK or network failures.
     */
    async delete(input: StoragePathDto): Promise<void> {
        const dto = this.validate(StoragePathSchema, input, 'delete');

        this.logger.warn(`[DELETE] ▶ ${dto.path}`);

        try {
            const success = await BunnyStorageSDK.file.remove(this.zone, dto.path);

            if (!success) {
                throw new InternalServerErrorException(
                    `Bunny returned a failure response deleting "${dto.path}"`,
                );
            }

            this.logger.warn(`[DELETE] ✔ ${dto.path} deleted`);
        } catch (err) {
            if (
                err instanceof NotFoundException ||
                err instanceof UnauthorizedException ||
                err instanceof InternalServerErrorException
            ) {
                throw err;
            }
            this.mapSdkError('delete', dto.path, err);
        }
    }

    /**
     * Recursively delete a directory and all of its contents.
     *
     * ⚠ **This operation is destructive and irreversible.** Bunny's standard
     * delete endpoint will refuse to remove non-empty directories; this method
     * uses the dedicated recursive endpoint.
     *
     * This method bypasses the SDK wrapper to preserve the raw HTTP status code,
     * enabling accurate error discrimination. The SDK's `removeDirectory` collapses
     * all failures into a boolean, making it impossible to distinguish a 404 from
     * a 401 or a 5xx.
     *
     * @param input - An object containing the `path` of the directory to delete, e.g. `{ path: "/mods/my-mod/" }`. The path must begin with a slash; a  trailing slash is appended automatically if absent.
     *
     * @throws {NotFoundException} If the directory does not exist.
     * @throws {UnauthorizedException} If the access key is invalid or lacks permission.
     * @throws {InternalServerErrorException} On unexpected Bunny or network failures.
     */
    async deleteDirectory(input: StoragePathDto): Promise<void> {
        const dto = this.validate(StoragePathSchema, input, 'deleteDirectory');
        const normalizedPath = dto.path.endsWith('/') ? dto.path : `${dto.path}/`;

        this.logger.warn(`[DELETE_DIR] ▶ ${normalizedPath} (recursive)`);

        const response = await this.rawFetch(normalizedPath, { method: 'DELETE' });

        switch (response.status) {
            case 200:
            case 204:
                this.logger.warn(`[DELETE_DIR] ✔ ${normalizedPath} deleted`);
                return;

            case 404:
                throw new NotFoundException(`Directory not found: "${normalizedPath}"`);

            case 401:
                throw new UnauthorizedException(
                    `Unauthorized — verify the Bunny access key for zone "${this.zoneName}"`,
                );

            default:
                throw new InternalServerErrorException(
                    `Unexpected HTTP ${response.status} deleting directory "${normalizedPath}"`,
                );
        }
    }

    /**
     * Create a new empty directory in the storage zone.
     *
     * Creating a directory that already exists is a no-op — Bunny returns a
     * success response without modifying the existing directory or its contents.
     *
     * @param input - An object containing the `path` of the directory to create, e.g. `{ path: "/mods/my-mod/" }`. A trailing slash is appended automatically if absent.
     *
     * @throws {UnauthorizedException} If the access key is invalid or lacks permission.
     * @throws {InternalServerErrorException} On unexpected SDK or network failures.
     */
    async createDirectory(input: StoragePathDto): Promise<void> {
        const dto = this.validate(StoragePathSchema, input, 'createDirectory');
        const normalizedPath = dto.path.endsWith('/') ? dto.path : `${dto.path}/`;

        this.logger.info(`[MKDIR] ▶ ${normalizedPath}`);

        try {
            const success = await BunnyStorageSDK.file.createDirectory(this.zone, normalizedPath);

            if (!success) {
                throw new InternalServerErrorException(
                    `Bunny returned a failure response creating directory "${normalizedPath}"`,
                );
            }

            this.logger.info(`[MKDIR] ✔ ${normalizedPath} created`);
        } catch (err) {
            if (
                err instanceof UnauthorizedException ||
                err instanceof InternalServerErrorException
            ) {
                throw err;
            }
            this.mapSdkError('createDirectory', normalizedPath, err);
        }
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Validate an input object against a Zod schema, throwing a descriptive
     * {@link InternalServerErrorException} on failure.
     *
     * @param schema    - The Zod schema to validate against.
     * @param input     - The raw input value to parse.
     * @param operation - Human-readable name of the calling operation, used in the error message.
     * @returns The parsed, type-narrowed value.
     *
     * @throws {InternalServerErrorException} If validation fails.
     */
    private validate<T extends z.ZodTypeAny>(
        schema: T,
        input: unknown,
        operation: string,
    ): z.infer<T> {
        const result = schema.safeParse(input);

        if (!result.success) {
            const issues = result.error.issues
                .map((i) => `  • ${i.path.join('.')} — ${i.message}`)
                .join('\n');

            throw new InternalServerErrorException(
                `BunnyStorageService validation error in "${operation}":\n${issues}`,
            );
        }

        return result.data as z.infer<T>;
    }

    /**
     * Issue a raw `fetch` request against the Bunny storage API, constructing
     * the URL and auth header from the current zone configuration.
     *
     * Used by operations that need access to the raw HTTP response (e.g. {@link deleteDirectory}) rather than the boolean the SDK returns.
     *
     * @param path    - Absolute path within the storage zone. A leading slash is expected and will be appended to the zone's base URL.
     * @param init    - Standard `RequestInit` options passed to `fetch`.
     * @returns The raw {@link Response} from Bunny's storage API.
     */
    private async rawFetch(path: string, init: RequestInit): Promise<Response> {
        const url = BunnyStorageSDK.zone.addr(this.zone);
        url.pathname = `${url.pathname}${path.replace(/^\//, '')}`;

        const [headerName, headerValue] = BunnyStorageSDK.zone.key(this.zone);

        return fetch(url, {
            ...init,
            headers: {
                ...(init.headers as Record<string, string> | undefined),
                [headerName]: headerValue,
            },
        });
    }

    /**
     * Map an unknown error thrown by the Bunny SDK into an appropriate NestJS
     * HTTP exception.
     *
     * The SDK surfaces errors as plain `Error` instances with predictable message
     * prefixes. This method pattern-matches those messages and re-throws a typed
     * NestJS exception so upstream filters receive a meaningful HTTP status code.
     *
     * If the error cannot be classified, it is wrapped in an {@link InternalServerErrorException}.
     *
     * @param operation - Human-readable name of the calling operation.
     * @param path      - The storage path involved, included in the error message.
     * @param err       - The unknown value thrown by the SDK.
     * @returns A NestJS HTTP exception. Always throws; never returns normally.
     */
    private mapSdkError(operation: string, path: string, err: unknown): never {
        const message = err instanceof Error ? err.message : String(err);

        this.logger.error(`[${operation.toUpperCase()}] ✘ ${path} — ${message}`);

        if (message.includes('not found') || message.startsWith('File not found')) {
            throw new NotFoundException(message);
        }

        if (message.includes('Unauthorized')) {
            throw new UnauthorizedException(message);
        }

        throw new InternalServerErrorException(
            `Bunny storage error during "${operation}" on "${path}": ${message}`,
        );
    }
}
