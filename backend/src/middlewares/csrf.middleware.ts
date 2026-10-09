import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import createHttpError from 'http-errors';
import status from 'http-status';

export default function csrfMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    // Safe methods should not modify application state.
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    // Skip only when the request uses Bearer authentication.
    const authorization = req.get('Authorization');

    if (authorization?.startsWith('Bearer ')) {
        return next();
    }

    const csrfCookie: unknown = req.cookies?.csrf_token;
    const csrfHeader = req.get('X-CSRF-Token');

    if (typeof csrfCookie !== 'string' || typeof csrfHeader !== 'string') {
        return next(
            createHttpError(status.FORBIDDEN, 'CSRF token is required'),
        );
    }

    // UUID tokens have a fixed length.
    if (csrfCookie.length !== 36 || csrfHeader.length !== 36) {
        return next(createHttpError(status.FORBIDDEN, 'Invalid CSRF token'));
    }

    const cookieBuffer = Buffer.from(csrfCookie, 'utf8');
    const headerBuffer = Buffer.from(csrfHeader, 'utf8');

    if (
        cookieBuffer.length !== headerBuffer.length ||
        !crypto.timingSafeEqual(cookieBuffer, headerBuffer)
    ) {
        return next(createHttpError(status.FORBIDDEN, 'Invalid CSRF token'));
    }

    return next();
}
