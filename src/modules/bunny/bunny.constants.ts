import { StorageRegion } from '@bunny.net/storage-sdk';

export const BUNNY_STORAGE_ZONE = 'BUNNY_STORAGE_ZONE' as const;

/**
 * Maps human-readable region strings (from config) to SDK StorageRegion enums.
 * Extend this as Bunny.net adds new PoPs.
 */
export const BUNNY_REGION_MAP: Record<string, StorageRegion> = {
    falkenstein: StorageRegion.Falkenstein,
    london: StorageRegion.London,
    new_york: StorageRegion.NewYork,
    los_angeles: StorageRegion.LosAngeles,
    singapore: StorageRegion.Singapore,
    sydney: StorageRegion.Sydney,
    johannesburg: StorageRegion.Johannesburg,
    stockholm: StorageRegion.Stockholm,
    sao_paulo: StorageRegion.SaoPaulo,
} as const;

export type BunnyRegionKey = keyof typeof BUNNY_REGION_MAP;
