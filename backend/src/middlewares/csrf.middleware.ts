import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import createHttpError from 'http-errors';
import status from 'http-status';

export default function csrfMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    const csrfCookie = req.cookies.csrf_token as string;
    const csrfHeader = req.get('X-CSRF-Token') as string;

    if (!csrfCookie || !csrfHeader) {
        return next(
            createHttpError(status.FORBIDDEN, 'CSRF token is required'),
        );
    }

    const cookieBuffer = Buffer.from(csrfCookie);
    const headerBuffer = Buffer.from(csrfHeader);

    if (
        cookieBuffer.length !== headerBuffer.length ||
        !crypto.timingSafeEqual(cookieBuffer, headerBuffer)
    ) {
        return next(createHttpError(status.FORBIDDEN, 'Invalid CSRF token'));
    }

    next();
}
