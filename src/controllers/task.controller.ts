import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
//import ApiError from '../utils/apiError';
//import { z } from "zod";
//import { UserPayload } from '../types/common';
//import { prisma } from '../lib/prisma';



const getTasks = asyncHandler(async (req: Request, res: Response) => {

     res.status(201).json(
        new ApiResponse(201, {}, "task fetched successfuly")
    );  
});


const getTaskById = asyncHandler(async (req: Request, res: Response) => {

     res.status(201).json(
        new ApiResponse(201, {}, "task fetched successfuly")
    );  
});
const createTask = asyncHandler(async (req: Request, res: Response) => {

     res.status(201).json(
        new ApiResponse(201, {}, "update successful")
    );  
});


const deleteTask = asyncHandler(async (req: Request, res: Response) => {

     res.status(201).json(
        new ApiResponse(201, {}, "delete successful")
    );  
});

const updateTask = asyncHandler(async (req: Request, res: Response) => {

     res.status(201).json(
        new ApiResponse(201, {}, "delete successful")
    );  
});


export {
    createTask,
    deleteTask,
    updateTask,
    getTasks,
    getTaskById 
}    