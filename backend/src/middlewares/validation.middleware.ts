import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { errorResponse } from '../utils/api-response.js';
import status from 'http-status';

type ValidationSource = 'body' | 'params' | 'query';

const validateSchema = (
    schema: ZodType,
    source: ValidationSource,
): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                type: 'validation',
                message: issue.message,
                path: issue.path.join('.'),
                location: source,
            }));

            return res
                .status(status.BAD_REQUEST)
                .json(errorResponse('Validation failed', errors));
        }

        next();
    };
};

export const validateBodySchema = (schema: ZodType): RequestHandler => {
    return validateSchema(schema, 'body');
};

export const validateParamsSchema = (schema: ZodType): RequestHandler => {
    return validateSchema(schema, 'params');
};

export const validateQuerySchema = (schema: ZodType): RequestHandler => {
    return validateSchema(schema, 'query');
};
