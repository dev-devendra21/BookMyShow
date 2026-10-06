import { model, Schema, type Model, Document } from 'mongoose';
import { RELEASE_STATUS } from '../constant/movie.js';

export interface IMovie extends Document {
    title: string;
    description: string;
    genre: string[];
    cast: string[];
    trailerUrl: string;
    language: string[];
    releaseDate: Date;
    releaseStatus: (typeof RELEASE_STATUS)[keyof typeof RELEASE_STATUS];
    director: string;
}

const movieSchema = new Schema<IMovie>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [1, 'Title cannot be empty'],
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },

        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            minlength: [10, 'Description must be at least 10 characters'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },

        genre: {
            type: [String],
            required: [true, 'Genre is required'],
            validate: {
                validator: (value: string[]) => value.length > 0,
                message: 'At least one genre is required',
            },
        },

        cast: {
            type: [String],
            required: [true, 'Cast is required'],
            validate: {
                validator: (value: string[]) => value.length > 0,
                message: 'Cast must contain at least one member',
            },
        },

        trailerUrl: {
            type: String,
            required: [true, 'Trailer URL is required'],
            trim: true,
            match: [
                /^https?:\/\/.+/,
                'Trailer URL must be a valid HTTP/HTTPS URL',
            ],
        },

        language: {
            type: [String],
            required: [true, 'Language is required'],
            default: ['English'],
            validate: {
                validator: (value: string[]) => value.length > 0,
                message: 'At least one language is required',
            },
        },

        releaseDate: {
            type: Date,
            required: [true, 'Release date is required'],
        },

        releaseStatus: {
            type: String,
            required: [true, 'Release status is required'],
            enum: {
                values: [
                    RELEASE_STATUS.RELEASED,
                    RELEASE_STATUS.UPCOMING,
                    RELEASE_STATUS.ENDED,
                ],
                message: '{VALUE} is not a valid release status',
            },
            default: RELEASE_STATUS.RELEASED,
        },

        director: {
            type: String,
            required: [true, 'Director is required'],
            trim: true,
            minlength: [1, 'Director is required'],
            maxlength: [100, 'Director cannot exceed 100 characters'],
        },
    },
    {
        timestamps: true,
    },
);

movieSchema.index({ releaseDate: -1 });

const MovieModel: Model<IMovie> = model<IMovie>('Movie', movieSchema);

export default MovieModel;
