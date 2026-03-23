# Better Auth Plugin Reference

Quick reference for every plugin wired in `auth.ts` — server imports are
already configured. Use the **Client** column when building your frontend.

| Plugin | Server import | Client import | Separate pkg? |
|---|---|---|---|
| Two-Factor (TOTP) | `better-auth/plugins/two-factor` | `better-auth/client/plugins` → `twoFactorClient` | No |
| Organisation / Teams | `better-auth/plugins/organization` | `better-auth/client/plugins` → `organizationClient` | No |
| JWT | `better-auth/plugins/jwt` | `better-auth/client/plugins` → `jwtClient` | No |
| Bearer | `better-auth/plugins/bearer` | *(no client plugin)* | No |
| Username | `better-auth/plugins/username` | `better-auth/client/plugins` → `usernameClient` | No |
| Magic Link | `better-auth/plugins/magic-link` | `better-auth/client/plugins` → `magicLinkClient` | No |
| Email OTP | `better-auth/plugins/email-otp` | `better-auth/client/plugins` → `emailOtpClient` | No |
| Passkey | `@better-auth/passkey` | `@better-auth/passkey/client` → `passkeyClient` | **Yes** |
| Admin | `better-auth/plugins/admin` | `better-auth/client/plugins` → `adminClient` | No |
| API Key | `better-auth/plugins/api-key` | `better-auth/client/plugins` → `apiKeyClient` | No |
| Captcha | `better-auth/plugins/captcha` | *(no client plugin — send token in request body)* | No |
| Have I Been Pwned | `better-auth/plugins/have-i-been-pwned` | *(no client plugin)* | No |
| i18n | `better-auth/plugins/i18n` | `better-auth/client/plugins` → `i18nClient` | No |
| Last Login Method | `better-auth/plugins/last-login-method` | `better-auth/client/plugins` → `lastLoginMethodClient` | No |
| Multi-Session | `better-auth/plugins/multi-session` | `better-auth/client/plugins` → `multiSessionClient` | No |
| OpenAPI | `better-auth/plugins/open-api` | *(no client plugin — visit `/api/auth/reference`)* | No |
| MCP | `better-auth/plugins/mcp` | *(no client plugin)* | No |
| OAuth Provider (2.1) | `@better-auth/oauth-provider` | `@better-auth/oauth-provider/client` → `oauthProviderClient` | **Yes** |
| Generic OAuth | `better-auth/plugins/generic-oauth` | `better-auth/client/plugins` → `genericOAuthClient` | No |
| Stripe | `@better-auth/stripe` | `@better-auth/stripe/client` → `stripeClient` | **Yes** |
| Test Utils | `better-auth/plugins/test-utils` | *(test env only)* | No |
