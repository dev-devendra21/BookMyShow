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

    async getAllMovies(skip: number, limit: number) {
        const [movies, total] = await Promise.all([
            this.movie
                .find()
                .select('-__v')
                .skip(skip)
                .limit(limit)
                .lean()
                .sort({ releaseDate: -1 }),

            this.movie.countDocuments(),
        ]);

        return {
            movies,
            total,
        };
    }

    async deleteMovie(id: string) {
        return await this.movie.findByIdAndDelete(id);
    }
}
