import express, { Application } from 'express';
import userRoutes from './routes/UserRoutes';
// Initialize Express application
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoutes);
// // Error handling middleware
// app.use(errorHandler);

export default app;
