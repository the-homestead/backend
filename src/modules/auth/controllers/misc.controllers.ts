import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';
import {
    CreateApiKeyDto,
    type GenerateBackupCodesDTO,
    type GenerateTotpUriDto,
    SendEmailOtpDto,
    SendMagicLinkDto,
    SetActiveSessionDto,
    SignInUsernameDto,
    SignInWithEmailOtpDto,
    UpdateApiKeyDto,
    UpdateUsernameDto,
    VerifyEmailOtpDto,
    VerifyPasskeyAuthenticationDto,
    VerifyPasskeyRegistrationDto,
    type ViewBackupCodesDTO,
} from '../dto/misc.dto';
import {
    DisableTwoFactorDto,
    EnableTwoFactorDto,
    VerifyBackupCodeDto,
    VerifyTotpDto,
} from '../dto/two-factor.dto';
import { BetterAuthExceptionFilter } from '../filters/better-auth-exception.filter';
import { AuthResponseHelper } from '../helpers/auth-response.helper';
import {
    ApiKeyService,
    EmailOtpService,
    MagicLinkService,
    MultiSessionService,
    PasskeyService,
    UsernameService,
} from '../services/misc.services';
import { TwoFactorService } from '../services/misc.services';

// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Magic Link')
@Controller('auth/magic-link')
@UseFilters(BetterAuthExceptionFilter)
export class MagicLinkController {
    constructor(
        private readonly magicLinkService: MagicLinkService,
        private readonly authResponse: AuthResponseHelper,
    ) {}

    @Post('send')
    @AllowAnonymous()
    @ApiOperation({ summary: 'Send a magic sign-in link to an email address' })
    @ApiBody({ type: SendMagicLinkDto })
    @ApiResponse({ status: 200, description: 'Link dispatched.' })
    @ApiResponse({ status: 429, description: 'Rate limit exceeded.' })
    async send(@Body() body: SendMagicLinkDto, @Req() req: Request) {
        return this.authResponse.handle(await this.magicLinkService.sendMagicLink(body, req));
    }

