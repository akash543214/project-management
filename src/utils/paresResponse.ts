
 enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

 enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}
type SimpleTask = {
  title: string;
  description: string;
  subtasks?: SimpleTask[];
  id?: number;
  project_id?: number;
  owner_id?: number;
  parent_task_id?: number | null;
  assignee_id?: number | null;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: Date | string;
};


  function cleanTask(task: any): SimpleTask {
    const { title, description, subtasks } = task;

    return {
      title,
      description,
      status:TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      deadline: new Date(),
      subtasks: subtasks?.map(cleanTask),
    };
  }
  
export function normalizeTaskData(result: any): SimpleTask[] {
  const raw = result;
  const tasks = Array.isArray(raw) ? raw : [raw];


  return tasks.map(cleanTask);
}
