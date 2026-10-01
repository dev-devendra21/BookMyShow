import type { Logger } from 'winston';

import type {
    MovieDTO,
    MoviesQueryParamsDTO,
    UpdateMovieDTO,
} from '../validators/movie.validator.js';
import type MovieRepository from '../repositories/movie.repository.js';
import createHttpError from 'http-errors';

export default class MovieService {
    constructor(
        private readonly movieRepository: MovieRepository,
        private readonly logger: Logger,
    ) {}

    async createMovie(data: MovieDTO) {
        this.logger.info('Creating a new movie');
        const movie = await this.movieRepository.createMovie(data);

        this.logger.info('Movie created successfully', {
            movieId: movie._id.toString(),
            title: movie.title,
        });

        return movie;
    }

    async updateMovie(id: string, data: UpdateMovieDTO) {
        const movie = await this.movieRepository.updateMovie(id, data);

        if (!movie) {
            this.logger.warn('Movie update failed: movie not found', {
                movieId: id,
            });
            throw createHttpError.NotFound('Movie not found');
        }

        this.logger.info('Movie updated successfully', {
            movieId: movie._id.toString(),
            title: movie.title,
        });

        return movie;
    }

    async getMovies({
        page,
        limit,
        search,
        genre,
        language,
        releaseStatus,
    }: MoviesQueryParamsDTO) {
        const skip = (page - 1) * limit;

        const filter = {
            ...(search && {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { cast: { $regex: search, $options: 'i' } },
                    { director: { $regex: search, $options: 'i' } },
                ],
            }),
            ...(genre?.length && {
                genre: { $in: genre },
            }),

            ...(language?.length && {
                language: { $in: language },
            }),

            ...(releaseStatus && {
                releaseStatus,
            }),
        };
        const { movies, total } = await this.movieRepository.getMovies(
            filter,
            skip,
            limit,
        );

        const totalPages = Math.ceil(total / limit);

        this.logger.info('Movies retrieved successfully', {
            page,
            limit,
            count: movies.length,
            total,
        });

        return {
            movies,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    }

    async deleteMovie(id: string) {
        const movie = await this.movieRepository.deleteMovie(id);
        if (!movie) {
            this.logger.warn('Movie deletion failed: movie not found', {
                movieId: id,
            });
            throw createHttpError.NotFound('Movie not found');
        }
        this.logger.info('Movie deleted successfully', {
            movieId: movie._id.toString(),
            title: movie.title,
        });
    }
}
