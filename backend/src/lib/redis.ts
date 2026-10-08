import { Redis } from 'ioredis';

import env from '../config/env.js';
import logger from './logger.js';

class RedisClient {
    private static instance: Redis | null = null;

    private constructor() {}

    public static getInstance(): Redis {
        if (!this.instance) {
            this.instance = new Redis({
                host: env.REDIS_HOST,
                port: env.REDIS_PORT,
                password: env.REDIS_PASSWORD,

                lazyConnect: true,

                maxRetriesPerRequest: null,
                enableReadyCheck: true,

                retryStrategy: (times) => Math.min(times * 100, 3000),
            });

            this.instance.on('error', (error) => {
                logger.error('Redis error', error);
            });
        }

        return this.instance;
    }

    public static async connect(): Promise<void> {
        const redis = this.getInstance();

        if (redis.status === 'ready') {
            return;
        }

        await redis.connect();

        logger.info('Redis connected');
    }

    public static async disconnect(): Promise<void> {
        if (!this.instance) {
            return;
        }

        await this.instance.quit();

        this.instance = null;

        logger.info('Redis disconnected.');
    }
}

export default RedisClient;
