
import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
const registerUser = asyncHandler(async(req: Request, res: Response) => {

    
 const { name, email } = req.body;

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
  };
   res.status(201).json(new ApiResponse(200, newUser, "Resgistration successfully"));

});

export {
    registerUser
}