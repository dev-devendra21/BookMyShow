import { Router } from 'express';
import {
    validateBodySchema,
    validateParamsSchema,
} from '../../middlewares/validation.middleware.js';
import {
    updateUserSchema,
    userIdParamsSchema,
    userSchema,
} from '../../validators/user.validator.js';
import userModule from '../../modules/user.module.js';
import asyncHandler from '../../utils/async-handler.js';

const route = Router();

const userController = userModule();

route.post(
    '/',
    validateBodySchema(userSchema),
    asyncHandler(userController.createUser.bind(userController)),
);

route.put(
    '/:id',
    validateParamsSchema(userIdParamsSchema),
    validateBodySchema(userSchema),
    asyncHandler(userController.updateUser.bind(userController)),
);

route.patch(
    '/:id',
    validateParamsSchema(userIdParamsSchema),
    validateBodySchema(updateUserSchema),
    asyncHandler(userController.updateUser.bind(userController)),
);

route.get(
    '/:id',
    validateParamsSchema(userIdParamsSchema),
    asyncHandler(userController.getUserById.bind(userController)),
);

route.delete(
    '/:id',
    validateParamsSchema(userIdParamsSchema),
    asyncHandler(userController.deleteUserById.bind(userController)),
);

export default route;
