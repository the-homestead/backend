import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerErrorInterceptor, NativeLogger } from 'nestjs-pino';
import { AppModule } from './app/app.module';
import { AppDataSource } from './modules/database/data-source';
import { BetterAuthExceptionFilter } from './modules/auth/filters/better-auth-exception.filter';

async function bootstrap() {
    // Initialize the shared DataSource before NestJS bootstraps so that
    // better-auth's TypeORM adapter has a live connection from the first request.
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const app = await NestFactory.create(AppModule, {
        bufferLogs: true, // Buffer logs until the logger is fully initialized
        bodyParser: false, // Disable built-in body parser to allow better-auth to handle raw request bodies for signature verification
    });

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    app.enableCors();
    // Starts listening for shutdown hooks
    app.enableShutdownHooks();

    const swagConfig = new DocumentBuilder()
        .setTitle('Homestead API')
        .setDescription('API documentation for the Homestead backend')
        .setVersion('1.0')
        // .addBearerAuth() // Add JWT bearer auth to Swagger
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, swagConfig);

    SwaggerModule.setup('swagger-main', app, document, {
        useGlobalPrefix: true,
    });

    app.useGlobalInterceptors(new LoggerErrorInterceptor());
    app.useGlobalFilters(new BetterAuthExceptionFilter());
    app.useLogger(app.get(NativeLogger));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
    console.error('Error during application bootstrap:', err);
    process.exit(1);
});
