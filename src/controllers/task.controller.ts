import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/apiResponse';
import ApiError from '../utils/apiError';
import { z } from "zod";
import { UserPayload } from '../types/common';
import { prisma } from '../lib/prisma';
import { CreateTaskSchema } from '../schemas/task.schema';
import { UpdateTaskSchema } from '../schemas/task.schema';
import { TaskSchema } from '../schemas/generatedTaskSchema';
import {instructor} from '../utils/grogClient';
import { normalizeTaskData } from '../utils/paresResponse';
import { TaskData } from '../types/common';

type CreateTaskRequest = z.infer<typeof CreateTaskSchema>;
type UpdateTaskRequest = z.infer<typeof UpdateTaskSchema>;
async function insertTaskTree(task:TaskData,
   projectId:number, 
   ownerId:number, 
   parentId:number|null = null)
    {
  // Create the current task
  console.log(task);
  const created = await prisma.task.create({
    data: {
      title: task.title,
      content: task.content,
      priority: task.priority,
      status: task.status,
      deadline: task.deadline ? new Date(task.deadline) : null,
      project_id: projectId,
      owner_id: ownerId,
      parent_task_id: parentId,
    },
  });

  // If subtasks exist, insert them in parallel
  if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
    await Promise.all(
      task.subtasks.map((subtask) =>
        insertTaskTree(subtask, projectId, ownerId, created.id)
      )
    );
  }
}

const createTask = asyncHandler(async (req: Request<{ projectId: string }, {}, CreateTaskRequest>, res: Response) => {

      const projectId = Number(req.params.projectId);
        const user = req.user as UserPayload;

           if(!projectId)
          {
           throw new ApiError("No project Id provided",401);
          }

          const project = await prisma.project.findFirst({
               where: { id: projectId, user_id: user.id },
                 });

          if (!project) {
          throw new ApiError("Project not found or access denied", 404);
            }

           const parent_task_id = req.body.parent_task_id ? Number(req.body.parent_task_id) : null;
        console.log(req.body);
        await insertTaskTree(req.body as TaskData,
        projectId,
        user.id,
        parent_task_id)
              
     res.status(200).json(
        new ApiResponse(200,{}, "Task created successfully")
    );  
});

//fetch all tasks with project id, no subtasks
const getTopLevelTasks = asyncHandler(async (req: Request, res: Response) => {


  const projectId = Number(req.params.projectId);

   if(!projectId || isNaN(projectId))
    {
     throw new ApiError("Invalid project Id provided",401);
    }


  const tasks = await prisma.task.findMany({
    where: {
      project_id: projectId,
      parent_task_id: null,
    },
  });

  res.json(new ApiResponse(200, tasks, "Top-level tasks fetched"));
});

//fetch single task with task id
const getTaskById = asyncHandler(async (req: Request, res: Response) => {
      const user = req.user as UserPayload;
    const taskId = Number(req.params.taskId);

     if(!taskId || isNaN(taskId))
    {
     throw new ApiError("Invalid task Id provided",401);
    }

    const task = await prisma.task.findUnique({
    where: {
      id: taskId,
      owner_id:user.id
    },
  });
     res.status(200).json(
        new ApiResponse(200, task, "task fetched successfuly")
    );  
});

//get task and first level subtasks with project id
const getTopTasksWithChildren = asyncHandler(async (req: Request, res: Response) => {


  const projectId = Number(req.params.projectId);
  const user = req.user as UserPayload;


 if(!projectId || isNaN(projectId))
    {
     throw new ApiError("Invalid task Id provided",401);
    }


  const tasks = await prisma.task.findMany({
    where: {
      project_id: projectId,
      parent_task_id: null,
      owner_id:user.id
    },
    include: {
      subtasks: {
        orderBy: { created_at: 'asc' },
      },
    },
  });

  res.json(new ApiResponse(200, tasks, "Top-level tasks with children fetched"));
});

