import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { auth } from '../auth.main';
import type {
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
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

/**
 * Service for organization and team management flows.
 *
 * Integrates with Better Auth to provide organization, team, and membership APIs.
 *
 * Note: There is no official Better Auth documentation page for org/team APIs. See related discussion: https://github.com/better-auth/better-auth/discussions/5659
 */
@Injectable()
export class OrgsService {
    listOrganizations(req: Request): Promise<Response> {
        return auth.api.listOrganizations({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    getOrganization(
        query: { organizationId?: string; organizationSlug?: string },
        req: Request,
    ): Promise<Response> {
        return auth.api.getFullOrganization({
            query,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    createOrganization(body: CreateOrganizationDto, req: Request): Promise<Response> {
        return auth.api.createOrganization({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    updateOrganization(
        body: { organizationId: string; data: UpdateOrganizationDto },
        req: Request,
    ): Promise<Response> {
        return auth.api.updateOrganization({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    deleteOrganization(body: { organizationId: string }, req: Request): Promise<Response> {
        return auth.api.deleteOrganization({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    inviteMember(body: InviteMemberDto, req: Request): Promise<Response> {
        return auth.api.createInvitation({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    getInvitation(query: { id: string }, req: Request): Promise<Response> {
        return auth.api.getInvitation({
            query,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    cancelInvitation(body: { invitationId: string }, req: Request): Promise<Response> {
        return auth.api.cancelInvitation({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    acceptInvitation(body: { invitationId: string }, req: Request): Promise<Response> {
        return auth.api.acceptInvitation({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    rejectInvitation(body: { invitationId: string }, req: Request): Promise<Response> {
        return auth.api.rejectInvitation({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    updateMemberRole(body: UpdateMemberRoleDto, req: Request): Promise<Response> {
        return auth.api.updateMemberRole({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    removeMember(body: RemoveMemberDto, req: Request): Promise<Response> {
        return auth.api.removeMember({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    leaveOrganization(body: { organizationId: string }, req: Request): Promise<Response> {
        return auth.api.leaveOrganization({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    setActiveOrganization(
        body: { organizationId: string | null },
        req: Request,
    ): Promise<Response> {
        return auth.api.setActiveOrganization({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    hasPermission(body: HasPermissionDto, req: Request): Promise<Response> {
        return auth.api.hasPermission({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    // ── Teams ─────────────────────────────────────────────────────────────────

    listTeams(query: { organizationId: string }, req: Request): Promise<Response> {
        return auth.api.listUserTeams({
            query,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    createTeam(body: CreateTeamDto, req: Request): Promise<Response> {
        return auth.api.createTeam({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    updateTeam(body: UpdateTeamDto, req: Request): Promise<Response> {
        return auth.api.updateTeam({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    removeTeam(body: { teamId: string; organizationId: string }, req: Request): Promise<Response> {
        return auth.api.removeTeam({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    listTeamMembers(
        query: { teamId: string; organizationId: string },
        req: Request,
    ): Promise<Response> {
        return auth.api.listTeamMembers({
            query,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    addTeamMember(body: TeamMemberDto, req: Request): Promise<Response> {
        return auth.api.addTeamMember({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    removeTeamMember(body: TeamMemberDto, req: Request): Promise<Response> {
        return auth.api.removeTeamMember({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}
