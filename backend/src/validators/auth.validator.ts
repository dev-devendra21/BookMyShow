import { z } from 'zod';

export const verifyEmailSchema = z.object({
    email: z
        .string('Email is required')
        .trim()
        .min(1, 'Email is required')
        .email('Please provide a valid email')
        .toLowerCase(),
    otp: z
        .string('OTP is required')
        .trim()
        .regex(/^\d{6}$/, 'OTP must be a 6-digit code'),
});

export const loginSchema = z.object({
    email: z
        .string('Email is required')
        .trim()
        .min(1, 'Email is required')
        .email('Please provide a valid email')
        .toLowerCase(),

    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string('Email is required')
        .trim()
        .min(1, 'Email is required')
        .email('Please provide a valid email')
        .toLowerCase(),
});

export const resetPasswordSchema = z.object({
    email: z
        .string('Email is required')
        .trim()
        .min(1, 'Email is required')
        .email('Please provide a valid email')
        .toLowerCase(),
    otp: z
        .string('OTP is required')
        .trim()
        .regex(/^\d{6}$/, 'OTP must be a 6-digit code'),
    newPassword: z
        .string('New password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string('Current password is required').min(1),
    newPassword: z
        .string('New password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export type VerifyEmailDTO = z.infer<typeof verifyEmailSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;
