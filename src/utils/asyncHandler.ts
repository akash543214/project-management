import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncHandler): AsyncHandler => 
  async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      next(error); // better to pass to global error middleware
    }
  };