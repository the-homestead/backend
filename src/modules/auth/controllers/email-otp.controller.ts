import { Body, Controller, Post, Req, Res, UseFilters } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';

import { SendEmailOtpDto, SignInWithEmailOtpDto, VerifyEmailOtpDto } from '../dto';
import { BetterAuthExceptionFilter } from '../filters/better-auth-exception.filter';
import { AuthResponseHelper } from '../helpers/auth-response.helper';
import { EmailOtpService } from '../services';

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
