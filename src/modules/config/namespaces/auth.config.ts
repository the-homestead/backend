import { registerAs } from '@nestjs/config';

export interface OAuthProviderConfig {
    id: string;
    secret: string;
}

export interface AuthConfig {
    url: string;
    apiKey: string;
    secret: string;
    /** Parsed from comma-separated BETTER_AUTH_TRUSTED_ORIGINS */
    trustedOrigins: string[];
    cookieDomain?: string;
    providers: {
        steam?: Pick<OAuthProviderConfig, 'secret'>;
        google?: OAuthProviderConfig;
        discord?: OAuthProviderConfig;
        github?: OAuthProviderConfig;
        twitch?: OAuthProviderConfig;
    };
}

/** Returns an OAuthProviderConfig only if both id and secret are present. */
function oauthProvider(
    id: string | undefined,
    secret: string | undefined,
): OAuthProviderConfig | undefined {
    if (id && secret) return { id, secret };
    return undefined;
}

export const authConfig = registerAs(
    'auth',
    (): AuthConfig => ({
        url: process.env.BETTER_AUTH_URL!,
        apiKey: process.env.BETTER_AUTH_API_KEY!,
        secret: process.env.BETTER_AUTH_SECRET!,
        trustedOrigins: (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? '')
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean),
        cookieDomain: process.env.BETTER_AUTH_COOKIE_DOMAIN,
        providers: {
            steam: process.env.AUTH_STEAM_SECRET
                ? { secret: process.env.AUTH_STEAM_SECRET }
                : undefined,
            google: oauthProvider(process.env.AUTH_GOOGLE_ID, process.env.AUTH_GOOGLE_SECRET),
            discord: oauthProvider(process.env.AUTH_DISCORD_ID, process.env.AUTH_DISCORD_SECRET),
            github: oauthProvider(process.env.AUTH_GITHUB_ID, process.env.AUTH_GITHUB_SECRET),
            twitch: oauthProvider(process.env.AUTH_TWITCH_ID, process.env.AUTH_TWITCH_SECRET),
        },
    }),
);
