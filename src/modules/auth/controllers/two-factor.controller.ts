import { Body, Controller, Get, Post, Req, Res, UseFilters } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';

import {
    DisableTwoFactorDto,
    EnableTwoFactorDto,
    GenerateBackupCodesDTO,
    GenerateTotpUriDto,
    VerifyBackupCodeDto,
    VerifyTotpDto,
    ViewBackupCodesDTO,
} from '../dto';
import { BetterAuthExceptionFilter } from '../filters/better-auth-exception.filter';
import { AuthResponseHelper } from '../helpers/auth-response.helper';
import { TwoFactorService } from '../services';

@ApiTags('Two-Factor Auth (2FA)')
@Controller('auth/two-factor')
@UseFilters(BetterAuthExceptionFilter)
export class TwoFactorController {
    constructor(
        private readonly twoFactorService: TwoFactorService,
        private readonly authResponse: AuthResponseHelper,
    ) {}

    @Get('generate')
    @ApiOperation({ summary: 'Generate TOTP URI + secret (step 1 of setup)' })
    @ApiResponse({ status: 200, description: 'totpURI and secret.' })
    async generateTotpUri(@Body() body: GenerateTotpUriDto, @Req() req: Request) {
        return this.authResponse.handle(await this.twoFactorService.generateTotpUri(body, req));
    }

    @Post('enable')
    @ApiOperation({
        summary: 'Enable 2FA — confirm setup and receive backup codes (step 2)',
    })
    @ApiBody({ type: EnableTwoFactorDto })
    @ApiResponse({
        status: 200,
        description: 'Backup codes returned. Store them securely.',
    })
    async enable(@Body() body: EnableTwoFactorDto, @Req() req: Request) {
        return this.authResponse.handle(await this.twoFactorService.enableTwoFactor(body, req));
    }

    @Post('disable')
    @ApiOperation({ summary: 'Disable 2FA on the account' })
    @ApiBody({ type: DisableTwoFactorDto })
    @ApiResponse({ status: 200 })
    async disable(@Body() body: DisableTwoFactorDto, @Req() req: Request) {
        return this.authResponse.handle(await this.twoFactorService.disableTwoFactor(body, req));
    }

    @Post('verify-totp')
    @AllowAnonymous()
    @ApiOperation({ summary: 'Verify TOTP code during sign-in 2FA challenge' })
    @ApiBody({ type: VerifyTotpDto })
    @ApiResponse({ status: 200, description: 'Session fully established.' })
    @ApiResponse({ status: 401, description: 'Invalid code.' })
    async verifyTotp(
        @Body() body: VerifyTotpDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authResponse.handle(await this.twoFactorService.verifyTotp(body, req), res);
    }

    @Post('verify-backup-code')
    @AllowAnonymous()
    @ApiOperation({
        summary: 'Verify a one-time backup code during 2FA challenge',
    })
    @ApiBody({ type: VerifyBackupCodeDto })
    @ApiResponse({ status: 200, description: 'Session established.' })
    @ApiResponse({ status: 401, description: 'Invalid or already used code.' })
    async verifyBackupCode(
        @Body() body: VerifyBackupCodeDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authResponse.handle(
            await this.twoFactorService.verifyBackupCode(body, req),
            res,
        );
    }

    @Get('backup-codes')
    @ApiOperation({ summary: 'View remaining backup codes' })
    @ApiResponse({ status: 200 })
    async viewBackupCodes(@Body() body: ViewBackupCodesDTO, @Req() req: Request) {
        return this.authResponse.handle(await this.twoFactorService.viewBackupCodes(body, req));
    }

    @Post('backup-codes/regenerate')
    @ApiOperation({
        summary: 'Regenerate backup codes (invalidates all previous ones)',
    })
    @ApiResponse({ status: 200, description: 'New backup codes.' })
    async regenerateBackupCodes(@Body() body: GenerateBackupCodesDTO, @Req() req: Request) {
        return this.authResponse.handle(await this.twoFactorService.generateBackupCodes(body, req));
    }
}
