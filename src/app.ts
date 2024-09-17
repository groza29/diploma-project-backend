import express, { Application } from 'express';
import dynamoDB from './config/db';
// import userRoutes from './routes/userRoutes';
// import authRoutes from './routes/authRoutes';
// import { errorHandler } from './middlewares/errorHandler';
// import { logger } from './utils/logger';

// Initialize Express application
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/users', userRoutes);
// app.use('/auth', authRoutes);

// // Error handling middleware
// app.use(errorHandler);

export default app;
