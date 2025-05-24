import express, { Application } from 'express';
import userRoutes from './routes/UserRoutes';
import postRoutes from './routes/PostRoutes';
import reportRoutes from './routes/ReportRoutes';
import applicationRoutes from './routes/ApplicationRoutes';
import jobRoutes from './routes/JobRoutes';
import authenticationRoutes from './routes/authenticationRoutes';
import errorHandler from './middlewares/errorHandler';
import cors from 'cors';
import { startPostExpirationJob } from './cron/expirePosts';
import { authMiddleware } from './middlewares/auth';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

startPostExpirationJob();

app.use(authenticationRoutes);
app.use(jobRoutes);

app.use(authMiddleware);

app.use(userRoutes);
app.use(postRoutes);
app.use(reportRoutes);
app.use(applicationRoutes);

app.use(errorHandler);

export default app;
