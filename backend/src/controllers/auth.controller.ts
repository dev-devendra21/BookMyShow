import type { Request, Response } from 'express';
import type { CreateUserRequest } from '../types/user.type.js';
import status from 'http-status';
import { successResponse } from '../utils/api-response.js';
import type AuthService from '../services/auth.service.js';
import type {
    ForgotPasswordRequest,
    ChangePasswordRequest,
    LoginRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
} from '../types/auth.type.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';
import {
    ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES,
} from '../constant/auth.js';

export default class AuthController {
    constructor(private readonly authService: AuthService) {}

    async signUp(req: CreateUserRequest, res: Response) {
        const user = await this.authService.signUp(req.body);

        res.status(status.CREATED).json(
            successResponse('Your account has been created successfully.', {
                id: user._id,
            }),
        );
    }

    async verifyEmail(req: VerifyEmailRequest, res: Response) {
        const user = await this.authService.verifyEmail(req.body);

        res.status(status.OK).json(
            successResponse('your email is verified successfully.', {
                id: user._id,
            }),
        );
    }

    async forgotPassword(req: ForgotPasswordRequest, res: Response) {
        await this.authService.forgotPassword(req.body);

        return res.status(status.OK).json(
            successResponse(
                'If an account exists for this email, a password reset code has been sent.',
            ),
        );
    }

    async resetPassword(req: ResetPasswordRequest, res: Response) {
        await this.authService.resetPassword(req.body);

        return res
            .status(status.OK)
            .json(successResponse('Your password has been reset successfully.'));
    }

    async changePassword(req: ChangePasswordRequest, res: Response) {
        await this.authService.changePassword(req.user!.userId, req.body);

        return res
            .status(status.OK)
            .json(successResponse('Your password has been changed successfully.'));
    }

    async login(req: LoginRequest, res: Response) {
        const { accessToken, refreshToken, csrfToken } =
            await this.authService.login(req.body);

        const clientType = req.get('X-Client-Type');

        if (clientType === 'mobile') {
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    accessToken,
                    refreshToken,
                },
            });
        }

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: ACCESS_TOKEN_EXPIRES * 1000,
            path: '/',
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_EXPIRES * 1000,
            path: '/api/v1/auth/refresh',
        });

        res.cookie('csrf_token', csrfToken, {
            httpOnly: false,
            secure: true,
            sameSite: 'lax',
            path: '/',
        });

        res.status(status.OK).json(successResponse('login successfully'));
    }

    async refresh(req: Request, res: Response) {
        const { accessToken, refreshToken } =
            await this.authService.refresh(req);

        const clientType = req.get('X-Client-Type');

        if (clientType === 'mobile') {
            return res.status(status.OK).json(
                successResponse('Token rotation successfully completed.', {
                    accessToken,
                    refreshToken,
                }),
            );
        }

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: ACCESS_TOKEN_EXPIRES * 1000,
            path: '/',
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: REFRESH_TOKEN_EXPIRES * 1000,
            path: '/api/v1/auth/refresh',
        });

        return res
            .status(status.OK)
            .json(successResponse('Token rotation successfully completed.'));
    }

    async logout(req: AuthenticatedRequest, res: Response) {
        await this.authService.logout(req);

        if (req.get('X-Client-Type') !== 'mobile') {
            const cookieOptions = {
                secure: true,
                sameSite: 'lax' as const,
            };

            res.clearCookie('access_token', {
                ...cookieOptions,
                path: '/',
            });
            res.clearCookie('refresh_token', {
                ...cookieOptions,
                path: '/api/v1/auth/refresh',
            });
            res.clearCookie('csrf_token', {
                ...cookieOptions,
                path: '/',
            });
        }

        return res.status(status.OK).json(successResponse('Logout successful'));
    }
}
