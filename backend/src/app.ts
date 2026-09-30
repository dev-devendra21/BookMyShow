import express from 'express';
import helmet from 'helmet';
import morganMiddleware from './middlewares/morgan.middleware.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import globalErrorMiddleware from './middlewares/global-error.middleware.js';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware.js';
import apiRoute from './routes/index.route.js';

const app = express();

const corsOptions = {
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(attachCorrelationIdMiddleware);
app.use(morganMiddleware);

app.use('/api', apiRoute);

app.use(globalErrorMiddleware);

export default app;
