import mongoose from 'mongoose';
import { z } from 'zod';
import { RELEASE_STATUS } from '../constant/movie.js';

export const movieSchema = z.object({
    title: z
        .string('Title is required')
        .trim()
        .min(1, 'Title must contain at least 1 character'),

    description: z
        .string('Description is required')
        .trim()
        .min(50, 'Description must be at least 50 characters long'),
    genre: z
        .array(z.string('Each genre must be a string').trim())
        .min(1, 'At least one genre is required'),
    cast: z
        .array(z.string('Each cast member must be a string').trim())
        .min(1, 'At least one cast member is required'),

    trailerUrl: z.url('Please provide a valid trailer URL'),

    language: z
        .array(z.string('Each language must be a string').trim())
        .min(1, 'At least one language is required')
        .default(['English']),

    releaseDate: z.coerce.date('Please provide a valid release date'),

    releaseStatus: z
        .enum(
            [
                RELEASE_STATUS.RELEASED,
                RELEASE_STATUS.UPCOMING,
                RELEASE_STATUS.ENDED,
            ],
            'Release status must be RELEASED, UPCOMING, or ENDED',
        )
        .default('RELEASED'),

    director: z
        .string('Director is required')
        .trim()
        .min(1, 'Director name must contain at least 1 character'),
});

export const updateMovieSchema = movieSchema.partial();

export const movieIdParams = z.object({
    id: z
        .string('Movie ID is required')
        .refine((id) => mongoose.isValidObjectId(id), 'Invalid movie ID'),
});

export const moviesQueryParams = z.object({
    genre: z.string().trim().min(1, 'Genre cannot be empty').optional(),

    language: z.string().trim().min(1, 'Language cannot be empty').optional(),

    search: z.string().trim().min(1, 'Search cannot be empty').optional(),

    releaseStatus: z
        .enum([
            RELEASE_STATUS.RELEASED,
            RELEASE_STATUS.UPCOMING,
            RELEASE_STATUS.ENDED,
        ])
        .optional(),

    page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),

    limit: z.coerce
        .number()
        .int()
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
        .default(10),
});

export type MovieDTO = z.infer<typeof movieSchema>;
export type UpdateMovieDTO = z.infer<typeof updateMovieSchema>;
export type MovieIdParamsDTO = z.infer<typeof movieIdParams>;
export type MoviesQueryParamsDTO = z.infer<typeof moviesQueryParams>;
