export const BUNNY_STORAGE_ZONE = 'BUNNY_STORAGE_ZONE' as const;
export type BunnyRegion = 'de' | 'uk' | 'ny' | 'la' | 'sg' | 'syd' | 'jh' | 'se' | 'br';

export const BUNNY_REGION_MAP: Record<string, BunnyRegion> = {
    new_york: 'ny',
    falkenstein: 'de',
    london: 'uk',
    los_angeles: 'la',
    singapore: 'sg',
    sydney: 'syd',
    johannesburg: 'jh',
    stockholm: 'se',
    sao_paulo: 'br',
};

export type BunnyRegionKey = keyof typeof BUNNY_REGION_MAP;
