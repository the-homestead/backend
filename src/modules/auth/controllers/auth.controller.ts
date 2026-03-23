import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import type { Request, Response } from 'express';
import {
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
import { BetterAuthExceptionFilter } from '../filters/better-auth-exception.filter';
import { AuthResponseHelper } from '../helpers/auth-response.helper';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth — Core')
@Controller('auth')
@UseFilters(BetterAuthExceptionFilter)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly authResponse: AuthResponseHelper,
    ) {}

    @Post('sign-up/email')
    @AllowAnonymous()
    @ApiOperation({ summary: 'Register with email & password' })
    @ApiBody({ type: SignUpEmailDto })
    @ApiResponse({
        status: 200,
        description: 'User created. Session cookie set.',
    })
    @ApiResponse({ status: 422, description: 'Email already in use.' })
    async signUpEmail(
        @Body() body: SignUpEmailDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const authRes = await this.authService.signUpEmail(body, req);
        return this.authResponse.handle(authRes, res);
    }

    @Post('sign-in/email')
    @AllowAnonymous()
    @ApiOperation({ summary: 'Sign in with email & password' })
    @ApiBody({ type: SignInEmailDto })
    @ApiResponse({ status: 200, description: 'Session cookie set.' })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    @ApiResponse({ status: 403, description: 'Email not verified.' })
    async signInEmail(
        @Body() body: SignInEmailDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const authRes = await this.authService.signInEmail(body, req);
        return this.authResponse.handle(authRes, res);
    }

    @Post('sign-out')
    @ApiOperation({ summary: 'Sign out — clears session cookie' })
    @ApiResponse({ status: 200, description: 'Signed out.' })
    async signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const authRes = await this.authService.signOut(req);
        return this.authResponse.handle(authRes, res);
    }

    @Get('session')
    @AllowAnonymous()
    @ApiOperation({
        summary: 'Get current session. Returns null if unauthenticated.',
    })
    @ApiResponse({ status: 200, description: 'Session or null.' })
    async getSession(@Req() req: Request) {
        const authRes = await this.authService.getSession(req);
        return this.authResponse.handle(authRes);
    }

    @Post('forget-password')
    @AllowAnonymous()
    @ApiOperation({ summary: 'Request a password reset email' })
    @ApiBody({ type: ForgetPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Reset email dispatched (if account exists).',
    })
    async forgetPassword(@Body() body: ForgetPasswordDto, @Req() req: Request) {
        const authRes = await this.authService.forgetPassword(body, req);
        return this.authResponse.handle(authRes);
    }

    @Post('reset-password')
    @AllowAnonymous()
    @ApiOperation({ summary: 'Reset password using token from email' })
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({ status: 200, description: 'Password updated.' })
    @ApiResponse({ status: 400, description: 'Token invalid or expired.' })
    async resetPassword(@Body() body: ResetPasswordDto, @Req() req: Request) {
        const authRes = await this.authService.resetPassword(body, req);
        return this.authResponse.handle(authRes);
    }

    @Post('change-password')
    @ApiOperation({ summary: 'Change password (authenticated)' })
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({ status: 200, description: 'Password changed.' })
    @ApiResponse({ status: 400, description: 'Current password incorrect.' })
    async changePassword(@Body() body: ChangePasswordDto, @Req() req: Request) {
        const authRes = await this.authService.changePassword(body, req);
        return this.authResponse.handle(authRes);
    }

    @Get('verify-email')
    @AllowAnonymous()
    @ApiOperation({ summary: 'Verify email address via token link' })
    @ApiQuery({ name: 'token', required: true })
    @ApiQuery({ name: 'callbackURL', required: false })
    @ApiResponse({ status: 200, description: 'Email verified.' })
    @ApiResponse({ status: 400, description: 'Token invalid or expired.' })
    async verifyEmail(
        @Query('token') token: string,
        @Query('callbackURL') callbackURL: string | undefined,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const authRes = await this.authService.verifyEmail({ token, callbackURL }, req);
        return this.authResponse.handle(authRes, res);
    }

    @Post('send-verification-email')
    @ApiOperation({ summary: 'Resend the verification email' })
    @ApiBody({ type: SendVerificationEmailDto })
    @ApiResponse({ status: 200, description: 'Verification email queued.' })
    async sendVerificationEmail(@Body() body: SendVerificationEmailDto, @Req() req: Request) {
        const authRes = await this.authService.sendVerificationEmail(body, req);
        return this.authResponse.handle(authRes);
    }

    @Patch('update-user')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'User updated.' })
    async updateUser(@Body() body: UpdateUserDto, @Req() req: Request) {
        const authRes = await this.authService.updateUser(body, req);
        return this.authResponse.handle(authRes);
    }

    @Post('change-email')
    @ApiOperation({
        summary: 'Request an email change (sends verification to new address)',
    })
    @ApiBody({ type: ChangeEmailDto })
    @ApiResponse({
        status: 200,
        description: 'Verification sent to new address.',
    })
    async changeEmail(@Body() body: ChangeEmailDto, @Req() req: Request) {
        const authRes = await this.authService.changeEmail(body, req);
        return this.authResponse.handle(authRes);
    }

    @Delete('delete-user')
    @ApiOperation({
        summary: 'Permanently delete the authenticated user account',
    })
    @ApiBody({ type: DeleteAccountDto, required: false })
    @ApiResponse({ status: 200, description: 'Account deleted.' })
    @ApiResponse({
        status: 400,
        description: 'Password confirmation required.',
    })
    async deleteUser(
        @Body() body: DeleteAccountDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const authRes = await this.authService.deleteUser(body, req);
        return this.authResponse.handle(authRes, res);
    }
}
