import { z } from 'zod';
import { USER_ROLE, USER_STATUS } from '../constant/user.js';
import mongoose from 'mongoose';

export const userSchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),

    email: z.string().trim().email('Please fill a valid email').toLowerCase(),

    password: z.string().min(6, 'Password must be at least 6 characters'),

    userRole: z
        .enum([USER_ROLE.CUSTOMER, USER_ROLE.ADMIN, USER_ROLE.CLIENT])
        .default(USER_ROLE.CUSTOMER),

    userStatus: z
        .enum([USER_STATUS.APPROVED, USER_STATUS.PENDING, USER_STATUS.REJECTED])
        .default(USER_STATUS.APPROVED),
});

export const userIdParamsSchema = z.object({
    id: z
        .string('user id is required')
        .refine((id) => mongoose.isValidObjectId(id), 'Invalid user id'),
});

export const updateUserSchema = userSchema.partial();

export type CreateUserDTO = z.infer<typeof userSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UserIdParamsDTO = z.infer<typeof userIdParamsSchema>;
