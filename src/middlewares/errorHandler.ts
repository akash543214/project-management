// middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // If error is not an instance of AppError, convert it to one
  if (!(err instanceof ApiError)) {
    err = new ApiError(err.message || 'Internal Server Error', err.statusCode || 500);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default errorHandler;
