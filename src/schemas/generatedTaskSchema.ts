import { z } from "zod";

const SubtaskSchema = z.object({
  title: z.string(),
  content: z.string(),
  subtasks: z.array(
    z.object({
      title: z.string(),
      content: z.string()
    })
  ).optional()
});

export const TaskSchema = z.object({
  title: z.string(),
  content: z.string(),
  subtasks: z.array(SubtaskSchema).optional()
});

export type TaskData = z.infer<typeof TaskSchema>;
