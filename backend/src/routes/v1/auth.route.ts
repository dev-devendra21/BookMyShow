import { Router } from 'express';
import authModule from '../../modules/auth.module.js';
import asyncHandler from '../../utils/async-handler.js';
import { validateBodySchema } from '../../middlewares/validation.middleware.js';
import { verifyEmailSchema } from '../../validators/auth.validator.js';

const route = Router();

const authController = authModule();

route.post('/signUp', asyncHandler(authController.signUp.bind(authController)));

route.post(
    '/verify-email',
    validateBodySchema(verifyEmailSchema),
    asyncHandler(authController.verifyEmail.bind(authController)),
);

export default route;
