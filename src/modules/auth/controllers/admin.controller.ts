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
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AllowAnonymous, OptionalAuth, Roles, Session } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';

import {
    BanUserDto,
    CreateUserAdminDto,
    ImpersonateDto,
    RevokeUserSessionDto,
    SetUserRoleDto,
} from '../dto/admin.dto';
import { BetterAuthExceptionFilter } from '../filters/better-auth-exception.filter';
import { AuthResponseHelper } from '../helpers/auth-response.helper';
import { AdminService } from '../services/admin.service';

@ApiTags('Admin')
@Controller('auth/admin')
@UseFilters(BetterAuthExceptionFilter)
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly authResponse: AuthResponseHelper,
    ) {}

    @Get('users')
    @Roles(['admin'])
    @ApiOperation({
        summary: 'List all users — paginated, sortable, filterable',
    })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
    @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
    @ApiQuery({ name: 'searchField', required: false, enum: ['email', 'name'] })
    @ApiQuery({ name: 'searchValue', required: false })
    @ApiQuery({
        name: 'searchOperator',
        required: false,
        enum: ['contains', 'starts_with', 'ends_with'],
    })
    @ApiQuery({ name: 'filterField', required: false })
    @ApiQuery({ name: 'filterValue', required: false })
    @ApiQuery({
        name: 'filterOperator',
        required: false,
        enum: ['eq', 'ne', 'lt', 'lte', 'gt', 'gte'],
    })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        enum: ['email', 'name', 'createdAt'],
    })
    @ApiQuery({ name: 'sortDirection', required: false, enum: ['asc', 'desc'] })
    @ApiResponse({ status: 200, description: 'Paginated users.' })
    @ApiResponse({ status: 403, description: 'Admin role required.' })
    async listUsers(
        @Query('limit') limit: number,
        @Query('offset') offset: number,
        @Query('searchField') searchField: 'email' | 'name' | undefined,
        @Query('searchValue') searchValue: string,
        @Query('searchOperator')
        searchOperator: 'contains' | 'starts_with' | 'ends_with' | undefined,
        @Query('filterField') filterField: string,
        @Query('filterValue') filterValue: string,
        @Query('filterOperator')
        filterOperator: 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte',
        @Query('sortBy') sortBy: string,
        @Query('sortDirection') sortDirection: 'asc' | 'desc',
        @Req() req: Request,
    ) {
        const authRes = await this.adminService.listUsers(
            {
                limit,
                offset,
                searchField,
                searchValue,
                searchOperator,
                filterField,
                filterValue,
                filterOperator,
                sortBy,
                sortDirection,
            },
            req,
        );
        return this.authResponse.handle(authRes);
    }

    @Get('users/:userId')
    @Roles(['admin'])
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200, description: 'User details.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async getUser(@Param('userId') id: string, @Req() req: Request) {
        const authRes = await this.adminService.getUser({ id }, req);
        return this.authResponse.handle(authRes);
    }

    @Post('users')
    @Roles(['admin'])
    @ApiOperation({ summary: 'Create a user directly (bypasses sign-up flow)' })
    @ApiBody({ type: CreateUserAdminDto })
    @ApiResponse({ status: 200, description: 'User created.' })
    async createUser(@Body() body: CreateUserAdminDto, @Req() req: Request) {
        const authRes = await this.adminService.createUser(body, req);
        return this.authResponse.handle(authRes);
    }

    @Patch('users/:userId/role')
    @Roles(['admin'])
    @ApiOperation({ summary: 'Set a user role' })
    @ApiParam({ name: 'userId' })
    @ApiBody({ type: SetUserRoleDto })
    @ApiResponse({ status: 200, description: 'Role updated.' })
    async setRole(
        @Param('userId') userId: string,
        @Body() body: SetUserRoleDto,
        @Req() req: Request,
    ) {
        const authRes = await this.adminService.setRole({ userId, ...body }, req);
        return this.authResponse.handle(authRes);
    }

    @Delete('users/:userId')
    @Roles(['admin'])
    @ApiOperation({ summary: 'Permanently delete a user' })
    @ApiParam({ name: 'userId' })
    @ApiResponse({ status: 200, description: 'User deleted.' })
    async removeUser(@Param('userId') userId: string, @Req() req: Request) {
        const authRes = await this.adminService.removeUser({ userId }, req);
        return this.authResponse.handle(authRes);
    }

    @Post('users/:userId/ban')
    @Roles(['admin'])
    @ApiOperation({ summary: 'Ban a user' })
    @ApiParam({ name: 'userId' })
    @ApiBody({ type: BanUserDto, required: false })
    @ApiResponse({ status: 200, description: 'User banned.' })
    async banUser(@Param('userId') userId: string, @Body() body: BanUserDto, @Req() req: Request) {
        const authRes = await this.adminService.banUser({ userId, ...body }, req);
        return this.authResponse.handle(authRes);
    }

    @Post('users/:userId/unban')
    @Roles(['admin'])
    @ApiOperation({ summary: 'Unban a user' })
    @ApiParam({ name: 'userId' })
    @ApiResponse({ status: 200, description: 'User unbanned.' })
    async unbanUser(@Param('userId') userId: string, @Req() req: Request) {
        const authRes = await this.adminService.unbanUser({ userId }, req);
        return this.authResponse.handle(authRes);
    }

    @Post('impersonate')
    @Roles(['admin'])
    @ApiOperation({
        summary: 'Impersonate a user — creates a flagged session as that user',
    })
    @ApiBody({ type: ImpersonateDto })
    @ApiResponse({ status: 200, description: 'Impersonation session created.' })
    @ApiResponse({
        status: 403,
        description: 'Cannot impersonate another admin.',
    })
    async impersonateUser(
        @Body() body: ImpersonateDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const authRes = await this.adminService.impersonateUser(body, req);
        return this.authResponse.handle(authRes, res);
    }

    @Post('stop-impersonating')
    @Roles(['admin'])
    @ApiOperation({
        summary: 'Stop impersonating — return to original admin session',
    })
    @ApiResponse({ status: 200, description: 'Impersonation ended.' })
    async stopImpersonating(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const authRes = await this.adminService.stopImpersonating(req);
        return this.authResponse.handle(authRes, res);
    }

    @Get('users/:userId/sessions')
    @Roles(['admin'])
    @ApiOperation({ summary: 'List all active sessions for a user' })
    @ApiParam({ name: 'userId' })
    @ApiResponse({ status: 200, description: 'Array of sessions.' })
    async listUserSessions(@Param('userId') userId: string, @Req() req: Request) {
        const authRes = await this.adminService.listUserSessions({ userId }, req);
        return this.authResponse.handle(authRes);
    }

    @Delete('users/:userId/sessions')
    @Roles(['admin'])
    @ApiOperation({ summary: 'Revoke a specific session for a user' })
    @ApiParam({ name: 'userId' })
    @ApiBody({ type: RevokeUserSessionDto })
    @ApiResponse({ status: 200, description: 'Session revoked.' })
    async revokeUserSession(@Body() body: RevokeUserSessionDto, @Req() req: Request) {
        const authRes = await this.adminService.revokeUserSession(body, req);
        return this.authResponse.handle(authRes);
    }

    @Get('public')
    @AllowAnonymous()
    @ApiOperation({ summary: 'Public route' })
    @ApiResponse({ status: 200, type: String })
    @ApiBadRequestResponse({ description: 'Public' })
    publicRoute() {
        return { message: 'Public.' };
    }

    @Get('optional')
    @OptionalAuth()
    @ApiOperation({ summary: 'Optional auth route' })
    @ApiResponse({ status: 200, type: String })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    optionalRoute(@Session() session: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return { authenticated: !!session, session: session ?? null };
    }
}
