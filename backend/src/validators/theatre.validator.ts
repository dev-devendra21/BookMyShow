import mongoose from 'mongoose';
import { z } from 'zod';

export const theatreStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);

export const theatreSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Theatre name must be at least 2 characters')
        .max(150, 'Theatre name cannot exceed 150 characters'),

    description: z
        .string()
        .trim()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description cannot exceed 1000 characters'),

    address: z
        .string()
        .trim()
        .min(5, 'Address must be at least 5 characters')
        .max(500, 'Address cannot exceed 500 characters'),

    city: z
        .string()
        .trim()
        .min(2, 'City must be at least 2 characters')
        .max(100, 'City cannot exceed 100 characters'),

    state: z
        .string()
        .trim()
        .min(2, 'State must be at least 2 characters')
        .max(100, 'State cannot exceed 100 characters'),

    pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),

    status: theatreStatusSchema.default('ACTIVE'),
});

export const theatreIdParamsSchema = z.object({
    id: z
        .string('Theatre ID is required')
        .refine((id) => mongoose.isValidObjectId(id), 'Invalid theatre ID'),
});

export const checkMovieInATheatreParamsSchema = z.object({
    theatreId: z
        .string('Theatre id is required')
        .refine(
            (theatreId) => mongoose.isValidObjectId(theatreId),
            'Invalid theatre ID',
        ),

    movieId: z
        .string('Movie id is required')
        .refine(
            (movieId) => mongoose.isValidObjectId(movieId),
            'Invalid movie ID',
        ),
});

export const theatreQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => val > 0, 'Page number must be greater than 0'),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => val > 0, 'Limit must be greater than 0'),
    status: theatreStatusSchema.optional(),
    search: z.string().optional(),
    pincode: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    movieId: z
        .string()
        .optional()
        .refine(
            (id) => !id || mongoose.isValidObjectId(id),
            'Invalid movie ID',
        ),
});

export const movieIdsInTheatreSchema = z.object({
    movieIds: z
        .array(
            z
                .string()
                .refine(
                    (id) => mongoose.isValidObjectId(id),
                    'Invalid movie ID',
                ),
        )
        .nonempty('Movie IDs array cannot be empty'),
    insert: z.boolean(),
});

export const updateTheatreSchema = theatreSchema.partial();

export type CreateTheatreDTO = z.infer<typeof theatreSchema>;
export type UpdateTheatreDTO = z.infer<typeof updateTheatreSchema>;
export type TheatreIdParamsDTO = z.infer<typeof theatreIdParamsSchema>;
export type CheckMovieInATheatreParamsDTO = z.infer<
    typeof checkMovieInATheatreParamsSchema
>;
export type TheatreQueryDTO = z.infer<typeof theatreQuerySchema>;
export type MovieIdsInTheatreDTO = z.infer<typeof movieIdsInTheatreSchema>;
