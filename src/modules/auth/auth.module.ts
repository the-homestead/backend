import { Global, Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth.main';

// Controllers — imported directly (not via barrel) so eslint-plugin-nestjs-typed
// can statically verify each class is registered in a module.
import { AdminController } from './controllers/admin.controller';
import { AuthController } from './controllers/auth.controller';
import {
    ApiKeyController,
    EmailOtpController,
    MagicLinkController,
    MultiSessionController,
    PasskeyController,
    TwoFactorController,
    UsernameController,
} from './controllers/misc.controllers';
import { OrgsController } from './controllers/orgs.controller';
import { UsersController } from './controllers/users.controller';

// Services — same reason, direct imports only
import { AdminService } from './services/admin.service';
import { AuthService } from './services/auth.service';
import {
    ApiKeyService,
    EmailOtpService,
    MagicLinkService,
    MultiSessionService,
    PasskeyService,
    TwoFactorService,
    UsernameService,
} from './services/misc.services';
import { OrgsService } from './services/orgs.service';
import { UsersService } from './services/users.service';
import { AuthResponseHelper } from './helpers/auth-response.helper';

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
        AdminController,
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
