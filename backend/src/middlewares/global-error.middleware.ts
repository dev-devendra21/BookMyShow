import type { Request, Response, NextFunction } from 'express';

import { isHttpError } from 'http-errors';

import status from 'http-status';

import logger from '../lib/logger.js';
import { errorResponse } from '../utils/api-response.js';

import { isDevelopment } from '../config/env.js';

const globalErrorMiddleware = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    /*
     * If response headers have already been sent,
     * let Express handle the error.
     */
    if (res.headersSent) {
        next(err);
        return;
    }

    /*
     * Extract HttpError information.
     */
    const isKnownHttpError = isHttpError(err);

    const statusCode = isKnownHttpError
        ? err.statusCode
        : status.INTERNAL_SERVER_ERROR;

    const errorMessage = isKnownHttpError
        ? err.message
        : 'Internal server error';

    /*
     * Log the complete error internally.
     * Never expose this information in production.
     */
    logger.error({
        message: errorMessage,
        name: isKnownHttpError ? err.name : 'UnknownError',
        statusCode,
        method: req.method,
        url: req.originalUrl,
        stack: err instanceof Error ? err.stack : undefined,
    });

    /*
     * Development:
     * Return useful error information.
     */
    if (isDevelopment) {
        return void res.status(statusCode).json(
            errorResponse(errorMessage, [
                {
                    type: isKnownHttpError ? err.name : 'Error',
                    message: errorMessage,
                    path: '',
                    location: '',
                },
            ]),
        );
    }

    /*
     * Production:
     * Never expose internal 5xx error details.
     */
    const message = statusCode >= 500 ? 'Internal server error' : errorMessage;

    return void res.status(statusCode).json(errorResponse(message));
};

export default globalErrorMiddleware;
