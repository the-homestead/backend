import { Controller, UseFilters, Post, Body, Req, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { SendMagicLinkDto } from '../dto';
import { BetterAuthExceptionFilter } from '../filters/better-auth-exception.filter';
import { AuthResponseHelper } from '../helpers/auth-response.helper';
import { MagicLinkService } from '../services';
import type { Request, Response } from 'express';

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
