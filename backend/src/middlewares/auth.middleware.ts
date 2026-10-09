import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

import { verifyAccessToken } from '../utils/jwt.js';
import type { UserRole } from '../models/user.model.js';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: UserRole;
    };
}

function getAccessToken(req: Request): string | undefined {
    const authorization = req.get('Authorization');

    // Mobile clients send the access token as a Bearer token. Browser clients
    // use the httpOnly access_token cookie.
    if (authorization && /^Bearer\s/i.test(authorization)) {
        const token = authorization.slice(7).trim();
        return token || undefined;
    }

    return req.cookies?.access_token;
}

export function authMiddleware(
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
) {
    const accessToken = getAccessToken(req);

    if (!accessToken) {
        throw createHttpError.Unauthorized('Authentication required');
    }

    const payload = verifyAccessToken(accessToken);

    if (
        payload.tokenType !== 'access' ||
        typeof payload.sub !== 'string' ||
        !payload.sub ||
        !['ADMIN', 'CUSTOMER', 'CLIENT'].includes(payload.role)
    ) {
        throw createHttpError.Unauthorized('Invalid access token');
    }

    req.user = {
        userId: payload.sub,
        role: payload.role,
    };

    next();
}
