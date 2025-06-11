import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import ApiError from '../utils/apiError';
import { z } from "zod";
//import { UserPayload } from '../types/common';
import { prisma } from '../lib/prisma';
import { CreateTaskSchema } from '../schemas/task.schema';
import { UpdateTaskSchema } from '../schemas/task.schema';
type CreateTaskRequest = z.infer<typeof CreateTaskSchema>;
type UpdateTaskRequest = z.infer<typeof UpdateTaskSchema>;

const createTask = asyncHandler(async (req: Request<{}, {}, CreateTaskRequest>, res: Response) => {

      const projectId = Number(req.query.id);

           if(!projectId)
          {
           throw new ApiError("No project Id provided",401);
          }

        const {title,content,priority,status,deadline} = req.body;

         const task = await prisma.task.create(
           { 
            data: 
            {
            title:title,
            content:content,
            priority:priority,
            status:status,
            deadline:deadline,
            project_id:projectId
           },
        }
       );

     res.status(201).json(
        new ApiResponse(201,task, "update successful")
    );  
});


const getTopLevelTasks = asyncHandler(async (req: Request, res: Response) => {


  const projectId = Number(req.params.projectId);

  const tasks = await prisma.task.findMany({
    where: {
      project_id: projectId,
      parent_task_id: null,
    },
  });

  res.json(new ApiResponse(200, tasks, "Top-level tasks fetched"));
});

const getTaskById = asyncHandler(async (req: Request, res: Response) => {

     res.status(201).json(
        new ApiResponse(201, {}, "task fetched successfuly")
    );  
});

const getTopTasksWithChildren = asyncHandler(async (req: Request, res: Response) => {


  const projectId = Number(req.params.projectId);

  const tasks = await prisma.task.findMany({
    where: {
      project_id: projectId,
      parent_task_id: null,
    },
    include: {
      subtasks: {
        orderBy: { created_at: 'asc' },
      },
    },
    orderBy: { created_at: 'desc' },
  });

  res.json(new ApiResponse(200, tasks, "Top-level tasks with children fetched"));
});

const getTasksWithAllSubtasks = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Number(req.params.projectId);

  const tasks = await prisma.task.findMany({
    where: {
      project_id: projectId,
      parent_task_id: null,
    },
    include: {
      subtasks: {
        include: {
          subtasks: true, // 2-level deep
        },
      },
    },
  });

  res.json(new ApiResponse(200, tasks, "Tasks with all nested subtasks fetched"));
});


const deleteTask = asyncHandler(async (req: Request, res: Response) => {


const taskId = Number(req.params.id);
        
    if(!taskId)
    {
     throw new ApiError("No project Id provided",401);
    }

    const deletedTask = await prisma.task.delete({

     where: {
    id: taskId,
  },
    })
     res.status(201).json(
        new ApiResponse(201,deletedTask, "delete successful")
    );  
});

const updateTask = asyncHandler(async (req: Request<{}, {}, UpdateTaskRequest>, res: Response) => {

      const taskId = Number(req.query.id);
        const updateData  = req.body;
         
         if(!taskId)
        {
         throw new ApiError("No task Id provided",401);
        }
    
            const updatedTask = await prisma.task.update({
             where: {
              id: taskId,
             },
              data: updateData,
            })
    
     res.status(201).json(
        new ApiResponse(201,updatedTask, "delete successful")
    );  
});

export {
    createTask,
    deleteTask,
    updateTask,
    getTopLevelTasks,
    getTaskById,
    getTopTasksWithChildren,
    getTasksWithAllSubtasks 
}    