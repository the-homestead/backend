import { createZodDto } from 'nestjs-zod';
import z from 'zod';

/* -------------------- NESTED -------------------- */

const HostnameSchema = z.object({
    Id: z.number(),
    Value: z.string(),
    ForceSSL: z.boolean(),
});

const PullZoneSchema = z.object({
    Id: z.number(),
    Name: z.string(),
    OriginUrl: z.string(),
    Enabled: z.boolean(),
    MonthlyBandwidthUsed: z.number(),
    MonthlyBandwidthLimit: z.number(),
    Hostnames: z.array(HostnameSchema),
});

/* -------------------- ROOT -------------------- */

export const StorageZoneSchema = z.object({
    Id: z.number(),
    Name: z.string(),
    Region: z.string(),
    StorageUsed: z.number(),
    FilesStored: z.number(),
    Deleted: z.boolean(),
    PullZones: z.array(PullZoneSchema),
    ReadOnlyPassword: z.string().optional(),
    StorageHostname: z.string(),
    ZoneTier: z.number(),
    ReplicationRegions: z.array(z.string()),
});

export class StorageZoneDTO extends createZodDto(StorageZoneSchema) {}
