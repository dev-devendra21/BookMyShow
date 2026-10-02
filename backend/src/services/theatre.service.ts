import type { Logger } from 'winston';
import type TheatreRepository from '../repositories/theatre.repository.js';
import type {
    CreateTheatreDTO,
    TheatreQueryDTO,
    UpdateTheatreDTO,
} from '../validators/theatre.validator.js';
import createHttpError from 'http-errors';

export default class TheatreService {
    constructor(
        private readonly theatreRepository: TheatreRepository,
        private readonly logger: Logger,
    ) {}

    async createTheatre(data: CreateTheatreDTO) {
        this.logger.info('Creating a new theatre');
        const theatre = await this.theatreRepository.createTheatre(data);
        this.logger.info('Theatre created successfully', {
            theatreId: theatre._id,
        });
        return theatre;
    }

    async updateTheatre(theatreId: string, data: UpdateTheatreDTO) {
        this.logger.info(`Updating theatre with ID: ${theatreId}`);
        const updatedTheatre = await this.theatreRepository.updateTheatre(
            theatreId,
            data,
        );

        if (!updatedTheatre) {
            this.logger.warn(`Theatre with ID: ${theatreId} not found`);
            throw createHttpError.NotFound('Theatre not found');
        }
        this.logger.info('Theatre updated successfully', {
            theatreId: updatedTheatre._id,
        });
        return updatedTheatre;
    }

    async getTheatreById(theatreId: string) {
        this.logger.info(`Retrieving theatre with ID: ${theatreId}`);
        const theatre = await this.theatreRepository.getTheatreById(theatreId);
        if (!theatre) {
            this.logger.warn(`Theatre with ID: ${theatreId} not found`);
            throw createHttpError.NotFound('Theatre not found');
        }
        return theatre;
    }

    async getTheatre({
        page,
        limit,
        search,
        city,
        pincode,
        state,
        status,
        movieId,
    }: TheatreQueryDTO) {
        this.logger.info('Retrieving theatres');

        const skip = (page - 1) * limit;

        const filter = {
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { city: { $regex: search, $options: 'i' } },
                    { state: { $regex: search, $options: 'i' } },
                    { address: { $regex: search, $options: 'i' } },
                    { pincode: { $regex: search, $options: 'i' } },
                ],
            }),

            ...(city && { city: { $regex: city, $options: 'i' } }),
            ...(pincode && { pincode: { $regex: pincode, $options: 'i' } }),
            ...(state && { state: { $regex: state, $options: 'i' } }),
            ...(movieId && { movies: { $elemMatch: { $eq: movieId } } }),
            ...(status && {
                status,
            }),
        };

        const { theatres, totalNoOfTheatres } =
            await this.theatreRepository.getTheatre(filter, skip, limit);

        this.logger.info('Theatres retrieved successfully', {
            totalNoOfTheatres,
            page,
            limit,
        });

        return {
            theatres,
            pagination: {
                page,
                limit,
                total: totalNoOfTheatres,
                totalPages: Math.ceil(totalNoOfTheatres / limit),
                hasNextPage: page < Math.ceil(totalNoOfTheatres / limit),
                hasPreviousPage: page > 1,
            },
        };
    }

    async deleteTheatre(theatreId: string) {
        this.logger.info(`Deleting theatre with ID: ${theatreId}`);
        const deletedTheatre =
            await this.theatreRepository.deleteTheatre(theatreId);
        if (!deletedTheatre) {
            this.logger.warn(`Theatre with ID: ${theatreId} not found`);
            throw createHttpError.NotFound('Theatre not found');
        }
        this.logger.info('Theatre deleted successfully', {
            theatreId: deletedTheatre._id,
        });
    }

    async updateMoviesInTheatre(
        theatreId: string,
        movieIds: string[],
        insert: boolean,
    ) {
        this.logger.info(`Updating movies in theatre with ID: ${theatreId}`);

        const theatre = await this.theatreRepository.getTheatreById(theatreId);

        if (!theatre) {
            this.logger.warn(
                `No such theatre found for the id provided: ${theatreId}`,
            );

            throw createHttpError.NotFound(
                'No such theatre found for the id provided',
            );
        }

        const theatreMovieIds = theatre.movies.map((movieId) =>
            movieId.toString(),
        );

        if (insert) {
            const newMovieIds = movieIds.filter(
                (movieId) => !theatreMovieIds.includes(movieId),
            );

            if (newMovieIds.length === 0) {
                this.logger.info(
                    'All movies are already present in the theatre',
                );

                throw createHttpError.BadRequest(
                    'All movies are already present in the theatre',
                );
            }

            await this.theatreRepository.addMoviesToTheatre(
                theatreId,
                newMovieIds,
            );
        } else {
            const existingMovieIds = movieIds.filter((movieId) =>
                theatreMovieIds.includes(movieId),
            );

            if (existingMovieIds.length === 0) {
                this.logger.info(
                    'None of the provided movies exist in the theatre',
                );

                throw createHttpError.BadRequest(
                    'None of the provided movies exist in the theatre',
                );
            }

            await this.theatreRepository.removeMoviesFromTheatre(
                theatreId,
                existingMovieIds,
            );
        }

        this.logger.info('Movies updated in theatre successfully', {
            theatreId,
            movieIds,
            insert,
        });

        return {
            _id: theatre._id,
            movies: theatre.movies,
        };
    }
}
