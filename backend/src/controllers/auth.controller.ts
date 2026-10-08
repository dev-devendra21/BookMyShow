import type { Request, Response } from 'express';
import type { CreateUserRequest } from '../types/user.type.js';
import status from 'http-status';
import { successResponse } from '../utils/api-response.js';
import type { UserIdParamsDTO } from '../validators/user.validator.js';
import type AuthService from '../services/auth.service.js';
import type { VerifyEmailRequest } from '../types/auth.type.js';

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
}
