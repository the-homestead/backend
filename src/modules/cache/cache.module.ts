import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { CacheService } from './cache.service';

@Module({
    imports: [DatabaseModule],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule {}
