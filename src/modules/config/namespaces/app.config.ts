import { registerAs } from '@nestjs/config';

export interface AppConfig {
    env: 'development' | 'production' | 'test';
    companyName: string;
    host: string;
    port: number;
    timezone: string;
    lang: string;
    currency: string;
    country: string;
    registrationEnabled: boolean;
    ports: {
        backend: number;
        webIam: number;
        webAdmin: number;
        webFoundry: number;
        webHome: number;
    };
}

export const appConfig = registerAs(
    'app',
    (): AppConfig => ({
        env: (process.env.NODE_ENV as AppConfig['env']) ?? 'development',
        companyName: process.env.COMPANY_NAME!,
        host: process.env.HOST!,
        port: parseInt(process.env.PORT_BACKEND!, 10),
        timezone: process.env.TZ ?? 'UTC',
        lang: process.env.LANG ?? 'en-US',
        currency: process.env.CURRENCY ?? 'USD',
        country: process.env.COUNTRY ?? 'US',
        registrationEnabled: process.env.REGISTRATION_ENABLED === 'true',
        ports: {
            backend: parseInt(process.env.PORT_BACKEND!, 10),
            webIam: parseInt(process.env.PORT_WEB_IAM!, 10),
            webAdmin: parseInt(process.env.PORT_WEB_ADMIN!, 10),
            webFoundry: parseInt(process.env.PORT_WEB_FOUNDRY!, 10),
            webHome: parseInt(process.env.PORT_WEB_HOME!, 10),
        },
    }),
);
