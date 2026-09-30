import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { getCorrelationId } from '../utils/helpers/request.helpers.js';

const { combine, timestamp, printf } = winston.format;

const logger = winston.createLogger({
    format: combine(
        timestamp(),

        printf(({ level, message, timestamp, ...data }) => {
            const output = {
                timestamp,
                level,
                correlationId: getCorrelationId() ?? 'N/A',
                message,
                data,
            };

            return JSON.stringify(output);
        }),
    ),

    transports: [
        new winston.transports.Console(),

        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '20d',
        }),
    ],
});

export default logger;
