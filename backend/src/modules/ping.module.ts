import PingController from '../controllers/ping.controller.js';
import logger from '../lib/logger.js';

export default function createPingModule() {
    const pingController = new PingController(logger);

    return pingController;
}
