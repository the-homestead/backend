/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ReadableStream as WebReadableStream } from 'node:stream/web';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as BunnyStorageSDK from '@bunny.net/storage-sdk';
import type { StorageZone } from '@bunny.net/storage-sdk';
import { ZodError } from 'zod';

import { AppConfigService } from '@homestead/api/modules/config/config.service';
import type { BunnyConfig } from '@homestead/api/modules/config/namespaces/bunny.config';
import { BUNNY_REGION_MAP, type BunnyRegionKey } from '../bunny.constants';
import { DownloadFileDto, DownloadFileSchema } from '../dto/download-file.dto';
import { FileMetadataDto, FileMetadataSchema } from '../dto/file-metadata.dto';
import { ListFilesDto, ListFilesSchema } from '../dto/list-files.dto';
import { UploadFileDto, UploadFileSchema } from '../dto/upload-file.dto';

/** Return type for a download operation. */
export interface BunnyDownloadResult {
    stream: WebReadableStream<Uint8Array>;
    response: Response;
    /** Content length in bytes, if the server provided it. */
    length?: number;
}

@Injectable()
export class BunnyStorageService implements OnModuleInit {
    private zone!: StorageZone;

    constructor(
        @InjectPinoLogger(BunnyStorageService.name)
        private readonly logger: PinoLogger,
        private readonly config: AppConfigService,
    ) {}

    // ---------------------------------------------------------------------------
    // Lifecycle
    // ---------------------------------------------------------------------------

    onModuleInit(): void {
        const bunnyConfig: BunnyConfig = this.config.bunny;
        const regionKey: BunnyRegionKey = bunnyConfig.region;
        const zoneName: string = bunnyConfig.storageZone;
        const accessKey: string = bunnyConfig.accessKey;

        const region = BUNNY_REGION_MAP[regionKey] as BunnyStorageSDK.StorageRegion;

        if (!region) {
            const valid = Object.keys(BUNNY_REGION_MAP).join(', ');
            throw new Error(
                `[BunnyStorage] Unknown region "${regionKey}". Valid options: ${valid}`,
            );
        }

        this.zone = BunnyStorageSDK.zone.connect_with_accesskey(region, zoneName, accessKey);

        this.logger.info(`Storage zone connected — zone: "${zoneName}", region: "${regionKey}"`);
    }

    // ---------------------------------------------------------------------------
    // Upload
    // ---------------------------------------------------------------------------

    /**
     * Upload a file stream to the storage zone.
     *
     * For mod platforms, always supply `sha256Checksum` so Bunny can reject
     * corrupted uploads server-side before they become publicly accessible.
     */
    async upload(input: UploadFileDto): Promise<boolean> {
        const dto = this.validate(UploadFileSchema, input, 'upload');
        const start = performance.now();

        this.logger.info(`[UPLOAD] ▶ ${dto.path}`);

        if (dto.sha256Checksum) {
            this.logger.debug(`[UPLOAD] SHA-256 checksum provided: ${dto.sha256Checksum}`);
        } else {
            this.logger.warn(
                `[UPLOAD] No checksum provided for "${dto.path}" — integrity will not be verified by Bunny`,
            );
        }

        const success = await BunnyStorageSDK.file.upload(this.zone, dto.path, dto.stream, {
            ...(dto.sha256Checksum && { sha256Checksum: dto.sha256Checksum }),
            ...(dto.contentType && { contentType: dto.contentType }),
        });

        const elapsed = (performance.now() - start).toFixed(1);

        if (success) {
            this.logger.info(`[UPLOAD] ✔ ${dto.path} (${elapsed}ms)`);
        } else {
            this.logger.error(
                `[UPLOAD] ✘ Upload returned false for "${dto.path}" after ${elapsed}ms`,
            );
        }

        return success;
    }

    // ---------------------------------------------------------------------------
    // Download
    // ---------------------------------------------------------------------------

    /**
     * Download a file as a stream.
     *
     * The caller is responsible for consuming or cancelling the stream.
     */
    async download(input: DownloadFileDto): Promise<BunnyDownloadResult> {
        const dto = this.validate(DownloadFileSchema, input, 'download');
        const start = performance.now();

        this.logger.info(`[DOWNLOAD] ▶ ${dto.path}`);

        const result = await BunnyStorageSDK.file.download(this.zone, dto.path);

        const elapsed = (performance.now() - start).toFixed(1);
        const sizeLabel = result.length
            ? `${(result.length / 1_048_576).toFixed(2)} MB`
            : 'unknown size';

        this.logger.info(
            `[DOWNLOAD] ✔ ${dto.path} — ${sizeLabel} (${elapsed}ms, HTTP ${result.response.status})`,
        );

        return result;
    }

