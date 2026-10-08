import type { Logger } from 'winston';
import type UserService from './user.service.js';
import type { CreateUserDTO } from '../validators/user.validator.js';
import { generateOtp, hmacHash, verifyHmacHash } from '../utils/crypto.js';
import { emailQueue } from '../queues/email.queue.js';
import { type Redis } from 'ioredis';
import type { VerifyEmailDTO } from '../validators/auth.validator.js';
import createHttpError from 'http-errors';
import type UserRepository from '../repositories/user.repository.js';

interface OtpData {
    hash: string;
    attempts?: number;
}

export default class AuthService {
    private readonly OTP_EXPIRY_SECONDS = 10 * 60;
    private readonly MAX_OTP_ATTEMPTS = 5;

    constructor(
        private readonly userService: UserService,
        private readonly userRepository: UserRepository,
        private readonly redis: Redis,
        private readonly logger: Logger,
    ) {}

    async signUp(data: CreateUserDTO) {
        const user = await this.userService.createUser(data);

        const otp = generateOtp();

        const otpHash = hmacHash(otp);

        const otpKey = `otp:verification:${user.email}`;

        const otpData: OtpData = {
            hash: otpHash,
            attempts: 0,
        };

        await this.redis.set(
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

    async verifyEmail(data: VerifyEmailDTO) {
        const otpKey = `otp:verification:${data.email}`;
        const storedOtp = await this.redis.get(otpKey);
        if (!storedOtp) {
            throw createHttpError.BadRequest('OTP has expired or is invalid');
        }
        const otpData = JSON.parse(storedOtp) as OtpData;
        const attempts = otpData.attempts ?? 0;
        if (attempts >= this.MAX_OTP_ATTEMPTS) {
            throw createHttpError.TooManyRequests(
                'Too many OTP verification attempts. Please request a new OTP.',
            );
        }
        const isValidOtp = verifyHmacHash(data.otp, otpData.hash);
        if (!isValidOtp) {
            otpData.attempts = attempts + 1;
            const remainingTtl = await this.redis.ttl(otpKey);
            if (remainingTtl > 0) {
                await this.redis.set(
                    otpKey,
                    JSON.stringify(otpData),
                    'EX',
                    remainingTtl,
                );
            }
            if (otpData.attempts >= this.MAX_OTP_ATTEMPTS) {
                throw createHttpError.TooManyRequests(
                    'Too many OTP verification attempts. Please request a new OTP.',
                );
            }
            throw createHttpError.BadRequest('OTP has expired or is invalid');
        }
        const user = await this.userRepository.findUserByEmailId(data.email);
        if (!user) {
            throw createHttpError.InternalServerError('Something went wrong');
        }
        user.isVerifiedEmail = true;
        await user.save();

        await this.redis.del(otpKey);
        return user;
    }
}
