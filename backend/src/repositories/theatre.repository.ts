import type { Model } from 'mongoose';
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
}
