import type { Logger } from 'winston';
import type UserRepository from '../repositories/user.repository.js';
import type {
    CreateUserDTO,
    UpdateUserDTO,
    UserIdParamsDTO,
} from '../validators/user.validator.js';
import createHttpError from 'http-errors';
import { USER_ROLE, USER_STATUS } from '../constant/user.js';

export default class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly logger: Logger,
    ) {}

    async createUser(data: CreateUserDTO) {
        const { email } = data;
        const existingUser = await this.userRepository.findUserByEmailId(email);

        if (existingUser && existingUser.deletedAt === null) {
            this.logger.warn(
                'Registration failed: email address already registered',
            );

            throw createHttpError.Conflict(
                'An account with this email address is already registered.',
            );
        }

        if (existingUser && existingUser.deletedAt !== null) {
            existingUser.deletedAt = null;
            await existingUser.save();

            return existingUser;
        }

        const userStatus =
            data.userRole === (USER_ROLE.CLIENT || USER_ROLE.ADMIN)
                ? USER_STATUS.PENDING
                : USER_STATUS.APPROVED;

        return this.userRepository.createUser({ ...data, userStatus });
    }

    async updateUser(user: UserIdParamsDTO, data: UpdateUserDTO) {
        const existingUser = await this.userRepository.getUserById(user.id);

        if (!existingUser) {
            this.logger.warn('User account not found');

            throw createHttpError.NotFound(
                "We couldn't find an account associated with this email address.",
            );
        }

        const updatedUser = await this.userRepository.updateUser(
            existingUser._id.toString(),
            data,
        );

        return updatedUser;
    }

    async getUserById(params: UserIdParamsDTO) {
        const { id } = params;
        const user = await this.userRepository.getUserById(id);

        if (!user) {
            this.logger.warn('User account not found');

            throw createHttpError.NotFound(
                "We couldn't find an account associated with this email address.",
            );
        }

        return user;
    }

    async getCurrentUser(userId: string) {
        const user = await this.userRepository.getCurrentUserById(userId);

        if (!user) {
            throw createHttpError.NotFound('Current user account was not found.');
        }

        return user;
    }

    async deleteUserById(params: UserIdParamsDTO) {
        const { id } = params;
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            this.logger.warn('User account not found');

            throw createHttpError.NotFound(
                "We couldn't find an account associated with this email address.",
            );
        }

        if (user.deletedAt !== null) {
            this.logger.warn('User account has already been deleted');

            throw createHttpError.Conflict(
                'This user account has already been deleted.',
            );
        }

        await user.softDelete();
        return user;
    }
}
