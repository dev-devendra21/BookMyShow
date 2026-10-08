import AuthController from '../controllers/auth.controller.js';
import logger from '../lib/logger.js';
import UserRepository from '../repositories/user.repository.js';
import UserService from '../services/user.service.js';
import UserModel from '../models/user.model.js';
import AuthService from '../services/auth.service.js';
import RedisClient from '../lib/redis.js';

export default function authModule() {
    const userRepository = new UserRepository(UserModel);

    const userService = new UserService(userRepository, logger);

    const redis = RedisClient.getInstance();
    const authService = new AuthService(
        userService,
        userRepository,
        redis,
        logger,
    );

    const authController = new AuthController(authService);

    return authController;
}
