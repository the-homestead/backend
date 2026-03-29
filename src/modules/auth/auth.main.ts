/**
 * auth.main.ts
 * This file configures the better-auth instance with your chosen plugins and settings.
 * The exported 'auth' object is used by the AuthModule to create the NestJS providers
 * that your controllers and services will interact with.
 *
 * For plugin configuration reference, see:
 * https://better-auth.com/docs/plugins/organization.mdx
 * https://better-auth.com/docs/plugins/oauth-provider.mdx
 * https://better-auth.com/docs/plugins/2fa.mdx
 * https://better-auth.com/docs/plugins/username.mdx
 * https://better-auth.com/docs/plugins/magic-link.mdx
 * https://better-auth.com/docs/plugins/email-otp.mdx
 * https://better-auth.com/docs/plugins/passkey.mdx
 * https://better-auth.com/docs/plugins/captcha.mdx
 * https://better-auth.com/docs/plugins/have-i-been-pwned.mdx
 * https://better-auth.com/docs/plugins/i18n.mdx
 * https://better-auth.com/docs/plugins/last-login-method.mdx
 * https://better-auth.com/docs/plugins/multi-session.mdx
 * https://better-auth.com/docs/plugins/open-api.mdx
 * https://better-auth.com/docs/plugins/jwt.mdx
 * https://better-auth.com/docs/plugins/test-utils.mdx
 */
import 'dotenv/config';

// ── Core plugins (shipped inside better-auth) ──────────────────────────────────
import { apiKey } from '@better-auth/api-key';
import { i18n } from '@better-auth/i18n';
import { oauthProvider } from '@better-auth/oauth-provider'; // replaces mcp + oidc
// ── Separate-package plugins ───────────────────────────────────────────────────
import { passkey } from '@better-auth/passkey';
import { typeormAdapter } from '@hedystia/better-auth-typeorm';
import { betterAuth } from 'better-auth';
import { captcha, lastLoginMethod, openAPI, testUtils } from 'better-auth/plugins';
import { admin } from 'better-auth/plugins/admin';
import { bearer } from 'better-auth/plugins/bearer';
import { emailOTP } from 'better-auth/plugins/email-otp';
import { haveIBeenPwned } from 'better-auth/plugins/haveibeenpwned';
import { jwt } from 'better-auth/plugins/jwt';
import { magicLink } from 'better-auth/plugins/magic-link';
import { multiSession } from 'better-auth/plugins/multi-session';
import { organization } from 'better-auth/plugins/organization';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { username } from 'better-auth/plugins/username';

import { AppDataSource } from '../database/data-source';
import {
    adminRole,
    authorRole,
    developerRole,
    guestRole,
    moderatorRole,
    ownerRole,
    userRole,
    vip_oneRole,
    vip_twoRole,
} from './access/auth.access';
import {
    orgAc,
    orgAdmin,
    orgContributor,
    orgMember,
    orgOwner,
    orgPublisher,
} from './access/org.access';

// AppDataSource is intentionally NOT initialised here.
// NestJS TypeOrmModule.forRootAsync() initialises it during app bootstrap,
// before any request can reach an auth route.
// For CLI runs (migration:generate / better-auth CLI), use data-source.ts.

const IS_PROD = process.env.NODE_ENV === 'production';
const IS_TEST = process.env.NODE_ENV === 'testing';

const socialProviders: Record<string, any> = {};

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    socialProviders.google = {
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        scope: ['openid', 'email', 'profile'],
    };
}
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
    socialProviders.github = {
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
        scope: ['user:email', 'read:user'],
    };
}
if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET) {
    socialProviders.discord = {
        clientId: process.env.AUTH_DISCORD_ID,
        clientSecret: process.env.AUTH_DISCORD_SECRET,
        scope: ['identify', 'email'],
    };
}

if (process.env.AUTH_GITLAB_ID && process.env.AUTH_GITLAB_SECRET) {
    socialProviders.gitlab = {
        clientId: process.env.AUTH_GITLAB_ID,
        clientSecret: process.env.AUTH_GITLAB_SECRET,
        scope: ['read_user'],
    };
}

