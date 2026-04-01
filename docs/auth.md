# Auth Module Documentation

> **Status:** 🚧 In Progress — This documentation is being updated for clarity, completeness, and consistency. Please report any gaps or errors.

---

## Overview

The **Auth module** provides authentication, authorization, and user management for the Homestead backend. It is built on [Better Auth](https://better-auth.com/docs/introduction) and supports a wide range of authentication flows, including:

- Username/password login
- Email OTP and magic link
- Passkey (WebAuthn/FIDO2)
- Two-factor authentication (2FA)
- Organization/team membership
- API keys
- OAuth (social login)
- Multi-session management

All routes are protected by default. Use `@AllowAnonymous()` or `@OptionalAuth()` to override per route/controller. Role-based access is enforced via `@Roles()` and `@OrgRoles()` decorators.

---

## Directory Structure

- **auth.main.ts** — Main integration point for Better Auth, plugin setup, and configuration
- **auth.module.ts** — NestJS module definition and provider wiring
- **controllers/** — Route handlers for all auth-related endpoints
- **dto/** — Data transfer objects (DTOs) for request/response validation
- **filters/** — Exception filters for error handling
- **helpers/** — Utility functions for response formatting and request adaptation
- **services/** — Business logic for each auth feature (admin, users, orgs, etc.)
- **access/** — Access control logic for system/org roles

---

## Key Concepts

### Authentication Flows

- **Username/Password:** Standard login with optional 2FA.
- **Email OTP:** One-time password sent to email for passwordless login.
- **Magic Link:** Single-use link sent to email for instant login.
- **Passkey:** WebAuthn/FIDO2 for passwordless, phishing-resistant login.
- **API Keys:** Programmatic access for users and services.
- **OAuth:** Social login via providers (Google, GitHub, etc.).

### Authorization

- **System Roles:** Global roles (admin, user, etc.) enforced via `@Roles()`.
- **Org Roles:** Organization-scoped roles (owner, member, etc.) via `@OrgRoles()`.
- **Access Decorators:**
  - `@AllowAnonymous()` — Allow unauthenticated access
  - `@OptionalAuth()` — Attach user if present, but do not require
  - `@Roles()` — Require specific system role(s)
  - `@OrgRoles()` — Require org-scoped role(s)

### Session Management

- **Multi-session:** Users can have multiple active sessions (devices/browsers).
- **Session Revocation:** End individual or all sessions.
- **Impersonation:** Admins can impersonate users for support/debugging.

---

## Usage Examples

### Register a New User

```typescript
// POST /auth/register
await authService.register({
  username: 'alice',
  email: 'alice@example.com',
  password: 'securePassword123',
});
```

### Login with Username/Password

```typescript
// POST /auth/login
const session = await authService.login({
  username: 'alice',
  password: 'securePassword123',
});
```

### Send Email OTP

```typescript
// POST /auth/email-otp/send
await emailOtpService.sendOtp({
  email: 'alice@example.com',
});
```

### Use Magic Link

```typescript
// POST /auth/magic-link/send
await magicLinkService.sendLink({
  email: 'alice@example.com',
});
```

---

## DTOs & Schemas

All request/response DTOs are defined in `dto/` and validated with [Zod](https://zod.dev/). See the `dto/` directory for details on each flow.

---

## Exception Handling

All errors are mapped to appropriate NestJS HTTP exceptions using custom filters (see `filters/`).

---

## Extending Auth

- Add new flows by creating a service in `services/` and a controller in `controllers/`.
- Register new providers in `auth.module.ts`.
- Use Zod schemas for all input validation.
- Document new endpoints with Swagger decorators.

---

## References

- [Better Auth Documentation](https://better-auth.com/docs/introduction)
- [NestJS Docs](https://docs.nestjs.com/)
- [Zod Docs](https://zod.dev/)

---

## See Also

- [src/modules/auth/README.md](README.md) — In-depth usage and advanced patterns
- [src/modules/auth/PLUGINS.md](PLUGINS.md) — Plugin configuration and extension
- [src/modules/auth/auth.main.ts](auth.main.ts) — Better Auth integration

---

*Last updated: 2026-03-28*
