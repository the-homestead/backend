import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInUsernameDto {
    @ApiProperty({ example: 'john_doe', description: 'Username or email' })
    @IsString()
    username!: string;

    @ApiProperty({ example: 'strongPassword123' })
    @IsString()
    password!: string;

    @ApiPropertyOptional({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    rememberMe?: boolean;
}

export class UpdateUsernameDto {
    @ApiProperty({ example: 'new_username' })
    @IsString()
    @MinLength(3)
    @MaxLength(32)
    username!: string;
}
