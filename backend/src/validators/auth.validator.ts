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

export type VerifyEmailDTO = z.infer<typeof verifyEmailSchema>;
