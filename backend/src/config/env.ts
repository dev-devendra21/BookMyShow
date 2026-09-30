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
