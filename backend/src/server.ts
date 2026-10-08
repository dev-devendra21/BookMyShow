import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';
import env from './config/env.js';
import logger from './lib/logger.js';
import RedisClient from './lib/redis.js';
import './worker/email.worker.js';

const startServer = async (): Promise<void> => {
    try {
        await connectDB();
        await RedisClient.connect();

        const server = app.listen(env.PORT, () => {
            logger.info(`Server running on port ${env.PORT}.`);
        });

        const shutdown = (signal: string) => {
            logger.info(`${signal} received. Shutting down...`);

            server.close(async (error) => {
                if (error) {
                    logger.error('Error closing server.', error);
                    process.exit(1);
                }

                try {
                    await mongoose.connection.close();
                    logger.info('Database connection closed.');

                    await RedisClient.disconnect();
                    logger.info('Shutdown completed.');

                    process.exit(0);
                } catch (error) {
                    logger.error('Error closing Database connection.', error);
                    process.exit(1);
                }
            });
        };

        process.on('SIGINT', () => void shutdown('SIGINT'));
        process.on('SIGTERM', () => void shutdown('SIGTERM'));
    } catch (error) {
        logger.error('Server startup failed.', error);

        process.exit(1);
    }
};

void startServer();
