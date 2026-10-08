import crypto from 'node:crypto';
import env from '../config/env.js';

export function generateOtp(length = 6): string {
    const min = 10 ** (length - 1);
    const max = 10 ** length;

    return crypto.randomInt(min, max).toString();
}

export function hmacHash(value: string): string {
    return crypto
        .createHmac('sha256', env.HMAC_SECRET)
        .update(value)
        .digest('hex');
}

export function verifyHmacHash(value: string, storedHash: string): boolean {
    const valueHash = hmacHash(value);

    const valueBuffer = Buffer.from(valueHash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');

    if (valueBuffer.length !== storedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(valueBuffer, storedBuffer);
}
