import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { OptionalAuth } from '@thallesp/nestjs-better-auth';

import { StorageZoneDTO } from './bunny.zone.schema';
import { BunnyStorageService } from './services/storage.service';

@Controller('storage')
@ApiTags('Storage')
@OptionalAuth()
export class StorageController {
    constructor(private readonly storageService: BunnyStorageService) {}
    @Get()
    @ApiOkResponse({ type: StorageZoneDTO })
    async getZoneInfo(): Promise<StorageZoneDTO> {
        return this.storageService.getZoneInfo();
    }
}
 