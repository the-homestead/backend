import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { AuthenticationResponseJSON } from '@simplewebauthn/types';
import { IsObject, IsOptional, IsString } from 'class-validator';

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
