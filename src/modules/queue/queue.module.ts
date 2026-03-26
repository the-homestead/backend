import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { QueueService } from './queue.service';

@Module({
    imports: [DatabaseModule],
    providers: [QueueService],
    exports: [QueueService],
})
export class QueueModule {}
