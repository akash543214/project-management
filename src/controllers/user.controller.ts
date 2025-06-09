import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import { PrismaClient } from '../generated/prisma/index';
import ApiError from '../utils/apiError';
import bcrypt from "bcrypt";
import { RegisterUserSchema } from '../schemas/user.schema';
import { z } from "zod";

const prisma = new PrismaClient();

// Type definitions for request bodies
type RegisterUserRequest = z.infer<typeof RegisterUserSchema>;


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


export {
    registerUser
}