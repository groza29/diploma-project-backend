import express, { Application } from 'express';
import userRoutes from './routes/UserRoutes';
import postRoutes from './routes/PostRoutes';
// Initialize Express application
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoutes);
app.use(postRoutes);
// // Error handling middleware
// app.use(errorHandler);
app.use((req, res, next) => {
  const error = new Error('Not found');
  next(error);
});

app.use(
  (
    error: { status: any; message: any },
    req: any,
    res: { status: (arg0: any) => void; json: (arg0: { error: { message: any } }) => void },
    next: any,
  ) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  },
);
export default app;
