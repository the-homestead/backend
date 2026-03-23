import { z } from 'zod';

/**
 * Mirrors the FileMetadata shape returned by the Bunny Storage SDK.
 * Used to validate and type-narrow responses before passing them upstream.
 */
export const FileMetadataSchema = z.object({
    Guid: z.string(),
    UserId: z.string(),
    LastChanged: z.iso.datetime(),
    DateCreated: z.iso.datetime(),
    StorageZoneName: z.string(),
    Path: z.string(),
    ObjectName: z.string(),
    /** File size in bytes. 0 for directories. */
    Length: z.number().nonnegative(),
    StorageZoneId: z.number(),
    IsDirectory: z.boolean(),
    ServerId: z.number(),
    /** SHA-256 checksum as returned by Bunny, may be null on brand-new uploads. */
    Checksum: z.string().nullable(),
    /** Comma-separated list of replicated zone names, e.g. "UK,NY" */
    ReplicatedZones: z.string().nullable(),
    ContentType: z.string().nullable(),
});

export type FileMetadataDto = z.infer<typeof FileMetadataSchema>;
