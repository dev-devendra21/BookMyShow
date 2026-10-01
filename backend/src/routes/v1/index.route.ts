import { Router } from 'express';
import theatreRoute from './theatre.route.js';

const route = Router();

route.use('/theatres', theatreRoute);

export default route;
