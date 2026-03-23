import { Injectable } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';
import type { auth } from '../auth.main';
import type {
    BanUserDto,
    CreateUserAdminDto,
    ImpersonateDto,
    RevokeUserSessionDto,
    SetUserRoleDto,
} from '../dto/admin.dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

@Injectable()
export class AdminService {
    constructor(private authService: AuthService<typeof auth>) {}
    listUsers(
        query: {
            limit?: number;
            offset?: number;
            searchField?: 'email' | 'name' | undefined;
            searchValue?: string;
            searchOperator?: 'contains' | 'starts_with' | 'ends_with' | undefined;
            filterField?: string;
            filterValue?: string | number | boolean | string[] | number[] | undefined;
            filterOperator?:
                | 'contains'
                | 'starts_with'
                | 'ends_with'
                | 'eq'
                | 'ne'
                | 'gt'
                | 'gte'
                | 'lt'
                | 'lte'
                | 'in'
                | 'not_in'
                | undefined;
            sortBy?: string;
            sortDirection?: 'asc' | 'desc' | undefined;
        },
        req: Request,
    ): Promise<Response> {
        return this.authService.api.listUsers({
            query,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    getUser(query: { id: string }, req: Request): Promise<Response> {
        return this.authService.api.getUser({
            query,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    createUser(body: CreateUserAdminDto, req: Request): Promise<Response> {
        return this.authService.api.createUser({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    setRole(body: { userId: string } & SetUserRoleDto, req: Request): Promise<Response> {
        return this.authService.api.setRole({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    removeUser(body: { userId: string }, req: Request): Promise<Response> {
        return this.authService.api.removeUser({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    banUser(body: { userId: string } & BanUserDto, req: Request): Promise<Response> {
        return this.authService.api.banUser({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    unbanUser(body: { userId: string }, req: Request): Promise<Response> {
        return this.authService.api.unbanUser({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    impersonateUser(body: ImpersonateDto, req: Request): Promise<Response> {
        return this.authService.api.impersonateUser({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    stopImpersonating(req: Request): Promise<Response> {
        return this.authService.api.stopImpersonating({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    listUserSessions(body: { userId: string }, req: Request): Promise<Response> {
        return this.authService.api.listUserSessions({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    revokeUserSession(body: RevokeUserSessionDto, req: Request): Promise<Response> {
        return this.authService.api.revokeUserSession({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}
