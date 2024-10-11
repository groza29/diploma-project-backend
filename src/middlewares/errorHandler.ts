import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error('Error occurred:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
};

export default errorHandler;
