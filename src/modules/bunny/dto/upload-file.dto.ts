import { ReadableStream } from 'node:stream/web';

import { z } from 'zod';

export const UploadFileSchema = z.object({
    /**
     * Destination path inside the storage zone, e.g. `/mods/my-mod/v1.0.0/mod.zip`
     * Must start with `/`.
     */
    path: z
        .string()
        .min(1, 'Path is required')
        .refine((v) => v.startsWith('/'), { message: 'Path must start with /' }),

    /**
     * The file stream to upload. Bunny's SDK accepts ReadableStream<Uint8Array>
     * directly, allowing large mod archives to be piped without buffering.
     */
    stream: z.instanceof(ReadableStream<Uint8Array>),

    /**
     * Optional SHA-256 checksum (hex string). When provided, Bunny will verify
     * integrity server-side and reject mismatches — strongly recommended for mods.
     */
    sha256Checksum: z
        .string()
        .regex(/^[a-f0-9]{64}$/i, 'Must be a valid SHA-256 hex string')
        .optional(),

    /**
     * Override the content-type stored in Bunny. Bunny infers from extension
     * by default; set explicitly for non-standard or ambiguous types.
     */
    contentType: z.string().optional(),
});

export type UploadFileDto = z.infer<typeof UploadFileSchema>;
