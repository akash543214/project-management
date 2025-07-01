// types/user.ts
export type UserPayload = {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
};

export type ProjectData = {
   title: string; 
   description: string | null 
  };

  export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}
  export type TaskData = {
  title: string;
  content?: string;
  project_id?: number;
  owner_id?: number;
  parent_task_id?: number | null;
  assignee_id?: number | null;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: Date | string;
  created_at?: Date;
  subtasks?: TaskData[];
};
