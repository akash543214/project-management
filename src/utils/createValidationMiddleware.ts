import {z} from 'zod';
import { NextFunction } from 'express';
import ApiError from './apiError';
import { Request, Response } from "express";

export const createValidationMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        // Throw custom ApiError with first validation message
        throw new ApiError(firstError.message, 400);
      }
      throw new ApiError('Invalid input data', 400);
    }
  };
};