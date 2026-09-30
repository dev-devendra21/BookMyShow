import type { Model } from 'mongoose';

import type { IMovie } from '../models/movie.model.js';
import type {
    MovieDTO,
    UpdateMovieDTO,
} from '../validators/movie.validator.js';

export default class MovieRepository {
    constructor(private readonly movie: Model<IMovie>) {}

    createMovie(data: MovieDTO) {
        return this.movie.create(data);
    }

    updateMovie(id: string, data: UpdateMovieDTO) {
        return this.movie.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }
}
