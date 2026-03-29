import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseFilters } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';

import { VerifyPasskeyAuthenticationDto, VerifyPasskeyRegistrationDto } from '../dto';
import { BetterAuthExceptionFilter } from '../filters/better-auth-exception.filter';
import { AuthResponseHelper } from '../helpers/auth-response.helper';
import { PasskeyService } from '../services';

@ApiTags('Passkeys (WebAuthn)')
@Controller('auth/passkey')
@UseFilters(BetterAuthExceptionFilter)
export class PasskeyController {
    constructor(
        private readonly passkeyService: PasskeyService,
        private readonly authResponse: AuthResponseHelper,
    ) {}

    @Get('register/options')
    @ApiOperation({
        summary: 'Get PublicKeyCredentialCreationOptions (step 1 of registration)',
    })
    @ApiResponse({ status: 200 })
    async getRegistrationOptions(@Req() req: Request) {
        return this.authResponse.handle(await this.passkeyService.getRegistrationOptions(req));
    }

    @Post('register/verify')
    @ApiOperation({
        summary: 'Submit navigator.credentials.create() result (step 2 of registration)',
    })
    @ApiBody({ type: VerifyPasskeyRegistrationDto })
    @ApiResponse({ status: 200, description: 'Passkey registered.' })
    @ApiResponse({ status: 400, description: 'Verification failed.' })
    async verifyRegistration(@Body() body: VerifyPasskeyRegistrationDto, @Req() req: Request) {
        return this.authResponse.handle(await this.passkeyService.verifyRegistration(body, req));
    }

    @Get('authenticate/options')
    @AllowAnonymous()
    @ApiOperation({
        summary: 'Get PublicKeyCredentialRequestOptions (step 1 of sign-in)',
    })
    @ApiResponse({ status: 200 })
    async getAuthenticationOptions(@Req() req: Request) {
        return this.authResponse.handle(await this.passkeyService.getAuthenticationOptions(req));
    }

    @Post('authenticate/verify')
    @AllowAnonymous()
    @ApiOperation({
        summary: 'Submit navigator.credentials.get() result — creates session (step 2)',
    })
    @ApiBody({ type: VerifyPasskeyAuthenticationDto })
    @ApiResponse({ status: 200, description: 'Session created.' })
    @ApiResponse({ status: 401, description: 'Authentication failed.' })
    async verifyAuthentication(
        @Body() body: VerifyPasskeyAuthenticationDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authResponse.handle(
            await this.passkeyService.verifyAuthentication(body, req),
            res,
        );
    }

    @Get()
    @ApiOperation({
        summary: 'List all registered passkeys for the current user',
    })
    @ApiResponse({ status: 200 })
    async listPasskeys(@Req() req: Request) {
        return this.authResponse.handle(await this.passkeyService.listPasskeys(req));
    }

    @Delete(':passkeyId')
    @ApiOperation({ summary: 'Delete a passkey by ID' })
    @ApiParam({ name: 'passkeyId' })
    @ApiResponse({ status: 200 })
    async deletePasskey(@Param('passkeyId') passkeyId: string, @Req() req: Request) {
        return this.authResponse.handle(
            await this.passkeyService.deletePasskey({ id: passkeyId }, req),
        );
    }
}
