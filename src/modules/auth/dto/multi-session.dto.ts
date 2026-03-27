import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetActiveSessionDto {
    @ApiProperty({ example: 'session-token' })
    @IsString()
    sessionToken!: string;
}
