import status from 'http-status';
import type { Logger } from 'winston';
import { successResponse } from '../utils/api-response.js';
import type { Request, Response } from 'express';

export default class PingController {
    constructor(private readonly logger: Logger) {}
    welcome(req: Request, res: Response) {
        res.status(status.OK).json(successResponse('Welcome to the service'));
    }
}
