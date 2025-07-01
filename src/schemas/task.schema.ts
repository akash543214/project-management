import { z } from 'zod';

export const CreateTaskSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title must be at least 1 characters long")
      .max(100, "Title must be less than 100 characters"),

    content: z.string().trim().optional().nullable(),

    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),

    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),

    deadline: z.coerce.date().optional().nullable(),

    parent_task_id: z.number().optional().nullable(),

    subtasks: z.array(CreateTaskSchema).optional().nullable(),
  })
);

export const UpdateTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title must be at least 1 characters long")
        .max(100, "Title must be less than 100 characters").optional(),
    
    content: z
        .string()
        .trim()
         .optional()
        .nullable().optional(),
    
     status:z.enum(["PENDING","IN_PROGRESS","COMPLETED"]).optional(),

     priority:z.enum(["LOW","MEDIUM","HIGH","URGENT"]).optional(),

     deadline:z.coerce.date().optional().nullable(),
     parent_task_id:z.number().optional().nullable()

}).refine((data) => data.title || data.content || data.status || data.priority || data.deadline || data.parent_task_id, {
    message: "At least one field must be provided"
});