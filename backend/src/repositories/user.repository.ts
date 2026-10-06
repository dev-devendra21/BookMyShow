import type { Model } from 'mongoose';
import type { IUser } from '../models/user.model.js';
import type {
    CreateUserDTO,
    UpdateUserDTO,
} from '../validators/user.validator.js';

export default class UserRepository {
    constructor(private readonly user: Model<IUser>) {}

    createUser(data: CreateUserDTO) {
        return this.user.create(data);
    }

    findUserByEmailId(emailId: string) {
        return this.user.findOne({
            email: emailId,
        });
    }

    updateUser(userId: string, data: UpdateUserDTO) {
        return this.user.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true,
        });
    }

    getUserById(userId: string) {
        return this.user
            .findById(userId)
            .select('-password')
            .setOptions({ withDeleted: true });
    }
}
