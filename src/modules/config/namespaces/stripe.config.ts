import { registerAs } from '@nestjs/config';

export interface StripeKeySet {
    publicKey: string;
    secretKey: string;
    webhookSecret?: string;
}

export interface StripeConfig {
    /** Which key set is active based on NODE_ENV */
    mode: 'live' | 'test';
    live?: StripeKeySet;
    test?: StripeKeySet;
    /** Convenience accessor — resolves to `live` in production, `test` otherwise */
    active?: StripeKeySet;
}

export const stripeConfig = registerAs('stripe', (): StripeConfig => {
    const isProduction = process.env.NODE_ENV === 'production';

    const live =
        process.env.PUBLIC_STRIPE_KEY_LIVE && process.env.STRIPE_SECRET_KEY_LIVE
            ? {
                  publicKey: process.env.PUBLIC_STRIPE_KEY_LIVE,
                  secretKey: process.env.STRIPE_SECRET_KEY_LIVE,
              }
            : undefined;

    const test =
        process.env.PUBLIC_STRIPE_KEY_TEST && process.env.STRIPE_SECRET_KEY_TEST
            ? {
                  publicKey: process.env.PUBLIC_STRIPE_KEY_TEST,
                  secretKey: process.env.STRIPE_SECRET_KEY_TEST,
                  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET_TEST,
              }
            : undefined;

    return {
        mode: isProduction ? 'live' : 'test',
        live,
        test,
        active: isProduction ? live : test,
    };
});
