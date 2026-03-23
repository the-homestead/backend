import { Body, Controller, Get, Post, Req, Res, UseFilters } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Session } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';
import {
    LinkSocialDto,
    RevokeSessionDto,
    UnlinkSocialDto,
    UpdateSessionDto,
} from '../dto/users.dto';
import { BetterAuthExceptionFilter } from '../filters/better-auth-exception.filter';
import { AuthResponseHelper } from '../helpers/auth-response.helper';
import { UsersService } from '../services/users.service';
import type { Session as BASession } from '../auth.main';

@ApiTags('Users')
@Controller('auth/users')
@UseFilters(BetterAuthExceptionFilter)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authResponse: AuthResponseHelper,
    ) {}

    @Get('me')
    @ApiOperation({ summary: 'Get current authenticated user + session' })
    @ApiResponse({ status: 200, description: 'Session and user data.' })
    @ApiResponse({ status: 401, description: 'Not authenticated.' })
    getMe(@Session() session: BASession) {
        return session;
    }

    @Get('sessions')
    @ApiOperation({ summary: 'List all active sessions for the current user' })
    @ApiResponse({ status: 200, description: 'Array of sessions.' })
    async listSessions(@Req() req: Request) {
        const authRes = await this.usersService.listActiveSessions(req);
        return this.authResponse.handle(authRes);
    }

    @Post('sessions/revoke')
    @ApiOperation({ summary: 'Revoke a specific session by token' })
    @ApiBody({ type: RevokeSessionDto })
    @ApiResponse({ status: 200, description: 'Session revoked.' })
    async revokeSession(@Body() body: RevokeSessionDto, @Req() req: Request) {
        const authRes = await this.usersService.revokeSession(body, req);
        return this.authResponse.handle(authRes);
    }

    @Post('sessions/revoke-other')
    @ApiOperation({ summary: 'Revoke all sessions except the current one' })
    @ApiResponse({ status: 200, description: 'Other sessions revoked.' })
    async revokeOtherSessions(@Req() req: Request) {
        const authRes = await this.usersService.revokeOtherSessions(req);
        return this.authResponse.handle(authRes);
    }

    @Post('sessions/revoke-all')
    @ApiOperation({
        summary: 'Revoke ALL sessions including the current one (full sign-out everywhere)',
    })
    @ApiResponse({ status: 200, description: 'All sessions revoked.' })
    async revokeAllSessions(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const authRes = await this.usersService.revokeAllSessions(req);
        return this.authResponse.handle(authRes, res);
    }

    @Get('accounts')
    @ApiOperation({ summary: 'List linked OAuth / social accounts' })
    @ApiResponse({
        status: 200,
        description: 'Array of linked provider accounts.',
    })
    async listAccounts(@Req() req: Request) {
        const authRes = await this.usersService.listAccounts(req);
        return this.authResponse.handle(authRes);
    }

    @Post('accounts/link')
    @ApiOperation({
        summary: 'Link a new social provider — returns redirect URL to begin OAuth flow',
    })
    @ApiBody({ type: LinkSocialDto })
    @ApiResponse({ status: 200, description: 'Redirect URL returned.' })
    async linkSocial(@Body() body: LinkSocialDto, @Req() req: Request) {
        const authRes = await this.usersService.linkSocial(body, req);
        return this.authResponse.handle(authRes);
    }

    @Post('accounts/unlink')
    @ApiOperation({
        summary: 'Unlink a social provider from the current account',
    })
    @ApiBody({ type: UnlinkSocialDto })
    @ApiResponse({ status: 200, description: 'Account unlinked.' })
    @ApiResponse({
        status: 400,
        description: 'Cannot unlink last auth method.',
    })
    async unlinkSocial(@Body() body: UnlinkSocialDto, @Req() req: Request) {
        const authRes = await this.usersService.unlinkSocial(body, req);
        return this.authResponse.handle(authRes);
    }

    @Post('sessions/update')
    @ApiOperation({ summary: 'Update session metadata (e.g. language)' })
    @ApiBody({ type: UpdateSessionDto })
    @ApiResponse({ status: 200, description: 'Session updated.' })
    async updateSession(@Body() body: UpdateSessionDto, @Req() req: Request) {
        const authRes = await this.usersService.updateSession(body, req);
        return this.authResponse.handle(authRes);
    }
}
