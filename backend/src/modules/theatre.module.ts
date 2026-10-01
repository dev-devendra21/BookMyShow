import TheatreController from '../controllers/theatre.controller.js';
import logger from '../lib/logger.js';
import TheatreModel from '../models/theatre.model.js';
import TheatreRepository from '../repositories/theatre.repository.js';
import TheatreService from '../services/theatre.service.js';

export default function createTheatreModule() {
    const theatreRepository = new TheatreRepository(TheatreModel);

    const theatreService = new TheatreService(theatreRepository, logger);
    const theatreController = new TheatreController(theatreService);

    return theatreController;
}