    @Get('verify')
    @AllowAnonymous()
    @ApiOperation({
        summary: 'Verify magic link token — hit by user clicking the email link',
    })
    @ApiQuery({ name: 'token', required: true })
    @ApiQuery({ name: 'callbackURL', required: false })
    @ApiResponse({ status: 200, description: 'Session created.' })
    @ApiResponse({ status: 400, description: 'Token invalid or expired.' })
    async verify(
        @Query('token') token: string,
        @Query('callbackURL') callbackURL: string | undefined,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authResponse.handle(
            await this.magicLinkService.verifyMagicLink({ token, callbackURL }, req),
            res,
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Email OTP')
@Controller('auth/email-otp')
@UseFilters(BetterAuthExceptionFilter)
export class EmailOtpController {
    constructor(
        private readonly emailOtpService: EmailOtpService,
        private readonly authResponse: AuthResponseHelper,
    ) {}

    @Post('send')
    @AllowAnonymous()
    @ApiOperation({
        summary: 'Send a one-time passcode — type controls the flow',
    })
    @ApiBody({ type: SendEmailOtpDto })
    @ApiResponse({ status: 200 })
    @ApiResponse({ status: 429, description: 'Rate limit exceeded.' })
    async send(@Body() body: SendEmailOtpDto, @Req() req: Request) {
        return this.authResponse.handle(await this.emailOtpService.sendOtp(body, req));
    }

    @Post('verify-email')
    @AllowAnonymous()
    @ApiOperation({
        summary: 'Verify OTP for email-verification or forget-password flows',
    })
    @ApiBody({ type: VerifyEmailOtpDto })
    @ApiResponse({ status: 200 })
    @ApiResponse({ status: 400, description: 'OTP invalid or expired.' })
    async verifyEmail(@Body() body: VerifyEmailOtpDto, @Req() req: Request) {
        return this.authResponse.handle(await this.emailOtpService.verifyEmail(body, req));
    }

    @Post('sign-in')
    @AllowAnonymous()
    @ApiOperation({ summary: 'Passwordless sign-in with email OTP' })
    @ApiBody({ type: SignInWithEmailOtpDto })
    @ApiResponse({ status: 200, description: 'Session created.' })
    @ApiResponse({ status: 401, description: 'OTP invalid or expired.' })
    async signIn(
        @Body() body: SignInWithEmailOtpDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authResponse.handle(await this.emailOtpService.signIn(body, req), res);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Username Auth')
@Controller('auth/username')
@UseFilters(BetterAuthExceptionFilter)
export class UsernameController {
    constructor(
        private readonly usernameService: UsernameService,
        private readonly authResponse: AuthResponseHelper,
    ) {}

    @Post('sign-in')
    @AllowAnonymous()
    @ApiOperation({ summary: 'Sign in with username (or email) + password' })
    @ApiBody({ type: SignInUsernameDto })
    @ApiResponse({ status: 200, description: 'Session created.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async signIn(
        @Body() body: SignInUsernameDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authResponse.handle(await this.usernameService.signIn(body, req), res);
    }

    @Patch('update')
    @ApiOperation({ summary: 'Update username for the current user' })
    @ApiBody({ type: UpdateUsernameDto })
    @ApiResponse({ status: 200 })
    @ApiResponse({ status: 409, description: 'Username already taken.' })
    async update(@Body() body: UpdateUsernameDto, @Req() req: Request) {
        return this.authResponse.handle(await this.usernameService.updateUsername(body, req));
    }
}

// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('Multi-Session')
@Controller('auth/multi-session')
@UseFilters(BetterAuthExceptionFilter)
export class MultiSessionController {
    constructor(
        private readonly multiSessionService: MultiSessionService,
        private readonly authResponse: AuthResponseHelper,
    ) {}

    @Get()
    @ApiOperation({
        summary: 'List all sessions in the multi-session stack for this device',
    })
    @ApiResponse({ status: 200 })
    async listDeviceSessions(@Req() req: Request) {
        return this.authResponse.handle(await this.multiSessionService.listDeviceSessions(req));
    }

    @Post('set-active')
    @ApiOperation({ summary: 'Switch the active session (account switcher)' })
    @ApiBody({ type: SetActiveSessionDto })
    @ApiResponse({ status: 200 })
    async setActive(
        @Body() body: SetActiveSessionDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        return this.authResponse.handle(
            await this.multiSessionService.setActiveSession(body, req),
            res,
        );
    }

    @Delete(':sessionToken')
    @ApiOperation({ summary: 'Remove a session from the multi-session stack' })
    @ApiParam({ name: 'sessionToken' })
    @ApiResponse({ status: 200 })
    async revokeDeviceSession(@Param('sessionToken') sessionToken: string, @Req() req: Request) {
        return this.authResponse.handle(
            await this.multiSessionService.revokeDeviceSession({ sessionToken }, req),
        );
    }
}

// ─────────────────────────────────────────────────────────────────────────────
@ApiTags('API Keys')
@Controller('auth/api-keys')
@UseFilters(BetterAuthExceptionFilter)
export class ApiKeyController {
    constructor(
        private readonly apiKeyService: ApiKeyService,
        private readonly authResponse: AuthResponseHelper,
    ) {}

    @Get()
    @ApiOperation({ summary: 'List all API keys for the current user' })
    @ApiResponse({ status: 200 })
    async list(@Req() req: Request) {
        return this.authResponse.handle(await this.apiKeyService.listApiKeys(req));
    }

    @Post()
    @ApiOperation({ summary: 'Create a new API key' })
    @ApiBody({ type: CreateApiKeyDto })
    @ApiResponse({
        status: 200,
        description: 'Key returned. The raw key value is only shown once.',
    })
    async create(@Body() body: CreateApiKeyDto, @Req() req: Request) {
        return this.authResponse.handle(await this.apiKeyService.createApiKey(body, req));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get API key metadata by ID' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    async getOne(@Param('id') id: string, @Req() req: Request) {
        return this.authResponse.handle(await this.apiKeyService.getApiKey({ id }, req));
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an API key' })
    @ApiParam({ name: 'keyId' })
    @ApiBody({ type: UpdateApiKeyDto })
    @ApiResponse({ status: 200 })
    async update(@Param('id') keyId: string, @Body() body: UpdateApiKeyDto, @Req() req: Request) {
        return this.authResponse.handle(
            await this.apiKeyService.updateApiKey({ keyId, ...body }, req),
        );
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an API key' })
    @ApiParam({ name: 'keyId' })
    @ApiResponse({ status: 200 })
    async remove(@Param('id') keyId: string, @Req() req: Request) {
        return this.authResponse.handle(await this.apiKeyService.deleteApiKey({ keyId }, req));
    }
}
