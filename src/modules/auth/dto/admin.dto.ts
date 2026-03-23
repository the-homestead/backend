import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { type AppRole, RoleEnum } from '../access/auth.access';

export class CreateUserAdminDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsString()
    email!: string;

    @ApiProperty({ example: 'Password123!' })
    @IsString()
    password!: string;

    @ApiProperty({ example: 'New User' })
    @IsString()
    name!: string;

    @ApiPropertyOptional({
        required: false,
        enum: RoleEnum,
        default: RoleEnum.userRole,
    })
    @IsOptional()
    @IsEnum(RoleEnum)
    role?: AppRole;
}

export class SetUserRoleDto {
    @ApiProperty({ enum: RoleEnum })
    @IsEnum(RoleEnum)
    role!: AppRole;
}

export class BanUserDto {
    @ApiPropertyOptional({
        required: false,
        example: 'Violated terms of service',
    })
    @IsOptional()
    @IsString()
    banReason?: string;

    @ApiPropertyOptional({
        required: false,
        example: 86400,
        description: 'Seconds until ban expires. Omit for permanent.',
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    banExpiresIn?: number;
}

export class ImpersonateDto {
    @ApiProperty({ example: 'user-id' })
    @IsString()
    userId!: string;
}

export class RevokeUserSessionDto {
    @ApiProperty({ example: 'session-token' })
    @IsString()
    sessionToken!: string;
}

export class RemoveUserDto {
    @ApiProperty({ example: 'user-id' })
    @IsString()
    userId!: string;
}

export class UnbanUserDto {
    @ApiProperty({ example: 'user-id' })
    @IsString()
    userId!: string;
}

export type AdminActionResponse = {
    success: boolean;
    message: string;
    data?: any;
};
