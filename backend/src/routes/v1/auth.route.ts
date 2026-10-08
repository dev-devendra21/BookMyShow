import { Router } from 'express';
import authModule from '../../modules/auth.module.js';
import asyncHandler from '../../utils/async-handler.js';

const route = Router();

const authController = authModule();

route.post('/signUp', asyncHandler(authController.signUp.bind(authController)));

export default route;
