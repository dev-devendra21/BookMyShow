import type { Request } from 'express';
import type {
    CreateTheatreDTO,
    UpdateTheatreDTO,
} from '../validators/theatre.validator.js';

export interface CreateTheatreRequest extends Request {
    body: CreateTheatreDTO;
}

export interface UpdateTheatreRequest extends Request {
    body: UpdateTheatreDTO;
}
