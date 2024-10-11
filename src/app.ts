import express, { Application } from 'express';
import userRoutes from './routes/UserRoutes';
import postRoutes from './routes/PostRoutes';
import errorHandler from './middlewares/errorHandler';
// Initialize Express application
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoutes);
app.use(postRoutes);
// // Error handling middleware
// app.use(errorHandler);

app.use(errorHandler);

export default app;
