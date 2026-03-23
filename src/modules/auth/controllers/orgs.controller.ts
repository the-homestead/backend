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
    UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous, OrgRoles } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';
import {
    CreateOrganizationDto,
    CreateTeamDto,
    HasPermissionDto,
    InviteMemberDto,
    RemoveMemberDto,
    TeamMemberDto,
    UpdateMemberRoleDto,
    UpdateOrganizationDto,
    UpdateTeamDto,
} from '../dto/orgs.dto';
import { BetterAuthExceptionFilter } from '../filters/better-auth-exception.filter';
import { AuthResponseHelper } from '../helpers/auth-response.helper';
import { OrgsService } from '../services/orgs.service';

@ApiTags('Organizations')
@Controller('auth/orgs')
@UseFilters(BetterAuthExceptionFilter)
export class OrgsController {
    constructor(
        private readonly orgsService: OrgsService,
        private readonly authResponse: AuthResponseHelper,
    ) {}

    // ── Organization CRUD ─────────────────────────────────────────────────────

    @Get()
    @ApiOperation({ summary: 'List organizations the current user belongs to' })
    @ApiResponse({ status: 200 })
    async list(@Req() req: Request) {
        return this.authResponse.handle(await this.orgsService.listOrganizations(req));
    }

    @Get(':organizationId')
    @ApiOperation({ summary: 'Get full organization details by ID' })
    @ApiParam({ name: 'organizationId' })
    @ApiResponse({ status: 200 })
    @ApiResponse({ status: 404, description: 'Not found.' })
    async getOne(@Param('organizationId') organizationId: string, @Req() req: Request) {
        return this.authResponse.handle(
            await this.orgsService.getOrganization({ organizationId }, req),
        );
    }

    @Post()
    @ApiOperation({ summary: 'Create a new organization' })
    @ApiBody({ type: CreateOrganizationDto })
    @ApiResponse({ status: 200, description: 'Organization created.' })
    @ApiResponse({ status: 409, description: 'Slug already taken.' })
    async create(@Body() body: CreateOrganizationDto, @Req() req: Request) {
        return this.authResponse.handle(await this.orgsService.createOrganization(body, req));
    }

    @Patch(':organizationId')
    @OrgRoles(['owner', 'admin'])
    @ApiOperation({ summary: 'Update organization (owner / admin)' })
    @ApiParam({ name: 'organizationId' })
    @ApiBody({ type: UpdateOrganizationDto })
    @ApiResponse({ status: 200 })
    async update(
        @Param('organizationId') organizationId: string,
        @Body() body: UpdateOrganizationDto,
        @Req() req: Request,
    ) {
        return this.authResponse.handle(
            await this.orgsService.updateOrganization({ organizationId, data: body }, req),
        );
    }

    @Delete(':organizationId')
    @OrgRoles(['owner'])
    @ApiOperation({ summary: 'Delete organization (owner only)' })
    @ApiParam({ name: 'organizationId' })
    @ApiResponse({ status: 200 })
    async remove(@Param('organizationId') organizationId: string, @Req() req: Request) {
        return this.authResponse.handle(
            await this.orgsService.deleteOrganization({ organizationId }, req),
        );
    }

    @Post('set-active')
    @ApiOperation({
        summary: 'Set active organization for the current session',
    })
    @ApiBody({
        schema: {
            properties: { organizationId: { type: 'string', nullable: true } },
        },
    })
    @ApiResponse({ status: 200 })
    async setActive(@Body('organizationId') organizationId: string | null, @Req() req: Request) {
        return this.authResponse.handle(
            await this.orgsService.setActiveOrganization({ organizationId }, req),
        );
    }

    @Post('has-permission')
    @ApiOperation({
        summary: 'Check if current member has a specific permission',
    })
    @ApiBody({ type: HasPermissionDto })
    @ApiResponse({ status: 200 })
    async hasPermission(@Body() body: HasPermissionDto, @Req() req: Request) {
        return this.authResponse.handle(await this.orgsService.hasPermission(body, req));
    }

    // ── Invitations ───────────────────────────────────────────────────────────

    @Post('invitations')
    @OrgRoles(['owner', 'admin'])
    @ApiOperation({ summary: 'Invite a user to an organization' })
    @ApiBody({ type: InviteMemberDto })
    @ApiResponse({ status: 200, description: 'Invitation sent.' })
    async inviteMember(@Body() body: InviteMemberDto, @Req() req: Request) {
        return this.authResponse.handle(await this.orgsService.inviteMember(body, req));
    }

    @Get('invitations/:invitationId')
    @AllowAnonymous()
    @ApiOperation({
        summary: 'Get invitation details by ID (used on accept/reject pages)',
    })
    @ApiParam({ name: 'invitationId' })
    @ApiResponse({ status: 200 })
    async getInvitation(@Param('invitationId') invitationId: string, @Req() req: Request) {
        return this.authResponse.handle(
            await this.orgsService.getInvitation({ id: invitationId }, req),
        );
    }

    @Post('invitations/:invitationId/cancel')
    @OrgRoles(['owner', 'admin'])
    @ApiOperation({ summary: 'Cancel a pending invitation' })
    @ApiParam({ name: 'invitationId' })
    @ApiResponse({ status: 200 })
    async cancelInvitation(@Param('invitationId') invitationId: string, @Req() req: Request) {
        return this.authResponse.handle(
            await this.orgsService.cancelInvitation({ invitationId }, req),
        );
    }

