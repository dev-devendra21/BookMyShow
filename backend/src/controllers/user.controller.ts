import type { Request, Response } from 'express';
import type UserService from '../services/user.service.js';
import type {
    CreateUserRequest,
    UpdateUserRequest,
} from '../types/user.type.js';
import status from 'http-status';
import { successResponse } from '../utils/api-response.js';
import type { UserIdParamsDTO } from '../validators/user.validator.js';
import type { AuthenticatedRequest } from '../middlewares/auth.middleware.js';

export default class UserController {
    constructor(private readonly userService: UserService) {}

    async createUser(req: CreateUserRequest, res: Response) {
        const user = await this.userService.createUser(req.body);

        res.status(status.CREATED).json(
            successResponse('Your account has been created successfully.', {
                id: user._id,
            }),
        );
    }

    async updateUser(req: UpdateUserRequest, res: Response) {
        const user = await this.userService.updateUser(
            req.params as UserIdParamsDTO,
            req.body,
        );

        res.status(status.OK).json(
            successResponse('Your account has been update successfully', {
                user,
            }),
        );
    }

    async getUserById(req: Request, res: Response) {
        const user = await this.userService.getUserById(
            req.params as UserIdParamsDTO,
        );

        res.status(status.OK).json(
            successResponse('fetch the user info successfully', {
                user,
            }),
        );
    }

    async getCurrentUser(req: AuthenticatedRequest, res: Response) {
        const user = await this.userService.getCurrentUser(req.user!.userId);

        return res.status(status.OK).json(
            successResponse('Fetched current user successfully.', { user }),
        );
    }

    async deleteUserById(req: Request, res: Response) {
        const user = await this.userService.deleteUserById(
            req.params as UserIdParamsDTO,
        );

        res.status(status.OK).json(
            successResponse('user account deleted successfully', {
                id: user.id,
            }),
        );
    }
}
