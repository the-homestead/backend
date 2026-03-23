import { registerAs } from '@nestjs/config';

import { type BunnyRegionKey } from '../../bunny/bunny.constants';

export interface BunnyConfig {
    storageZone: string;
    accessKey: string;
    publicUrl: string;
    /**
     * Region key mapped to a StorageRegion enum in BunnyStorageService.
     * Must be one of the keys in BUNNY_REGION_MAP.
     * Add `BUNNY_REGION=falkenstein` (or your region) to your .env file.
     */
    region: BunnyRegionKey;
    /**
     * Optional local storage root path — useful for local dev environments
     * that mock Bunny with a local directory.
     */
    storageRoot?: string;
}

export const bunnyConfig = registerAs(
    'bunny',
    (): BunnyConfig => ({
        storageZone: process.env.BUNNY_STORAGE_ZONE!,
        accessKey: process.env.BUNNY_ACCESS_KEY!,
        publicUrl: process.env.BUNNY_PUBLIC_URL!,
        region: process.env.BUNNY_REGION ?? 'falkenstein',
        storageRoot: process.env.BUNNY_STORAGE_ROOT,
    }),
);
