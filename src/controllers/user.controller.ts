import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyRefreshToken } from '../utils/jwt';
// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
import { ApiResponse } from '../utils/apiResponse';
import { PrismaClient } from '../generated/prisma/index';
import ApiError from '../utils/apiError';
import bcrypt from "bcrypt";
import { RegisterUserSchema } from '../schemas/user.schema';
import { LoginUserSchema } from '../schemas/user.schema';
import { generateAccessToken,generateRefreshToken } from '../utils/jwt';
import { z } from "zod";

const prisma = new PrismaClient();

// Type definitions for request bodies
type RegisterUserRequest = z.infer<typeof RegisterUserSchema>;
type LoginUserRequest = z.infer<typeof LoginUserSchema>;

const registerUser = asyncHandler(async (req: Request<{}, {}, RegisterUserRequest>, res: Response) => {
  
    // At this point, req.body is already validated and sanitized by Zod
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email } 
    });

    if (existingUser) {
        throw new ApiError("User already exists", 409);
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create LOCAL user
    const newUser = await prisma.user.create({
        data: {
            name, // Already sanitized by Zod
            email, // Already sanitized by Zod
            password: hashedPassword,
            provider: "local"
        },
    });

    // Remove password from response
    const { password: _, ...userResponse } = newUser;
    
    res.status(201).json(
        new ApiResponse(201, userResponse, "Registration successful")
    );
});

const loginUser = asyncHandler(async (req: Request<{}, {}, LoginUserRequest>, res: Response) => {

const {  email, password } = req.body;

const user = await prisma.user.findUnique({where:{email}});

if(!user)
{ 
    throw new ApiError("User does not exists", 400);
}

 const passwordMatch = await bcrypt.compare(password, user.password!);

  if (!passwordMatch) {
    throw new ApiError("Incorrect password", 400);
  }

 const payload = { id: user.id, email: user.email };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Save refresh token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  const { password: _, refreshToken: __, ...userResponse } = user;


   const options = {
       httpOnly: true,
       secure: true
   }

    res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options).json(
    new ApiResponse(200, {
      user: userResponse,
      accessToken,
      refreshToken,
    }, "Login successful")
  );

});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {

           
        const {email} = req?.user;

        await prisma.user.update({where:{
            email:email
        },
    data:{
        refreshToken:null
    }});

 res.clearCookie('accessToken')
    .clearCookie('refreshToken')
    .status(200).json(
        new ApiResponse(201, {}, "Logout successful")
    );

});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {


  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError("Refresh token missing", 401);
  }

    const payload = verifyRefreshToken(refreshToken) as { id: number; email: string };

    const {email} = payload;
    console.log(payload);
  // Optionally verify token exists in DB
  const storedToken = await prisma.user.findUnique({
    where: { email }
  });

  if (!storedToken) {
    throw new ApiError("Token not found or revoked", 403);
  }

  const accessToken = generateAccessToken({ id: payload.id, email: payload.email });
  const newRefreshToken = generateRefreshToken({ id: payload.id, email: payload.email });

  // Optionally update stored token (rotation)
  await prisma.user.update({
    where: { email: email },
    data: { refreshToken: newRefreshToken }
  });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
  };

 

   const options = {
       httpOnly: true,
       secure: true
   }


    res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options).json(
    new ApiResponse(200, {
      accessToken,
      refreshToken,
    }, "access token refreshed")
  );

});

const updateUser = asyncHandler(async (req: Request, res: Response) => {

     res.status(201).json(
        new ApiResponse(201, {}, "update successful")
    );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateUser
}    