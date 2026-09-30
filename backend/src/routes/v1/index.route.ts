import { Router } from 'express';
import movieRoute from './movie.route.js';

const route = Router();

route.use('/movies', movieRoute);

export default route;
