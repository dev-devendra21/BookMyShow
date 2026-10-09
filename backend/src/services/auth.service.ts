import type { Logger } from 'winston';
import type UserService from './user.service.js';
import type { CreateUserDTO } from '../validators/user.validator.js';
import { generateOtp, hmacHash, verifyHmacHash } from '../utils/crypto.js';
import { emailQueue } from '../queues/email.queue.js';
import { type Redis } from 'ioredis';
import type {
    ForgotPasswordDTO,
    LoginDTO,
    ResetPasswordDTO,
    VerifyEmailDTO,
} from '../validators/auth.validator.js';
import createHttpError from 'http-errors';
import type UserRepository from '../repositories/user.repository.js';
import {
    generateAccessToken,
    generateCsrfToken,
    generateRefreshToken,
    verifyRefreshToken,
} from '../utils/jwt.js';
import { REFRESH_TOKEN_EXPIRES } from '../constant/auth.js';
import type { Request } from 'express';
import { USER_STATUS } from '../constant/user.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

interface OtpData {
    hash: string;
    attempts?: number;
}

export default class AuthService {
    private readonly OTP_EXPIRY_SECONDS = 10 * 60;
    private readonly PASSWORD_RESET_OTP_EXPIRY_SECONDS = 15 * 60;
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

    async forgotPassword(data: ForgotPasswordDTO) {
        const user = await this.userRepository.findUserByEmailId(data.email);

        if (user && user.deletedAt == null) {
            const otp = generateOtp();
            const otpKey = `otp:password-reset:${user.email}`;

            await this.redis.set(
                otpKey,
                JSON.stringify({ hash: hmacHash(otp), attempts: 0 } satisfies OtpData),
                'EX',
                this.PASSWORD_RESET_OTP_EXPIRY_SECONDS,
            );

            await emailQueue.add('forgot-password-otp', {
                email: user.email,
                otp,
            });

            this.logger.info('Password reset OTP generated', {
                userId: user.id,
            });
        }

        return;
    }

    async resetPassword(data: ResetPasswordDTO) {
        const otpKey = `otp:password-reset:${data.email}`;
        const storedOtp = await this.redis.get(otpKey);

        if (!storedOtp) {
            throw createHttpError.BadRequest('OTP has expired or is invalid');
        }

        const otpData = JSON.parse(storedOtp) as OtpData;
        const attempts = otpData.attempts ?? 0;

        if (attempts >= this.MAX_OTP_ATTEMPTS) {
            throw createHttpError.TooManyRequests(
                'Too many password reset attempts. Please request a new code.',
            );
        }

        if (!verifyHmacHash(data.otp, otpData.hash)) {
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
                    'Too many password reset attempts. Please request a new code.',
                );
            }

            throw createHttpError.BadRequest('OTP has expired or is invalid');
        }

        const user = await this.userRepository.findUserByEmailId(data.email);
        if (!user) {
            await this.redis.del(otpKey);
            throw createHttpError.BadRequest('OTP has expired or is invalid');
        }

        user.password = data.newPassword;
        await user.save();
        await this.redis.del(otpKey);
    }

    async login(data: LoginDTO) {
        const existingUser = await this.userRepository.findUserByEmailId(
            data.email,
        );

        if (!existingUser) {
            this.logger.warn('User account not found');

            throw createHttpError.NotFound(
                "We couldn't find an account associated with this email address.",
            );
        }

        const isValidPassword = await existingUser.comparePassword(
            data.password,
        );

        if (!isValidPassword) {
            this.logger.warn('Invalid password', {
                user_id: existingUser._id,
            });

            throw createHttpError.BadRequest('Invalid Email or Password');
        }

        const accessToken = generateAccessToken(
            existingUser._id.toString(),
            existingUser.userRole,
        );

        const csrfToken = generateCsrfToken();

        const { token: refreshToken, jti } = generateRefreshToken(
            existingUser._id.toString(),
        );

        const refreshTokenHash = hmacHash(refreshToken);

        const authKey = `auth:session:${jti}`;

        const authData = {
            userId: existingUser._id.toString(),
            tokenHash: refreshTokenHash,
        };

        await this.redis.set(
            authKey,
            JSON.stringify(authData),
            'EX',
            REFRESH_TOKEN_EXPIRES,
        );

        return {
            accessToken,
            refreshToken,
            csrfToken,
        };
    }

    async refresh(req: Request) {
        const refreshToken =
            req.cookies?.refresh_token ?? req.get('X-Refresh-Token');

        if (!refreshToken) {
            throw createHttpError.Unauthorized('Refresh token is required');
        }

        const { sub, jti, tokenType } = verifyRefreshToken(refreshToken);

        if (tokenType !== 'refresh' || !sub || !jti) {
            throw createHttpError.Unauthorized('Invalid refresh token');
        }

        const authKey = `auth:session:${jti}`;

        const sessionData = await this.redis.get(authKey);

        if (!sessionData) {
            throw createHttpError.Unauthorized(
                'Refresh token has expired, please login again',
            );
        }

        const { tokenHash } = JSON.parse(sessionData) as {
            userId: string;
            tokenHash: string;
        };

        const isValidRefreshToken = verifyHmacHash(refreshToken, tokenHash);

        if (!isValidRefreshToken) {
            throw createHttpError.Unauthorized('Invalid refresh token');
        }

        const user = await this.userRepository.getUserById(sub);

        if (!user || user.deletedAt !== null) {
            throw createHttpError.Unauthorized('User account no longer exists');
        }

        if (user.userStatus !== USER_STATUS.APPROVED) {
            throw createHttpError.Unauthorized('User account is not active');
        }

        const accessToken = generateAccessToken(
            user._id.toString(),
            user.userRole,
        );

        // Rotate refresh token.
        const { token: newRefreshToken, jti: newJti } = generateRefreshToken(
            user._id.toString(),
        );

        const newRefreshTokenHash = hmacHash(newRefreshToken);

        const newAuthKey = `auth:session:${newJti}`;

        const authData = {
            userId: user._id.toString(),
            tokenHash: newRefreshTokenHash,
        };

        await this.redis.del(authKey);

        await this.redis.set(
            newAuthKey,
            JSON.stringify(authData),
            'EX',
            REFRESH_TOKEN_EXPIRES,
        );

        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }

    async logout(req: AuthenticatedRequest) {
        const refreshToken =
            req.cookies?.refresh_token ??
            req.get('X-Refresh-Token') ??
            req.body?.refreshToken;

        if (!refreshToken) return;

        const { sub, jti, tokenType } = verifyRefreshToken(refreshToken);

        if (
            tokenType !== 'refresh' ||
            !sub ||
            !jti ||
            sub !== req.user?.userId
        ) {
            throw createHttpError.Unauthorized('Invalid refresh token');
        }

        await this.redis.del(`auth:session:${jti}`);
    }
}
