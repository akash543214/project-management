import { z } from 'zod';

export const CreateProjectSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title must be at least 1 characters long")
        .max(100, "Title must be less than 100 characters"),
    
    description: z
        .string()
        .trim()
         .optional()
        .nullable(),
    
});