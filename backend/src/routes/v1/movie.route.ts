import { Router } from 'express';
import asyncHandler from '../../utils/async-handler.js';
import {
    validateBodySchema,
    validateParamsSchema,
} from '../../middlewares/validation.middleware.js';
import {
    movieSchema,
    updateMovieIdParams,
    updateMovieSchema,
} from '../../validators/movie.validator.js';
import movieModule from '../../modules/movie.module.js';

const route = Router();

const movieController = movieModule();
route.post(
    '/',
    validateBodySchema(movieSchema),
    asyncHandler(movieController.createMovie.bind(movieController)),
);

route.patch(
    '/:id',
    validateParamsSchema(updateMovieIdParams),
    validateBodySchema(updateMovieSchema),
    asyncHandler(movieController.updateMovie.bind(movieController)),
);

export default route;
