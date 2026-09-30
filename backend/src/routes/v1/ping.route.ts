import { Router } from 'express';
import asyncHandler from '../../utils/async-handler.js';
import createPingModule from '../../modules/ping.module.js';

const route = Router();

const pingController = createPingModule();

route.get('/', asyncHandler(pingController.welcome.bind(pingController)));

export default route;
