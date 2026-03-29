import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseFilters } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { SetActiveSessionDto } from '../dto';
import { BetterAuthExceptionFilter } from '../filters/better-auth-exception.filter';
import { AuthResponseHelper } from '../helpers/auth-response.helper';
import { MultiSessionService } from '../services';

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
