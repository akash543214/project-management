// middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError';
import { Prisma } from '../generated/prisma';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        const target = err.meta?.target as string[];
        error = new ApiError(`Duplicate value for ${target?.join(', ') || 'field'}`, 409);
        break;
        
      case 'P2025':
        error = new ApiError('Record not found', 404);
        break;
        
      case 'P2003':
        const field = err.meta?.field_name;
        error = new ApiError(`Invalid reference: ${field || 'foreign key constraint violated'}`, 400);
        break;
        
      case 'P2011':
        const constraint = err.meta?.constraint;
        error = new ApiError(`Missing required field: ${constraint || 'null constraint violation'}`, 400);
        break;
        
      default:
        error = new ApiError(`Database error: ${err.code}`, 400);
    }
  } 
  else if (err instanceof Prisma.PrismaClientValidationError) {
    error = new ApiError('Invalid data provided', 400);
  }
  // If error is not an instance of ApiError, convert it to one
  else if (!(err instanceof ApiError)) {
    error = new ApiError(err.message || 'Internal Server Error', err.statusCode || 500);
  }

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      originalError: err 
    })
  });
};

export default errorHandler;