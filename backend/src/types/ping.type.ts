import type { Request } from 'express';
import type { PingPayloadDTO } from '../validators/ping.validator.js';

export interface PingRequest extends Request {
    body: PingPayloadDTO;
}
