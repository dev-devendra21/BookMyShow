import UserController from '../controllers/user.controller.js';
import logger from '../lib/logger.js';
import UserRepository from '../repositories/user.repository.js';
import UserService from '../services/user.service.js';
import UserModel from '../models/user.model.js';

export default function userModule() {
    const userRepository = new UserRepository(UserModel);

    const userService = new UserService(userRepository, logger);

    const userController = new UserController(userService);

    return userController;
}
