import crypto from 'node:crypto';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import env from '../config/env.js';
import type { UserRole } from '../models/user.model.js';

interface AccessTokenPayload {
    sub: string;
    role: UserRole;
    tokenType: 'access';
}

interface RefreshTokenPayload {
    sub: string;
    jti: string;
    tokenType: 'refresh';
}

export function generateAccessToken(userId: string, role: UserRole): string {
    return jwt.sign(
        {
            sub: userId,
            role,
            tokenType: 'access',
        },
        env.JWT_ACCESS_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: '15m',
        },
    );
}

export function generateRefreshToken(userId: string): {
    token: string;
    jti: string;
} {
    const jti = crypto.randomUUID();

    const token = jwt.sign(
        {
            sub: userId,
            jti,
            tokenType: 'refresh',
        },
        env.JWT_REFRESH_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: '7d',
        },
    );

    return {
        token,
        jti,
    };
}

export function verifyAccessToken(
    token: string,
): JwtPayload & AccessTokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, {
        algorithms: ['HS256'],
    }) as JwtPayload & AccessTokenPayload;
}

export function verifyRefreshToken(
    token: string,
): JwtPayload & RefreshTokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, {
        algorithms: ['HS256'],
    }) as JwtPayload & RefreshTokenPayload;
}

export function generateCsrfToken(): string {
    return crypto.randomUUID();
}
