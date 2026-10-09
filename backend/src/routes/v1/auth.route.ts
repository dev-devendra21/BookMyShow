import { Router } from 'express';
import authModule from '../../modules/auth.module.js';
import asyncHandler from '../../utils/async-handler.js';
import { validateBodySchema } from '../../middlewares/validation.middleware.js';
import {
    forgotPasswordSchema,
    loginSchema,
    resetPasswordSchema,
    verifyEmailSchema,
} from '../../validators/auth.validator.js';
import csrfMiddleware from '../../middlewares/csrf.middleware.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const route = Router();

const authController = authModule();

route.post('/signUp', asyncHandler(authController.signUp.bind(authController)));

route.post(
    '/verify-email',
    validateBodySchema(verifyEmailSchema),
    asyncHandler(authController.verifyEmail.bind(authController)),
);

route.post(
    '/login',
    validateBodySchema(loginSchema),
    asyncHandler(authController.login.bind(authController)),
);

route.put(
    '/refresh',
    asyncHandler(authController.refresh.bind(authController)),
);

route.put(
    '/logout',
    csrfMiddleware,
    authMiddleware,
    asyncHandler(authController.logout.bind(authController)),
);

route.post(
    '/forgot-password',
    validateBodySchema(forgotPasswordSchema),
    asyncHandler(authController.forgotPassword.bind(authController)),
);

route.post(
    '/reset-password',
    validateBodySchema(resetPasswordSchema),
    asyncHandler(authController.resetPassword.bind(authController)),
);
export default route;