//get whole task tree using project id
const getTasksWithAllSubtasks = asyncHandler(async (req: Request, res: Response) => {

  const projectId = Number(req.params.projectId);
   const user = req.user as UserPayload;

     if(!projectId || isNaN(projectId))
    {
     throw new ApiError("Invalid project Id provided",401);
    }


      const project = await prisma.project.findFirst({
        where: { id: projectId, user_id: user.id },
        });

    if (!project) {
     throw new ApiError("Project not found or access denied", 404); 
    }

  const tasks = await prisma.task.findMany({
    where: {
    project_id: projectId,
    parent_task_id: null,
    owner_id: user.id,
  },
  include: {
    subtasks: {
      include: {
        subtasks: {
          orderBy: { created_at: 'asc' }, // Order 2nd-level subtasks
        },
      },
      orderBy: { created_at: 'asc' }, // Order 1st-level subtasks
    },
  },
  orderBy: { created_at: 'asc' },
  });


  res.json(new ApiResponse(200, tasks, "Tasks with all nested subtasks fetched"));
});

//get all subtasks of a task using task id
const getAllSubtasks = asyncHandler(async (req: Request, res: Response) => {

    const taskId = Number(req.params.taskId);
    const user = req.user as UserPayload;

     if(!taskId || isNaN(taskId))
    {
     throw new ApiError("Invalid task Id provided",401);
    }

  const tasks = await prisma.task.findMany({
    where: {
      parent_task_id: taskId,
      owner_id:user.id
    },
     include: {
      subtasks: {
        orderBy: { created_at: 'asc' },
      },
  }});

  res.json(new ApiResponse(200, tasks, "Tasks fetched"));

});

   //fetch first level subtasks of a task using task id
const getFirstLevelSubtasks = asyncHandler(async (req: Request, res: Response) => {

  const taskId = Number(req.params.taskId);
   const user = req.user as UserPayload;

   if(!taskId || isNaN(taskId))
    {
     throw new ApiError("Invalid task Id provided",401);
    }

  const tasks = await prisma.task.findMany({
    where: {
      parent_task_id: taskId,
      owner_id:user.id
    },
  });

  res.json(new ApiResponse(200, tasks, "Tasks fetched"));
});

const deleteTask = asyncHandler(async (req: Request, res: Response) => {


        const taskId = Number(req.params.taskId);
         const user = req.user as UserPayload;

    if(!taskId)
    {
     throw new ApiError("Invalid task Id provided",401);
    }

    const deletedTask = await prisma.task.delete({

     where: {
    id: taskId,
    owner_id:user.id
  },
    })
     res.status(201).json(
        new ApiResponse(201,deletedTask, "delete successful")
    );  
});

const updateTask = asyncHandler(async (req: Request<{ taskId: string }, {}, UpdateTaskRequest>, 
  res: Response) => {

     const taskId = Number(req.params.taskId);
      const updateData = req.body;
      const user = req.user as UserPayload;
          
  if (!taskId) {
    throw new ApiError("Invalid task ID provided", 400);
  }

  //if (existingTask.assignee_id !== user.id) {
   // throw new ApiError("Not authorized to update this task", 403);
  //}
           const updatedTask = await prisma.task.update({
             where: {
              id: taskId,
              owner_id:user.id
             },
              data: updateData,
            })
    
     res.status(200).json(
        new ApiResponse(200,updatedTask, "update successful")
    );  
});

const generateTask = asyncHandler(async (req: Request, res: Response) => {

    const { prompt } = req.body;

    const SYSTEM_PROMPT = `You are a project task generator. Return a JSON object with array of tasks.
Each task should have the following structure:
                          - title: short and clear
                          - description: what to do
                          - subtasks: max 2 levels deep
                          No IDs, dates, priority, or status.`;

  if (!prompt) {
    return res.status(400).json({ error: "Missing 'prompt' in request body" });
  }

  
    const result = await instructor.chat.completions.create({
      model: "llama-3.3-70b-versatile", 
      response_model: {
        name: "Task",
        schema: TaskSchema,
      },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      max_retries: 2,
    });

    const parsedTasks = normalizeTaskData(result);

    res.status(201).json(
        new ApiResponse(201,parsedTasks, "AI generation successful")
    );  

});


export {
    createTask,
    deleteTask,
    updateTask,
    getTopLevelTasks,
    getTaskById,
    getTopTasksWithChildren,
    getTasksWithAllSubtasks,
    getAllSubtasks,
    getFirstLevelSubtasks,
    generateTask
}    