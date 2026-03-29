import { Injectable } from '@nestjs/common';
import { AuthService as BAAuthService } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';

import type { auth } from '../auth.main';
import type {
    ChangeEmailDto,
    ChangePasswordDto,
    DeleteAccountDto,
    ForgetPasswordDto,
    ResetPasswordDto,
    SendVerificationEmailDto,
    SignInEmailDto,
    SignUpEmailDto,
    UpdateUserDto,
} from '../dto/auth.dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

@Injectable()
export class AuthService {
    constructor(private authService: BAAuthService<typeof auth>) {}
    signUpEmail(body: SignUpEmailDto, req: Request): Promise<Response> {
        return this.authService.api.signUpEmail({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    signInEmail(body: SignInEmailDto, req: Request): Promise<Response> {
        return this.authService.api.signInEmail({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    signOut(req: Request): Promise<Response> {
        return this.authService.api.signOut({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    getSession(req: Request): Promise<Response> {
        return this.authService.api.getSession({
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    forgetPassword(body: ForgetPasswordDto, req: Request): Promise<Response> {
        return this.authService.api.forgetPasswordEmailOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    resetPassword(body: ResetPasswordDto, req: Request): Promise<Response> {
        return this.authService.api.resetPassword({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    changePassword(body: ChangePasswordDto, req: Request): Promise<Response> {
        return this.authService.api.changePassword({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    verifyEmail(query: { token: string; callbackURL?: string }, req: Request): Promise<Response> {
        return this.authService.api.verifyEmail({
            query,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    sendVerificationEmail(body: SendVerificationEmailDto, req: Request): Promise<Response> {
        return this.authService.api.sendVerificationEmail({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    updateUser(body: UpdateUserDto, req: Request): Promise<Response> {
        return this.authService.api.updateUser({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    changeEmail(body: ChangeEmailDto, req: Request): Promise<Response> {
        return this.authService.api.changeEmail({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    deleteUser(body: DeleteAccountDto, req: Request): Promise<Response> {
        return this.authService.api.deleteUser({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}
