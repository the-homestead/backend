export interface AppConfigInterface {
    name: string;
    version: string;
    description: string;
    port: number;
    host: string;
    globalPrefix: string;
    apiPrefix: string;
}

export interface AuthConfigInterface {
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    // cookie: {
}

// export interface ConfigInterface {

// }
