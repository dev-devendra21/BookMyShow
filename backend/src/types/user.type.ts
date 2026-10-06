import type {
    CreateUserDTO,
    UpdateUserDTO,
} from '../validators/user.validator.js';
import type { Request } from 'express';

export interface CreateUserRequest extends Request {
    body: CreateUserDTO;
}

export interface UpdateUserRequest extends Request {
    body: UpdateUserDTO;
}
