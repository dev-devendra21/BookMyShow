import { Router } from 'express';
import asyncHandler from '../../utils/async-handler.js';
import {
    validateBodySchema,
    validateParamsSchema,
    validateQuerySchema,
} from '../../middlewares/validation.middleware.js';
import {
    movieIdParams,
    movieSchema,
    moviesQueryParams,
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

route.put(
    '/:id',
    validateParamsSchema(movieIdParams),
    validateBodySchema(movieSchema),
    asyncHandler(movieController.updateMovie.bind(movieController)),
);

route.patch(
    '/:id',
    validateParamsSchema(movieIdParams),
    validateBodySchema(updateMovieSchema),
    asyncHandler(movieController.updateMovie.bind(movieController)),
);

route.get(
    '/',
    validateQuerySchema(moviesQueryParams),
    asyncHandler(movieController.getMovies.bind(movieController)),
);

route.delete(
    '/:id',
    validateParamsSchema(movieIdParams),
    asyncHandler(movieController.deleteMovie.bind(movieController)),
);
export default route;
