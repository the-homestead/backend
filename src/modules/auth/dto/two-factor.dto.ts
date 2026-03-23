import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class EnableTwoFactorDto {
    @ApiProperty({ example: 'myPassword123' })
    @IsString()
    password!: string;
}

export class DisableTwoFactorDto {
    @ApiProperty({ example: 'myPassword123' })
    @IsString()
    password!: string;
}

export class VerifyTotpDto {
    @ApiProperty({ example: '123456' })
    @IsString()
    @Length(6, 6)
    code!: string;

    @ApiPropertyOptional({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    trustDevice?: boolean;
}

export class VerifyBackupCodeDto {
    @ApiProperty({ example: 'XXXXXXXXXX' })
    @IsString()
    code!: string;
}
