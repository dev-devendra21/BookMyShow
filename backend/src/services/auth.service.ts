import type { Logger } from 'winston';
import type UserService from './user.service.js';
import type { CreateUserDTO } from '../validators/user.validator.js';
import { generateOtp, hmacHash, verifyHmacHash } from '../utils/crypto.js';
import { emailQueue } from '../queues/email.queue.js';
import RedisClient from '../lib/redis.js';

interface OtpData {
    hash: string;
    attempts?: number;
}

export default class AuthService {
    private readonly OTP_EXPIRY_SECONDS = 10 * 60;
    private readonly MAX_OTP_ATTEMPTS = 5;

    constructor(
        private readonly userService: UserService,
        private readonly logger: Logger,
    ) {}

    async signUp(data: CreateUserDTO) {
        const user = await this.userService.createUser(data);

        const otp = generateOtp();

        const otpHash = hmacHash(otp);

        const redis = RedisClient.getInstance();

        const otpKey = `otp:verification:${user.id}`;

        const otpData: OtpData = {
            hash: otpHash,
        };

        await redis.set(
            otpKey,
            JSON.stringify(otpData),
            'EX',
            this.OTP_EXPIRY_SECONDS,
        );

        await emailQueue.add('welcome-and-verify-email', {
            email: user.email,
            name: user.name,
            otp,
        });

        this.logger.info('Verification OTP generated', {
            userId: user.id,
        });

        return user;
    }
}
