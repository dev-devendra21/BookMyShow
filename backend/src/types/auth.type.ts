import type { Request } from 'express';
import type { VerifyEmailDTO } from '../validators/auth.validator.js';

export interface VerifyEmailRequest extends Request {
    body: VerifyEmailDTO;
}
