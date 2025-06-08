import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { PrismaClient } from '../generated/prisma/index';
const prisma = new PrismaClient();

const registerUser = asyncHandler(async(req: Request, res: Response) => {
 const { name, email } = req.body;

  const newUser = await prisma.user.create({
    data:{
      name: name,
      email: email
    }
  })
   res.status(201).json(new ApiResponse(200, newUser, "Resgistration successfully"));

});

export {
    registerUser
}