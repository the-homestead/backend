import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { auth } from '../auth.main';
import { SendEmailOtpDto, VerifyEmailOtpDto, SignInWithEmailOtpDto } from '../dto';
import { toRequestHeaders } from '../helpers/to-request-headers.helper';

@Injectable()
export class EmailOtpService {
    sendOtp(body: SendEmailOtpDto, req: Request): Promise<Response> {
        return auth.api.sendVerificationOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    verifyEmail(body: VerifyEmailOtpDto, req: Request): Promise<Response> {
        return auth.api.verifyEmailOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }

    signIn(body: SignInWithEmailOtpDto, req: Request): Promise<Response> {
        return auth.api.signInEmailOTP({
            body,
            headers: toRequestHeaders(req.headers),
            asResponse: true,
        });
    }
}
