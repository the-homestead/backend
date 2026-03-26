import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PubSubService } from './pubsub.service';

@Module({
    imports: [DatabaseModule],
    providers: [PubSubService],
    exports: [PubSubService],
})
export class PubSubModule {}
