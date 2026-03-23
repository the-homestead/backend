import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNumber,
    IsObject,
    IsOptional,
    IsPositive,
    IsString,
    Length,
    MaxLength,
    MinLength,
} from 'class-validator';
import type { AuthenticationResponseJSON } from '@simplewebauthn/types';

// ── Magic Link ────────────────────────────────────────────────────────────────

export class SendMagicLinkDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'https://myapp.com/dashboard' })
    @IsString()
    callbackURL!: string;
}

// ── Email OTP ─────────────────────────────────────────────────────────────────

export enum EmailOtpType {
    SignIn = 'sign-in',
    EmailVerification = 'email-verification',
    ForgetPassword = 'forget-password',
}

export class SendEmailOtpDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ enum: EmailOtpType, enumName: 'EmailOtpType' })
    @IsEnum(EmailOtpType)
    type!: EmailOtpType;
}

export class VerifyEmailOtpDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '849201' })
    @IsString()
    @Length(6, 6)
    otp!: string;
}

export class SignInWithEmailOtpDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '849201' })
    @IsString()
    @Length(6, 6)
    otp!: string;
}

// ── Passkey ───────────────────────────────────────────────────────────────────

export class VerifyPasskeyRegistrationDto {
    @ApiProperty({
        description: 'PublicKeyCredential JSON from navigator.credentials.create()',
    })
    @IsObject()
    response!: Record<string, any>;

    @ApiPropertyOptional({ required: false, example: 'My MacBook' })
    @IsOptional()
    @IsString()
    name?: string;
}

export class VerifyPasskeyAuthenticationDto {
    @ApiProperty({
        description: 'PublicKeyCredential JSON from navigator.credentials.get()',
    })
    @IsOptional()
    @IsObject()
    response: AuthenticationResponseJSON;
}

// ── Username ──────────────────────────────────────────────────────────────────

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

// ── Multi-Session ─────────────────────────────────────────────────────────────

export class SetActiveSessionDto {
    @ApiProperty({ example: 'session-token' })
    @IsString()
    sessionToken!: string;
}

// ── API Key ───────────────────────────────────────────────────────────────────

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
