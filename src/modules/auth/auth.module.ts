import { Global, Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import { auth } from './auth.main';
import { AdminController } from './controllers/admin.controller';
import { ApiKeyController } from './controllers/apikey.controller';
import { AuthController } from './controllers/auth.controller';
import { EmailOtpController } from './controllers/email-otp.controller';
import { MagicLinkController } from './controllers/magic-link.controller';
import { MultiSessionController } from './controllers/multi-session.controller';
import { OrgsController } from './controllers/orgs.controller';
import { PasskeyController } from './controllers/passkey.controller';
import { TwoFactorController } from './controllers/two-factor.controller';
import { UsernameController } from './controllers/username.controller';
import { UsersController } from './controllers/users.controller';
import { AuthResponseHelper } from './helpers/auth-response.helper';
import { AdminService } from './services/admin.service';
import { ApiKeyService } from './services/apikey.service';
import { AuthService } from './services/auth.service';
import { EmailOtpService } from './services/email-otp.service';
import { MagicLinkService } from './services/magic-link.service';
import { MultiSessionService } from './services/multi-session.service';
import { OrgsService } from './services/orgs.service';
import { PasskeyService } from './services/passkey.service';
import { TwoFactorService } from './services/two-factor.service';
import { UsernameService } from './services/username.service';
import { UsersService } from './services/users.service';

@Global()
@Module({
    imports: [BetterAuthModule.forRoot({ auth })],
    controllers: [
        AuthController,
        UsersController,
        AdminController,
        OrgsController,
        TwoFactorController,
        MagicLinkController,
        EmailOtpController,
        PasskeyController,
        UsernameController,
        MultiSessionController,
        ApiKeyController,
    ],
    providers: [
        AuthService,
        UsersService,
        AdminService,
        OrgsService,
        TwoFactorService,
        MagicLinkService,
        EmailOtpService,
        PasskeyService,
        UsernameService,
        MultiSessionService,
        ApiKeyService,
        AuthResponseHelper,
    ],
    exports: [
        AuthService,
        UsersService,
        AdminService,
        OrgsService,
        TwoFactorService,
        MagicLinkService,
        EmailOtpService,
        PasskeyService,
        UsernameService,
        MultiSessionService,
        ApiKeyService,
        AuthResponseHelper,
    ],
})
export class AuthModule {}
