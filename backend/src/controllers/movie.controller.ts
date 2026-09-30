import status from 'http-status';
import type { Logger } from 'winston';
import { successResponse } from '../utils/api-response.js';
import type { Response } from 'express';
import type {
    CreateMovieRequest,
    UpdateMovieRequest,
} from '../types/movie.type.js';
import type MovieService from '../services/movie.service.js';

export default class MovieController {
    constructor(private readonly movieService: MovieService) {}

    async createMovie(req: CreateMovieRequest, res: Response) {
        const result = await this.movieService.createMovie(req.body);

        res.status(status.CREATED).json(
            successResponse('Movie created successfully', {
                movieId: result._id.toString(),
            }),
        );
    }

    async updateMovie(req: UpdateMovieRequest, res: Response) {
        const { id } = req.params;

        const movie = await this.movieService.updateMovie(
            id as string,
            req.body,
        );

        res.status(status.OK).json(
            successResponse('Movie updated successfully', {
                movieId: movie._id.toString(),
            }),
        );
    }
}