    // ---------------------------------------------------------------------------
    // Get metadata
    // ---------------------------------------------------------------------------

    /**
     * Fetch the metadata of a single file or directory node.
     *
     * The raw SDK response is validated against `FileMetadataSchema` before
     * being returned, ensuring the shape is always what the rest of the app expects.
     */
    async getMetadata(path: string): Promise<FileMetadataDto> {
        this.logger.info(`[METADATA] ▶ ${path}`);

        const raw = await BunnyStorageSDK.file.get(this.zone, path);
        const metadata = this.validate(FileMetadataSchema, raw, 'getMetadata');

        this.logger.info(
            `[METADATA] ✔ ${path} — ${metadata.IsDirectory ? 'directory' : `file, ${metadata.Length} bytes`}` +
                `${metadata.Checksum ? `, SHA-256: ${metadata.Checksum}` : ''}` +
                `${metadata.ReplicatedZones ? `, replicas: [${metadata.ReplicatedZones}]` : ''}`,
        );

        return metadata;
    }

    // ---------------------------------------------------------------------------
    // List
    // ---------------------------------------------------------------------------

    /**
     * List all entries (files and sub-directories) under a given path.
     */
    async list(input: ListFilesDto): Promise<FileMetadataDto[]> {
        const dto = this.validate(ListFilesSchema, input, 'list');

        this.logger.info(`[LIST] ▶ ${dto.path}`);

        const raw = await BunnyStorageSDK.file.list(this.zone, dto.path);

        const entries = raw.map((item, i) => this.validate(FileMetadataSchema, item, `list[${i}]`));

        const fileCount = entries.filter((e) => !e.IsDirectory).length;
        const dirCount = entries.filter((e) => e.IsDirectory).length;
        const totalBytes = entries.reduce((acc, e) => acc + e.Length, 0);

        this.logger.info(
            `[LIST] ✔ ${dto.path} — ${entries.length} entries` +
                ` (${fileCount} files, ${dirCount} dirs, ${(totalBytes / 1_048_576).toFixed(2)} MB total)`,
        );

        entries.forEach((e) => {
            const type = e.IsDirectory ? '📁' : '📄';
            const size = e.IsDirectory ? '' : ` (${e.Length} bytes)`;
            this.logger.debug(`[LIST]   ${type} ${e.ObjectName}${size}`);
        });

        return entries;
    }

    // ---------------------------------------------------------------------------
    // Delete
    // ---------------------------------------------------------------------------

    /**
     * Delete a single file at the given path.
     */
    async delete(path: string): Promise<boolean> {
        this.logger.warn(`[DELETE] ▶ ${path}`);

        const success = await BunnyStorageSDK.file.remove(this.zone, path);

        if (success) {
            this.logger.warn(`[DELETE] ✔ Deleted: ${path}`);
        } else {
            this.logger.error(`[DELETE] ✘ Failed to delete: "${path}"`);
        }

        return success;
    }

    /**
     * Recursively delete an entire directory and all its contents.
     *
     * ⚠ This is destructive and irreversible — use with caution.
     */
    async deleteDirectory(path: string): Promise<boolean> {
        this.logger.warn(`[DELETE_DIR] ▶ ${path} (recursive)`);

        const success = await BunnyStorageSDK.file.removeDirectory(this.zone, path);

        if (success) {
            this.logger.warn(`[DELETE_DIR] ✔ Deleted directory: ${path}`);
        } else {
            this.logger.error(`[DELETE_DIR] ✘ Failed to delete directory: "${path}"`);
        }

        return success;
    }

    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    /**
     * Validate `data` against a Zod schema.
     * On failure, logs the issues and re-throws a clean Error so upstream
     * services get a useful message rather than a raw ZodError.
     */
    private validate<T>(schema: { parse: (d: unknown) => T }, data: unknown, context: string): T {
        try {
            return schema.parse(data);
        } catch (err) {
            if (err instanceof ZodError) {
                const issues = err.issues
                    .map((i) => `  • ${i.path.join('.')} — ${i.message}`)
                    .join('\n');

                this.logger.error(`[VALIDATION] Failed in context "${context}":\n${issues}`);

                throw new Error(`BunnyStorageService validation error in "${context}":\n${issues}`);
            }

            throw err;
        }
    }
}
