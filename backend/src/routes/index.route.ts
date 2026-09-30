import { Router } from 'express';
import v1Route from './v1/index.route.js';

const route = Router();

route.use('/v1', v1Route);

export default route;
