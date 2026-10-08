import { Router } from 'express';
import movieRoute from './movie.route.js';
import theatreRoute from './theatre.route.js';
import userRoute from './user.route.js';
import authRoute from './auth.route.js';

const route = Router();

route.use('/movies', movieRoute);
route.use('/theatres', theatreRoute);
route.use('/users', userRoute);
route.use('/auth', authRoute);

export default route;
