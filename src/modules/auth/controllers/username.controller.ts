import { Controller, UseFilters, Post, Body, Req, Res, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { SignInUsernameDto, UpdateUsernameDto } from '../dto';
import { BetterAuthExceptionFilter } from '../filters/better-auth-exception.filter';
import { AuthResponseHelper } from '../helpers/auth-response.helper';
import { UsernameService } from '../services';
import type { Request, Response } from 'express';

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
