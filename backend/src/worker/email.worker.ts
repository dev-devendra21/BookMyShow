import { Worker } from 'bullmq';

import RedisClient from '../lib/redis.js';
import logger from '../lib/logger.js';
import { createEmailProvider } from '../factories/email.factory.js';
import EmailService from '../services/email.service.js';

const emailProvider = createEmailProvider('nodemailer');
const emailService = new EmailService(emailProvider);

const emailWorker = new Worker(
    'email',

    async (job) => {
        logger.info('Processing email job', {
            jobId: job.id,
            jobName: job.name,
        });

        switch (job.name) {
            case 'welcome-and-verify-email': {
                const { email, name, otp } = job.data;

                await emailService.sendWelcomeAndVerifyEmail(email, name, otp);

                break;
            }

            case 'forgot-password-otp': {
                const { email, otp } = job.data;

                await emailService.sendForgotPasswordOtp(email, otp);

                break;
            }

            default:
                throw new Error(`Unknown email job: ${job.name}`);
        }
    },

    {
        connection: RedisClient.getInstance(),
        concurrency: 5,
    },
);

emailWorker.on('completed', (job) => {
    logger.info('Email job completed', {
        jobId: job.id,
        jobName: job.name,
    });
});

emailWorker.on('failed', (job, error) => {
    logger.error('Email job failed', {
        jobId: job?.id,
        jobName: job?.name,
        error: error.message,
    });
});

emailWorker.on('error', (error) => {
    logger.error('Email worker error', {
        error: error.message,
    });
});

export default emailWorker;
