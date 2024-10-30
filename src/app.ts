import express, { Application } from 'express';
import userRoutes from './routes/UserRoutes';
import postRoutes from './routes/PostRoutes';
import reportRoutes from './routes/ReportRoutes';
import errorHandler from './middlewares/errorHandler';
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoutes);
app.use(postRoutes);
app.use(reportRoutes);

app.use(errorHandler);

export default app;
