import {
    type ArgumentsHost,
    Catch,
    type ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface BetterAuthError {
    message?: string;
    code?: string;
    status?: number;
}

/**
 * Catches HttpExceptions thrown by AuthResponseHelper (which wraps better-auth errors)
 * and ensures a consistent JSON error envelope is sent to the client.
 *
 * Register globally in main.ts:
 *   app.useGlobalFilters(new BetterAuthExceptionFilter());
 *
 * Or scope to the auth module only:
 *   @UseFilters(BetterAuthExceptionFilter) on a controller class.
 */
@Catch(HttpException)
export class BetterAuthExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(BetterAuthExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message: string;
        let code: string | undefined;

        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const err = exceptionResponse as BetterAuthError;
            message = err.message ?? exception.message;
            code = err.code;
        } else {
            message = exceptionResponse;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `[${req.method}] ${req.url} → ${status}: ${message}`,
                exception.stack,
            );
        }

        res.status(status).json({
            statusCode: status,
            message,
            ...(code ? { code } : {}),
            timestamp: new Date().toISOString(),
            path: req.url,
        });
    }
}
