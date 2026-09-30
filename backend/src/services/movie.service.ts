import type { Logger } from 'winston';

import type {
    MovieDTO,
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
}