if (process.env.AUTH_TWITCH_ID && process.env.AUTH_TWITCH_SECRET) {
    socialProviders.twitch = {
        clientId: process.env.AUTH_TWITCH_ID,
        clientSecret: process.env.AUTH_TWITCH_SECRET,
        scope: ['user:read:email'],
    };
}

// ─────────────────────────────────────────────────────────────────────────────
export const auth = betterAuth({
    // ── Identity ───────────────────────────────────────────────────────────────
    appName: process.env.APP_NAME ?? 'Backend',
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    basePath: '/api/auth',

    // ── Advanced  ─────────────────────────────────────────────────────────────
    advanced: {
        ipAddress: {
            ipAddressHeaders: [
                'x-forwarded-for',
                'x-real-ip',
                'cf-connecting-ip',
                'fastly-client-ip',
                'true-client-ip',
                'x-cluster-client-ip',
                'x-forwarded',
                'forwarded-for',
                'forwarded',
            ],
            disableIpTracking: false,
        },
        useSecureCookies: IS_PROD,
        crossSubDomainCookies: {
            enabled: IS_PROD,
            domain: process.env.BETTER_AUTH_COOKIE_DOMAIN, // e.g. '.example.com' for sharing across subdomains
        },
        defaultCookieAttributes: {
            httpOnly: true,
            secure: IS_PROD,
            sameSite: IS_PROD ? 'lax' : 'none',
        },
    },

    // ── Social / OAuth providers ───────────────────────────────────────────────
    socialProviders,

    // ── Database ───────────────────────────────────────────────────────────────
    database: typeormAdapter(AppDataSource, {
        outputDir: './src/modules/auth',
        entitiesDir: './src/entities',
        migrationsDir: './migrations',
    }),

    // ── CORS / cookies ─────────────────────────────────────────────────────────
    trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',') ?? [],

    // ── Session ────────────────────────────────────────────────────────────────
    session: {
        storeSessionInDatabase: true,
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // rotate if > 1 day old
        additionalFields: {
            language: {
                type: 'string',
                input: true, // allow authClient.updateSession({ language }) to write it
            },
        },
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes
            strategy: 'jwt', // encrypt cookie contents to safely cache sensitive session data (e.g. for multi-session listing) without hitting the database on every request. Requires additional encryption keys in production for security — see docs for details.
        },
    },

    // ── Rate limiting ──────────────────────────────────────────────────────────
    rateLimit: {
        enabled: true,
        window: 60,
        max: 100,
        customRules: {
            '/sign-in/email': { window: 60, max: 5 },
            '/sign-up/email': { window: 60, max: 3 },
            '/two-factor/verify': { window: 10, max: 3 },
            '/request-password-reset': { window: 180, max: 1 },
            '/reset-password': { window: 60, max: 2 },
            '/magic-link/send': { window: 60, max: 3 },
            '/email-otp/send-verification-otp': { window: 60, max: 3 },
            '/passkey/register': { window: 60, max: 5 },
        },
    },

    // ── Email + Password ───────────────────────────────────────────────────────
    emailAndPassword: {
        enabled: true,
        disableSignUp: process.env.REGISTRATION_ENABLED === 'false',
        requireEmailVerification: true,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        // Temporary Dsiabled
        // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
        onExistingUserSignUp: async ({ user }, _request) => {
            // Avoid awaint the email sending to prevent timing attacks. use waitUntil or similar
            console.log({
                to: user.email,
                subject: 'Sign-up attempt with your email',
                text: 'Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.',
            });
        },
        // Temporary Dsiabled
        // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
        sendResetPassword: async ({ user, url, token }, _request) => {
            // Avoid awaint the email sending to prevent timing attacks. use waitUntil or similar
            console.log({
                to: user.email,
                subject: 'Reset your password',
                text: `Click the link to reset your password: ${url}`,
            });
        },
        // Temporary Dsiabled
        // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
        onPasswordReset: async ({ user }, _request) => {
            // your logic here when a password is reset successfully, e.g. send a confirmation email or log the event
            console.log(`Password for user ${user.email} has been reset.`);
        },
        customSyntheticUser: ({ coreFields, additionalFields, id }) => ({
            ...coreFields,
            // Admin plugin fields (in schema order)
            role: 'user',
            banned: false,
            banReason: null,
            banExpires: null,
            // Your additional fields
            ...additionalFields,
            // ID must be last to match database output order
            id,
        }),
    },

    // emailVerification: {
    //   sendVerificationEmail: async ({ user, url }) => {
    //     await mailer.send({ to: user.email, subject: 'Verify your email', html: `<a href="${url}">Verify</a>` });
    //   },
    //   autoSignInAfterVerification: true,
    // },

    // ── Account linking ────────────────────────────────────────────────────────
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ['google', 'github'],
        },
    },

    user: {
        additionalFields: {
            age: {
                type: 'number',
                input: true,
                required: false,
            },
            agePublic: {
                type: 'boolean',
                input: true,
                required: false,
            },
            firstName: {
                type: 'string',
                input: true,
                required: false,
            },
            firstNamePublic: {
                type: 'boolean',
                input: true,
                required: false,
            },
            lastName: {
                type: 'string',
                input: true,
                required: false,
            },
            lastNamePublic: {
                type: 'boolean',
                input: true,
                required: false,
            },
            bio: {
                type: 'string',
                input: true,
                required: false,
            },
        },
    },

    // ── Plugins ────────────────────────────────────────────────────────────────
    plugins: [
        // ── Two-Factor (TOTP + backup codes) ──────────────────────────────────────
        // See docs for adding other 2FA methods like emailOTP, passkey, or authenticator push notifications.
        // https://better-auth.com/docs/plugins/2fa.mdx
        twoFactor({
            issuer: process.env.APP_NAME ?? 'Backend',
            otpOptions: {
                period: 30,
                digits: 6,
            },
            backupCodes: {
                amount: 10,
                length: 10,
            },
        }),

        // ── Organisation / Teams ──────────────────────────────────────────────────
        // See docs for full API reference and example usage in OrgsService.
        // https://better-auth.com/docs/plugins/organization.mdx
        organization({
            allowUserToCreateOrganization: true,
            organizationLimit: 5,
            membershipLimit: 100,
            teams: {
                enabled: true,
                maximumTeams: 20,
            },
            ac: orgAc,
            roles: {
                owner: orgOwner,
                admin: orgAdmin,
                publisher: orgPublisher,
                contributor: orgContributor,
                member: orgMember,
            },
            // Temporary Dsiabled
            // eslint-disable-next-line @typescript-eslint/require-await
            sendInvitationEmail: async ({
                email,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                inviter,
                organization,
                role,
                invitation,
            }) => {
                // TODO: replace with your email service
                console.log(`[org] Invite ${email} to ${organization.name} as ${role}`, invitation);
            },
        }),

        // ── JWT — MUST be before oauthProvider ────────────────────────────────────
        // Required for oauthProvider plugin and recommended for encrypting session cookies if using cookieCache strategy.
        // See docs for details on secure key management in production.
        // https://better-auth.com/docs/plugins/jwt.mdx
        jwt({
            jwt: {
                expirationTime: '15m',
                issuer: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
                audience: 'backend-api',
            },
            jwks: {
                rotationInterval: 60 * 60 * 24 * 30, // rotate every 30 days
                gracePeriod: 60 * 60 * 24 * 30, // keep old key for 30 day grace
            },
        }),

        // ── Bearer token (Authorization: Bearer <token>) ──────────────────────────
        // https://better-auth.com/docs/plugins/bearer.mdx
        bearer(),

        // ── Username ──────────────────────────────────────────────────────────────
        // https://better-auth.com/docs/plugins/username.mdx
        username({
            minUsernameLength: 3,
            maxUsernameLength: 32,
        }),

        // ── Magic Link ────────────────────────────────────────────────────────────
        // https://better-auth.com/docs/plugins/magic-link.mdx
        magicLink({
            // Temporary Dsiabled
            // eslint-disable-next-line @typescript-eslint/require-await
            sendMagicLink: async ({ email, url }) => {
                // TODO: replace with your email service
                console.log(`[magic-link] ${email} → ${url}`);
            },
            expiresIn: 60 * 10, // 10 minutes
            disableSignUp: false,
        }),

        // ── Email OTP ─────────────────────────────────────────────────────────────
        // https://better-auth.com/docs/plugins/email-otp.mdx
        // Note: emailOTP can be used for both sign-in and sign-up flows, as well as 2FA. Configure the sendVerificationOTP callback and rate limits accordingly.
        emailOTP({
            // Temporary Dsiabled
            // eslint-disable-next-line @typescript-eslint/require-await
            sendVerificationOTP: async ({ email, otp, type }) => {
                // type: "sign-in" | "email-verification" | "forget-password"
                console.log(`[email-otp] ${type} OTP for ${email}: ${otp}`);
            },
            expiresIn: 60 * 5, // 5 minutes
            otpLength: 6,
        }),

        // ── Passkey / WebAuthn ────────────────────────────────────────────────────
        // https://better-auth.com/docs/plugins/passkey.mdx
        passkey({
            rpID: process.env.PASSKEY_RP_ID ?? 'localhost',
            rpName: process.env.APP_NAME ?? 'Backend',
            origin: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
        }),

        // ── Admin ─────────────────────────────────────────────────────────────────
        // https://better-auth.com/docs/plugins/admin.mdx
        admin({
            defaultRole: 'user',
            adminUserIds: [],
            defaultBanReason: 'Violated terms of service',
            defaultBanExpiresIn: undefined, // undefined = permanent ban | 60 * 60 * 24, // 1 day
            bannedUserMessage: 'Your account has been suspended. Contact support.',
            impersonationSessionDuration: 60 * 60 * 24, // 1 day
            roles: {
                guestRole,
                userRole,
                authorRole,
                vip_oneRole,
                vip_twoRole,
                moderatorRole,
                adminRole,
                developerRole,
                ownerRole,
            },
        }),

        // ── API Keys ──────────────────────────────────────────────────────────────
        // https://better-auth.com/docs/plugins/api-key.mdx
        apiKey({
            apiKeyHeaders: ['x-hmstd-api-key'],
            defaultKeyLength: 32,
            enableMetadata: true,
            keyExpiration: {
                defaultExpiresIn: 60 * 60 * 24 * 365, // 1 year
            },
            rateLimit: {
                enabled: true,
                timeWindow: 60,
                maxRequests: 1000,
            },
        }),

        // ── Captcha ───────────────────────────────────────────────────────────────
        // https://better-auth.com/docs/plugins/captcha.mdx
        captcha({
            provider: (process.env.CAPTCHA_PROVIDER ?? 'cloudflare-turnstile') as
                | 'cloudflare-turnstile'
                | 'google-recaptcha',
            secretKey: process.env.TURNSTILE_SECRET ?? process.env.RECAPTCHA_SECRET ?? '',
        }),

        // ── Have I Been Pwned (block breached passwords) ──────────────────────────
        // https://better-auth.com/docs/plugins/have-i-been-pwned.mdx
        haveIBeenPwned(),

        // ── i18n ──────────────────────────────────────────────────────────────────
        // Translates built-in better-auth error messages per the user's Accept-Language
        // header (default detection strategy). Add locale keys as needed.
        // English is always the fallback — no need to provide an 'en' entry.
        // https://better-auth.com/docs/plugins/i18n.mdx
        i18n({
            // Detection order: try cookie first, fall back to Accept-Language header
            detection: ['cookie', 'header'],
            localeCookie: 'ba_locale',

            translations: {
                en: {
                    USER_NOT_FOUND: 'User not found',
                    INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
                    INVALID_PASSWORD: 'Invalid password',
                    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
                        'User already exists, please use another email',
                    SESSION_EXPIRED: 'Session expired, please sign in again',
                    EMAIL_NOT_VERIFIED: 'Email not verified',
                    INVALID_TOKEN: 'Invalid or expired token',
                    TOO_MANY_REQUESTS: 'Too many attempts. Please try again later.',
                },
                // ── Example: French ─────────────────────────────────────────────────
                fr: {
                    USER_NOT_FOUND: 'Utilisateur non trouvé',
                    INVALID_EMAIL_OR_PASSWORD: 'Email ou mot de passe invalide',
                    INVALID_PASSWORD: 'Mot de passe invalide',
                    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Cet email est déjà utilisé',
                    SESSION_EXPIRED: 'Session expirée, veuillez vous reconnecter',
                    EMAIL_NOT_VERIFIED: 'Email non vérifié',
                    INVALID_TOKEN: 'Jeton invalide ou expiré',
                    TOO_MANY_REQUESTS: 'Trop de tentatives. Réessayez plus tard.',
                },
                // ── Example: German ──────────────────────────────────────────────────
                de: {
                    USER_NOT_FOUND: 'Benutzer nicht gefunden',
                    INVALID_EMAIL_OR_PASSWORD: 'Ungültige E-Mail oder Passwort',
                    INVALID_PASSWORD: 'Ungültiges Passwort',
                    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Diese E-Mail ist bereits vergeben',
                    SESSION_EXPIRED: 'Sitzung abgelaufen, bitte erneut anmelden',
                    EMAIL_NOT_VERIFIED: 'E-Mail nicht verifiziert',
                    INVALID_TOKEN: 'Ungültiges oder abgelaufenes Token',
                    TOO_MANY_REQUESTS: 'Zu viele Anfragen. Bitte versuche es später.',
                },
                // Add more locales here following the same pattern.
                // Full list of translatable error codes:
                // https://better-auth.com/docs/plugins/i18n
            },
        }),

        // ── Last Login Method ─────────────────────────────────────────────────────
        // https://better-auth.com/docs/plugins/last-login-method.mdx
        lastLoginMethod(),

        // ── Multi-Session ─────────────────────────────────────────────────────────
        // https://better-auth.com/docs/plugins/multi-session.mdx
        multiSession({
            maximumSessions: 5,
        }),

        // ── OpenAPI (Swagger UI at /api/auth/reference) ───────────────────────────
        openAPI(),

        // ── OAuth 2.1 Provider (your app as the auth server) ─────────────────────
        // Handles: OIDC, MCP agent auth, SCM, dynamic client registration.
        // Replaces the old mcp() and oidcProvider() plugins entirely.
        // jwt() MUST appear above this in the plugins array.
        // https://better-auth.com/docs/plugins/oauth-provider.mdx
        oauthProvider({
            loginPage: process.env.OAUTH_LOGIN_PAGE ?? '/sign-in',
            consentPage: process.env.OAUTH_CONSENT_PAGE ?? '/consent',

            // Dynamic client registration — allow third-party clients to self-register.
            // Set allowUnauthenticatedClientRegistration: true for MCP inspector testing.
            allowDynamicClientRegistration: false,
            allowUnauthenticatedClientRegistration: false,
        }),

        // ── Stripe (billing + subscriptions) ─────────────────────────────────────
        // https://better-auth.com/docs/plugins/stripe.mdx
        // stripe({
        //   stripeClient: new Stripe(process.env.STRIPE_SECRET_KEY_TEST ?? ''),
        //   stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET_TEST ?? '',
        //   createCustomerOnSignup: true,
        //   subscription: {
        //     enabled: true,
        //     plans: [
        //       { name: 'basic', priceId: process.env.STRIPE_BASIC_PRICE_ID ?? '' },
        //       { name: 'pro', priceId: process.env.STRIPE_PRO_PRICE_ID ?? '' },
        //       { name: 'org', priceId: process.env.STRIPE_ORG_PRICE_ID ?? '' },
        //     ],
        //   },
        // }),

        // ── Test Utils (test / CI only — never ships to production) ──────────────
        ...(IS_TEST ? [testUtils()] : []),
    ],
});

// ── Exported types ─────────────────────────────────────────────────────────────
export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
export type Organization = typeof auth.$Infer.Organization;
export type Team = typeof auth.$Infer.Team;
export type TeamMember = typeof auth.$Infer.TeamMember;
