import mongoose from 'mongoose';
import env from './env.js';
import logger from '../lib/logger.js';

const connectDB = async (): Promise<void> => {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB');
};

export default connectDB;
