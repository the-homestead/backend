import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RevokeSessionDto {
    @ApiProperty({ example: 'session-token' })
    @IsString()
    token!: string;
}

export class LinkSocialDto {
    @ApiProperty({
        example: 'github',
        enum: ['github', 'google', 'discord', 'gitlab', 'twitch'],
    })
    @IsString()
    provider!: string;

    @ApiProperty({ example: 'https://myapp.com/dashboard' })
    @IsString()
    callbackURL!: string;
}

export class UnlinkSocialDto {
    @ApiProperty({ example: 'github' })
    @IsString()
    providerId!: string;

    @ApiProperty({ example: 'account-id' })
    @IsString()
    accountId!: string;
}

export class UpdateSessionDto {
    @ApiPropertyOptional({ required: false, example: 'en' })
    @IsOptional()
    @IsString()
    language?: string;
}
