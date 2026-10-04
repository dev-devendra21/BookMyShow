import { Router } from 'express';
import asyncHandler from '../../utils/async-handler.js';
import createTheatreModule from '../../modules/theatre.module.js';
import {
    validateBodySchema,
    validateParamsSchema,
    validateQuerySchema,
} from './../../middlewares/validation.middleware.js';
import {
    checkMovieInATheatreParamsSchema,
    movieIdsInTheatreSchema,
    theatreIdParamsSchema,
    theatreQuerySchema,
    theatreSchema,
    updateTheatreSchema,
} from '../../validators/theatre.validator.js';

const route = Router();

const theatreController = createTheatreModule();

route.post(
    '/',
    validateBodySchema(theatreSchema),
    asyncHandler(theatreController.createTheatre.bind(theatreController)),
);

route.put(
    '/:id',
    validateParamsSchema(theatreIdParamsSchema),
    validateBodySchema(theatreSchema),
    asyncHandler(theatreController.updateTheatre.bind(theatreController)),
);

route.patch(
    '/:id',
    validateParamsSchema(theatreIdParamsSchema),
    validateBodySchema(updateTheatreSchema),
    asyncHandler(theatreController.updateTheatre.bind(theatreController)),
);

route.get(
    '/:id',
    validateParamsSchema(theatreIdParamsSchema),
    asyncHandler(theatreController.getTheatreById.bind(theatreController)),
);

route.get(
    '/',
    validateQuerySchema(theatreQuerySchema),
    asyncHandler(theatreController.getTheatres.bind(theatreController)),
);

route.delete(
    '/:id',
    validateParamsSchema(theatreIdParamsSchema),
    asyncHandler(theatreController.deleteTheatre.bind(theatreController)),
);

route.patch(
    '/:id/movies',
    validateParamsSchema(theatreIdParamsSchema),
    validateBodySchema(movieIdsInTheatreSchema),
    asyncHandler(
        theatreController.updateMoviesInTheatre.bind(theatreController),
    ),
);

route.get(
    '/:id/movies',
    validateParamsSchema(theatreIdParamsSchema),
    asyncHandler(theatreController.getMoviesInATheatre.bind(theatreController)),
);

route.get(
    '/:theatreId/movies/:movieId',
    validateParamsSchema(checkMovieInATheatreParamsSchema),
    asyncHandler(
        theatreController.checkMovieInATheatre.bind(theatreController),
    ),
);

export default route;
