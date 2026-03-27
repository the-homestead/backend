import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsPositive, IsObject, IsBoolean } from 'class-validator';

export class CreateApiKeyDto {
    @ApiPropertyOptional({ required: false, example: 'My API Key' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ required: false, example: 31536000 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    expiresIn?: number;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;

    @ApiPropertyOptional({
        required: false,
        example: { read: ['posts'], write: ['posts'] },
    })
    @IsOptional()
    @IsObject()
    permissions?: Record<string, string[]>; // ✅ not string[]

    @ApiPropertyOptional({ required: false, example: 'myapp_' })
    @IsOptional()
    @IsString()
    prefix?: string;
}

export class UpdateApiKeyDto {
    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsBoolean()
    enabled?: boolean;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;

    @ApiPropertyOptional({ required: false, example: { read: ['posts'] } })
    @IsOptional()
    @IsObject()
    permissions?: Record<string, string[]>; // ✅ not string[]

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    expiresIn?: number;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsBoolean()
    rateLimitEnabled?: boolean;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    rateLimitMax?: number;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    rateLimitTimeWindow?: number;
}

export class GenerateTotpUriDto {
    @ApiProperty({ example: 'Password123!' })
    @IsString()
    secret!: string;
}

export class ViewBackupCodesDTO {
    @ApiProperty({ example: '11111111111' })
    @IsString()
    userId!: string;
}

export class GenerateBackupCodesDTO {
    @ApiProperty({ example: 'Password123' })
    @IsString()
    password!: string;
}
