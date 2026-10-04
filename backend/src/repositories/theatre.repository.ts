import { Types, type Model } from 'mongoose';
import type { ITheatre } from '../models/theatre.model.js';
import type {
    CreateTheatreDTO,
    UpdateTheatreDTO,
} from '../validators/theatre.validator.js';

export default class TheatreRepository {
    constructor(private readonly theatre: Model<ITheatre>) {}

    createTheatre(data: CreateTheatreDTO) {
        return this.theatre.create(data);
    }

    updateTheatre(theatreId: string, data: UpdateTheatreDTO) {
        return this.theatre.findByIdAndUpdate(theatreId, data, { new: true });
    }

    getTheatreById(theatreId: string) {
        return this.theatre.findById(theatreId);
    }

    async getTheatre(filter: any, skip: number, limit: number) {
        const [theatres, totalNoOfTheatres] = await Promise.all([
            this.theatre.find(filter).skip(skip).limit(limit).lean(),
            this.theatre.countDocuments(filter),
        ]);
        return { theatres, totalNoOfTheatres };
    }

    deleteTheatre(theatreId: string) {
        return this.theatre.findByIdAndDelete(theatreId);
    }

    addMoviesToTheatre(theatreId: string, movieIds: string[]) {
        return this.theatre.findByIdAndUpdate(
            theatreId,
            { $addToSet: { movies: { $each: movieIds } } },
            { new: true },
        );
    }

    removeMoviesFromTheatre(theatreId: string, movieIds: string[]) {
        return this.theatre.findByIdAndUpdate(
            theatreId,
            { $pull: { movies: { $in: movieIds } } },
            { new: true },
        );
    }

    getMoviesInATheatre(theatreId: string) {
        return this.theatre
            .findById(theatreId)
            .select('name address movies')
            .populate('movies')
            .lean();
    }

    async checkMovieInATheatre(theatreId: string, movieId: string) {
        const theatre = await this.theatre.findById(theatreId).lean();

        if (!theatre) {
            return false;
        }

        return theatre?.movies?.some((id) => id.toString() === movieId);
    }
}
