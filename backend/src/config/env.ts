import { config } from 'dotenv';
import { z } from 'zod';
config();

const envSchema = z.object({
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

    PORT: z.coerce.number({
        error: 'PORT is required and must be a valid number',
    }),

    LOG_LEVEL: z.string({
        error: 'LOG_LEVEL is required',
    }),

    FRONTEND_URL: z.string({
        error: 'FRONTEND_URL is required',
    }),

    NODE_ENV: z.enum(['development', 'production', 'test'], {
        error: 'NODE_ENV is required and must be development, production, or test',
    }),

    SMTP_HOST: z.string().min(1, 'SMTP_HOST is required'),

    SMTP_PORT: z.coerce.number({
        error: 'SMTP_PORT is required and must be a valid number',
    }),

    SMTP_SECURE: z
        .enum(['true', 'false'], {
            error: 'SMTP_SECURE must be true or false',
        })
        .transform((value) => value === 'true'),

    SMTP_USER: z.string().min(1, 'SMTP_USER is required'),

    SMTP_PASSWORD: z.string().min(1, 'SMTP_PASSWORD is required'),

    EMAIL_FROM: z.string().min(1, 'EMAIL_FROM is required'),

    REDIS_HOST: z.string().min(1, {
        message: 'REDIS_HOST is required',
    }),

    REDIS_PORT: z.coerce.number().int().positive({
        message: 'REDIS_PORT must be a positive integer',
    }),

    REDIS_PASSWORD: z.string().min(1, {
        message: 'REDIS_PASSWORD is required',
    }),

    HMAC_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_ACCESS_SECRET: z.string(),
});

const _env = z.safeParse(envSchema, process.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:');

    _env.error.issues.forEach((err) => {
        console.error(`  - [${err.path.join('.')}]: ${err.message}`);
    });

    process.exit(1);
}

const env = _env.data;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

export default env;
