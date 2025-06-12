// In your asyncHandler file
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

type AsyncHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = <
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs
>(
  fn: AsyncHandler<P, ResBody, ReqBody, ReqQuery>
): AsyncHandler<P, ResBody, ReqBody, ReqQuery> => 
  async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      next(error);
    }
  };