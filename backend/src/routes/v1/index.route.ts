import { Router } from 'express';
import movieRoute from './movie.route.js';
import theatreRoute from './theatre.route.js';

const route = Router();

route.use('/movies', movieRoute);
route.use('/theatres', theatreRoute);

export default route;
