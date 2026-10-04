import status from 'http-status';
import { successResponse } from '../utils/api-response.js';
import type { Request, Response } from 'express';
import type {
    CreateMovieRequest,
    UpdateMovieRequest,
} from '../types/movie.type.js';
import type MovieService from '../services/movie.service.js';
import type { MoviesQueryParamsDTO } from '../validators/movie.validator.js';

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

    async getMovies(req: Request, res: Response) {
        const { page, limit, genre, language, releaseStatus, search } =
            req.query;

        const result = await this.movieService.getMovies({
            page,
            limit,
            genre,
            language,
            releaseStatus,
            search,
        } as unknown as MoviesQueryParamsDTO);

        res.status(status.OK).json(
            successResponse('Movies retrieved successfully', result),
        );
    }

    async deleteMovie(req: Request, res: Response) {
        const { id } = req.params;
        await this.movieService.deleteMovie(id as string);
        res.status(status.OK).json(
            successResponse('Movie deleted successfully'),
        );
    }
}
