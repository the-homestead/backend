import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

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
