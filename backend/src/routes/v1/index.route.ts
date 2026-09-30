import { Router } from 'express';
import pingRoute from './ping.route.js';

const route = Router();

route.use('/ping', pingRoute);

export default route;
