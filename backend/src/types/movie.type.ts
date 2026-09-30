import type { Request } from 'express';
import type {
    MovieDTO,
    UpdateMovieDTO,
} from '../validators/movie.validator.js';

export interface CreateMovieRequest extends Request {
    body: MovieDTO;
}

export interface UpdateMovieRequest extends Request {
    body: UpdateMovieDTO;
}
