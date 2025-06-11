import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import ApiError from '../utils/apiError';
import { z } from "zod";
import { prisma } from '../lib/prisma';
import { UserPayload } from '../types/common';
import { CreateProjectSchema } from '../schemas/project.schema';
import { ProjectData } from '../types/common';

type CreateProjectRequest = z.infer<typeof CreateProjectSchema>;


const getAllProjects = asyncHandler(async (req: Request, res: Response) => {

const user = req.user as UserPayload;

const projects = await prisma.project.findMany({

  where: {
    user_id: user.id,
  },
   });
     res.status(201).json(
        new ApiResponse(201,projects, "projects fetched successfully")
    );  
});

const getProjectsById = asyncHandler(async (req: Request, res: Response) => {

    const projectId = Number(req.params.id);
        
    if(!projectId)
    {
     throw new ApiError("No project Id provided",401);
    }


    const project = await prisma.project.findUnique({
      where: {
     id: projectId,
  },
    });

     res.status(201).json(
        new ApiResponse(201, project, "project fetched successfully")
    );  
});

const createProject = asyncHandler(async (req: Request<{}, {}, CreateProjectRequest>, res: Response) => {

    const user = req.user as UserPayload;
    const { title, description }  = req.body;

        const project = await prisma.project.create(
           { 
            data: 
            {
            title:title,
            description:description,
            user_id:user.id
           },
        }
       );

     res.status(200).json(
        new ApiResponse(201, project, "project created successful"));  
});


const deleteProject = asyncHandler(async (req: Request, res: Response) => {

        
    const projectId = Number(req.query.id);
        
    if(!projectId)
    {
     throw new ApiError("No project Id provided",401);
    }

    const deleteProject = await prisma.project.delete({

     where: {
    id: projectId,
  },
    })

     res.status(201).json(
        new ApiResponse(201,deleteProject, "delete successful")
    );  
});


const updateProject = asyncHandler(async (req: Request<{}, {}, CreateProjectRequest>, res: Response) => {

    const projectId = Number(req.query.id);
    const updateData  = req.body;
     
     if(!projectId)
    {
     throw new ApiError("No project Id provided",401);
    }

        const updateProject = await prisma.project.update({
         where: {
          id: projectId,
         },
          data: updateData,
        })

     res.status(201).json(
        new ApiResponse(200,updateProject, "delete successful")
    );  
});


export {
    createProject,
    deleteProject,
    updateProject,
    getAllProjects,
    getProjectsById 
}    