    @Post('invitations/:invitationId/accept')
    @ApiOperation({ summary: 'Accept an organization invitation' })
    @ApiParam({ name: 'invitationId' })
    @ApiResponse({ status: 200 })
    async acceptInvitation(@Param('invitationId') invitationId: string, @Req() req: Request) {
        return this.authResponse.handle(
            await this.orgsService.acceptInvitation({ invitationId }, req),
        );
    }

    @Post('invitations/:invitationId/reject')
    @ApiOperation({ summary: 'Reject an organization invitation' })
    @ApiParam({ name: 'invitationId' })
    @ApiResponse({ status: 200 })
    async rejectInvitation(@Param('invitationId') invitationId: string, @Req() req: Request) {
        return this.authResponse.handle(
            await this.orgsService.rejectInvitation({ invitationId }, req),
        );
    }

    // ── Members ───────────────────────────────────────────────────────────────

    @Patch('members/role')
    @OrgRoles(['owner', 'admin'])
    @ApiOperation({ summary: "Update a member's role" })
    @ApiBody({ type: UpdateMemberRoleDto })
    @ApiResponse({ status: 200 })
    async updateMemberRole(@Body() body: UpdateMemberRoleDto, @Req() req: Request) {
        return this.authResponse.handle(await this.orgsService.updateMemberRole(body, req));
    }

    @Delete('members')
    @OrgRoles(['owner', 'admin'])
    @ApiOperation({ summary: 'Remove a member from an organization' })
    @ApiBody({ type: RemoveMemberDto })
    @ApiResponse({ status: 200 })
    async removeMember(@Body() body: RemoveMemberDto, @Req() req: Request) {
        return this.authResponse.handle(await this.orgsService.removeMember(body, req));
    }

    @Post(':organizationId/leave')
    @ApiOperation({ summary: 'Leave an organization (current user)' })
    @ApiParam({ name: 'organizationId' })
    @ApiResponse({ status: 200 })
    async leaveOrganization(@Param('organizationId') organizationId: string, @Req() req: Request) {
        return this.authResponse.handle(
            await this.orgsService.leaveOrganization({ organizationId }, req),
        );
    }

    // ── Teams ─────────────────────────────────────────────────────────────────

    @Get(':organizationId/teams')
    @ApiOperation({ summary: 'List teams in an organization' })
    @ApiParam({ name: 'organizationId' })
    @ApiResponse({ status: 200 })
    async listTeams(@Param('organizationId') organizationId: string, @Req() req: Request) {
        return this.authResponse.handle(await this.orgsService.listTeams({ organizationId }, req));
    }

    @Post('teams')
    @OrgRoles(['owner', 'admin'])
    @ApiOperation({ summary: 'Create a team' })
    @ApiBody({ type: CreateTeamDto })
    @ApiResponse({ status: 200 })
    async createTeam(@Body() body: CreateTeamDto, @Req() req: Request) {
        return this.authResponse.handle(await this.orgsService.createTeam(body, req));
    }

    @Patch('teams')
    @OrgRoles(['owner', 'admin'])
    @ApiOperation({ summary: 'Update a team' })
    @ApiBody({ type: UpdateTeamDto })
    @ApiResponse({ status: 200 })
    async updateTeam(@Body() body: UpdateTeamDto, @Req() req: Request) {
        return this.authResponse.handle(await this.orgsService.updateTeam(body, req));
    }

    @Delete('teams')
    @OrgRoles(['owner', 'admin'])
    @ApiOperation({ summary: 'Delete a team' })
    @ApiBody({
        schema: {
            properties: {
                teamId: { type: 'string' },
                organizationId: { type: 'string' },
            },
        },
    })
    @ApiResponse({ status: 200 })
    async removeTeam(
        @Body('teamId') teamId: string,
        @Body('organizationId') organizationId: string,
        @Req() req: Request,
    ) {
        return this.authResponse.handle(
            await this.orgsService.removeTeam({ teamId, organizationId }, req),
        );
    }

    @Get('teams/:teamId/members')
    @ApiOperation({ summary: 'List team members' })
    @ApiParam({ name: 'teamId' })
    @ApiQuery({ name: 'organizationId', required: true })
    @ApiResponse({ status: 200 })
    async listTeamMembers(
        @Param('teamId') teamId: string,
        @Query('organizationId') organizationId: string,
        @Req() req: Request,
    ) {
        return this.authResponse.handle(
            await this.orgsService.listTeamMembers({ teamId, organizationId }, req),
        );
    }

    @Post('teams/members')
    @OrgRoles(['owner', 'admin'])
    @ApiOperation({ summary: 'Add a member to a team' })
    @ApiBody({ type: TeamMemberDto })
    @ApiResponse({ status: 200 })
    async addTeamMember(@Body() body: TeamMemberDto, @Req() req: Request) {
        return this.authResponse.handle(await this.orgsService.addTeamMember(body, req));
    }

    @Delete('teams/members')
    @OrgRoles(['owner', 'admin'])
    @ApiOperation({ summary: 'Remove a member from a team' })
    @ApiBody({ type: TeamMemberDto })
    @ApiResponse({ status: 200 })
    async removeTeamMember(@Body() body: TeamMemberDto, @Req() req: Request) {
        return this.authResponse.handle(await this.orgsService.removeTeamMember(body, req));
    }
}
