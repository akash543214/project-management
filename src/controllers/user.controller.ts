import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import ApiError from '../utils/apiError';
import { UserPayload } from '../types/common';
import { z } from "zod";
import { prisma } from '../lib/prisma';
import { UpdateProfileSchema } from '../schemas/user.schema';

type UpdateUserRequest = z.infer<typeof UpdateProfileSchema>;


const updateUser = asyncHandler(async (req: Request<{}, {}, UpdateUserRequest>, res: Response) => {

 const user = req.user as UserPayload;
    const updateData  = req.body;

     const updatedData = await prisma.user.update({
         where: {
          id: user.id,
         },
          data: updateData,
        })
        
    const { password: _password, refreshToken: _refreshToken, ...userResponse } = updatedData;

    
     res.status(201).json(
        new ApiResponse(201, userResponse, "update successful")
    );  
});


const deleteUser = asyncHandler(async (req: Request, res: Response) => {

        const user = req.user as UserPayload;

     const deleteUser = await prisma.user.delete({

     where: {
    id: user.id,
  },
    })

     res.status(201).json(
        new ApiResponse(201,deleteUser, "delete successful")
    );  
});




export {
    updateUser,
    deleteUser,
}    