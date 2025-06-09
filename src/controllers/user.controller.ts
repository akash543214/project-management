import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { PrismaClient } from '../generated/prisma/index';
import ApiError from '../utils/apiError';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const registerUser = asyncHandler(async(req: Request, res: Response) => {
 const { name, email, password,provider } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
      throw new ApiError("user already exist",500);
  }

   let hashedPassword: string | undefined;
  if (provider === "local") {
    if (!password) {
      throw new ApiError("Password is required",400);  
      }
    hashedPassword = await bcrypt.hash(password, 12);
  }

  // Create user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      provider,
    },
  });

  res.status(200).json(new ApiResponse(200, newUser, "Resgistration successfully"));

   
});

export {
    registerUser
}