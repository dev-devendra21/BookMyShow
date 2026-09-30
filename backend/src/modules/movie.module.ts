import MovieController from '../controllers/movie.controller.js';
import logger from '../lib/logger.js';
import MovieRepository from '../repositories/movie.repository.js';
import MovieService from '../services/movie.service.js';
import MovieModel from '../models/movie.model.js';

export default function movieModule() {
    const movieRepository = new MovieRepository(MovieModel);

    const movieService = new MovieService(movieRepository, logger);

    const movieController = new MovieController(movieService);

    return movieController;
}
