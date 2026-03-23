import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

export class SignUpEmailDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'strongPassword123' })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password!: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name!: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsUrl()
    image?: string;

    // Additional fields from auth.main.ts user.additionalFields
    @ApiPropertyOptional({ required: false, example: 25 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(99)
    age?: number;

    @ApiPropertyOptional({ required: false, example: false })
    @IsOptional()
    @IsBoolean()
    agePublic?: boolean;

    @ApiPropertyOptional({ required: false, example: 'John' })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({ required: false, example: false })
    @IsOptional()
    @IsBoolean()
    firstNamePublic?: boolean;

    @ApiPropertyOptional({ required: false, example: 'Doe' })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional({ required: false, example: false })
    @IsOptional()
    @IsBoolean()
    lastNamePublic?: boolean;

    @ApiPropertyOptional({ required: false, example: 'johndoe' })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(32)
    username?: string;

    @ApiPropertyOptional({
        required: false,
        example: 'Hai, i am a user here @ homestead',
    })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(128)
    bio?: string;
}

export class SignInEmailDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'strongPassword123' })
    @IsString()
    @MinLength(1)
    password!: string;

    @ApiPropertyOptional({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    rememberMe?: boolean;
}

export class ForgetPasswordDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'https://myapp.com/reset-password' })
    @IsUrl()
    redirectTo!: string;
}

export class ResetPasswordDto {
    @ApiProperty({ example: 'newPassword123' })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    newPassword!: string;

    @ApiProperty({ example: 'token-from-email' })
    @IsString()
    token!: string;
}

export class ChangePasswordDto {
    @ApiProperty({ example: 'oldPassword123' })
    @IsString()
    currentPassword!: string;

    @ApiProperty({ example: 'newPassword456' })
    @IsString()
    @MinLength(8)
    @MaxLength(128)
    newPassword!: string;

    @ApiPropertyOptional({ required: false, default: false })
    @IsOptional()
    @IsBoolean()
    revokeOtherSessions?: boolean;
}

export class ChangeEmailDto {
    @ApiProperty({ example: 'newemail@example.com' })
    @IsEmail()
    newEmail!: string;

    @ApiProperty({ example: 'https://myapp.com/verify-email' })
    @IsUrl()
    callbackURL!: string;
}

export class UpdateUserDto {
    @ApiPropertyOptional({ required: false, example: 'Jane Doe' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsUrl()
    image?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(150)
    age?: number;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsBoolean()
    agePublic?: boolean;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsBoolean()
    firstNamePublic?: boolean;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsBoolean()
    lastNamePublic?: boolean;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    bio?: string;
}

export class DeleteAccountDto {
    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    password?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsUrl()
    callbackURL?: string;
}

export class SendVerificationEmailDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'https://myapp.com/dashboard' })
    @IsUrl()
    callbackURL!: string;
}
