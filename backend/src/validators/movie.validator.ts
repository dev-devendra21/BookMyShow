import { z } from 'zod';

const movieSchema = z.object({
    title: z.string().min(1, 'Title is required'),

    description: z.string().min(1, 'Description is required'),

    cast: z.array(z.string()).min(1, 'At least one cast member is required'),

    trailerUrl: z.url('Invalid trailer URL'),

    language: z
        .array(z.string())
        .min(1, 'At least one language is required')
        .default(['English']),

    releaseDate: z.coerce.date(),

    releaseStatus: z
        .enum(['RELEASED', 'UPCOMING', 'ENDED'])
        .default('RELEASED'),

    director: z.string().min(1, 'Director is required'),
});

export type MovieDTO = z.infer<typeof movieSchema>;

export default movieSchema;
