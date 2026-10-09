import type { Request } from 'express';
import type {
    ForgotPasswordDTO,
    ResetPasswordDTO,
    VerifyEmailDTO,
} from '../validators/auth.validator.js';

import type { LoginDTO } from '../validators/auth.validator.js';

export interface VerifyEmailRequest extends Request {
    body: VerifyEmailDTO;
}

export interface LoginRequest extends Request {
    body: LoginDTO;
}

export interface ForgotPasswordRequest extends Request {
    body: ForgotPasswordDTO;
}

export interface ResetPasswordRequest extends Request {
    body: ResetPasswordDTO;
}
