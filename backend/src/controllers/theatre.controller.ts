import status from 'http-status';
import { successResponse } from '../utils/api-response.js';
import type { Request, Response } from 'express';
import type TheatreService from '../services/theatre.service.js';
import type {
    CreateTheatreRequest,
    UpdateTheatreRequest,
} from '../types/theatre.type.js';
import type {
    MovieIdsInTheatreDTO,
    TheatreIdParamsDTO,
    TheatreQueryDTO,
} from '../validators/theatre.validator.js';

export default class TheatreController {
    constructor(private readonly theatreService: TheatreService) {}

    async createTheatre(req: CreateTheatreRequest, res: Response) {
        const theatre = await this.theatreService.createTheatre(req.body);
        res.status(status.CREATED).json(
            successResponse('Theatre created successfully', {
                id: theatre._id,
            }),
        );
    }

    async updateTheatre(req: UpdateTheatreRequest, res: Response) {
        const { id: theatreId } = req.params as TheatreIdParamsDTO;

        const updatedTheatre = await this.theatreService.updateTheatre(
            theatreId,
            req.body,
        );
        res.status(status.OK).json(
            successResponse('Theatre updated successfully', {
                id: updatedTheatre._id,
            }),
        );
    }

    async getTheatreById(req: Request, res: Response) {
        const { id: theatreId } = req.params as TheatreIdParamsDTO;

        const theatre = await this.theatreService.getTheatreById(theatreId);
        res.status(status.OK).json(
            successResponse('Theatre retrieved successfully', {
                theatre,
            }),
        );
    }

    async getTheatres(req: Request, res: Response) {
        const {
            page,
            limit,
            search,
            status: theatreStatus,
            pincode,
            city,
            state,
        } = req.query as unknown as TheatreQueryDTO;

        const data = await this.theatreService.getTheatre({
            page,
            limit,
            search,
            pincode,
            city,
            state,
            status: theatreStatus,
        });

        res.status(status.OK).json(
            successResponse('Theatres retrieved successfully', data),
        );
    }

    async deleteTheatre(req: Request, res: Response) {
        const { id: theatreId } = req.params as TheatreIdParamsDTO;

        await this.theatreService.deleteTheatre(theatreId);
        res.status(status.OK).json(
            successResponse('Theatre deleted successfully'),
        );
    }

    async updateMoviesInTheatre(req: Request, res: Response) {
        const { id: theatreId } = req.params as TheatreIdParamsDTO;
        const { movieIds, insert } = req.body as MovieIdsInTheatreDTO;

        const updatedTheatre = await this.theatreService.updateMoviesInTheatre(
            theatreId,
            movieIds,
            insert,
        );

        res.status(status.OK).json(
            successResponse(
                `Movies ${insert ? 'added to' : 'removed from'} theatre successfully`,
                {
                    id: updatedTheatre._id,
                    movies: updatedTheatre.movies,
                },
            ),
        );
    }
}
