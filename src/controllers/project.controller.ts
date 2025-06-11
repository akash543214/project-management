import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
//import ApiError from '../utils/apiError';
//import { z } from "zod";
//import { UserPayload } from '../types/common';
//import { prisma } from '../lib/prisma';



const getProjects = asyncHandler(async (req: Request, res: Response) => {

     res.status(201).json(
        new ApiResponse(201, {}, "projects fetched successful")
    );  
});

const createProject = asyncHandler(async (req: Request, res: Response) => {

     res.status(201).json(
        new ApiResponse(201, {}, "update successful")
    );  
});


const deleteProject = asyncHandler(async (req: Request, res: Response) => {

     res.status(201).json(
        new ApiResponse(201, {}, "delete successful")
    );  
});

const updateProject = asyncHandler(async (req: Request, res: Response) => {

     res.status(201).json(
        new ApiResponse(201, {}, "delete successful")
    );  
});


export {
    createProject,
    deleteProject,
    updateProject,
    getProjects 
}    