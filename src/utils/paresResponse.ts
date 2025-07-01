import { TaskData } from "../types/common";
import { TaskStatus, TaskPriority } from "../types/common";


function cleanTask(task: any, depth = 0, flattened: TaskData[] = []): TaskData {
  const { title, content, subtasks } = task;

  const cleaned: TaskData = {
    title,
    content,
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    deadline: new Date(),
  };

  if (Array.isArray(subtasks)) {
    if (depth < 1) {
      // Allow 1 level of nesting (i.e., two levels total)
      cleaned.subtasks = subtasks.map(sub =>
        cleanTask(sub, depth + 1, flattened)
      );
    } else {
      
      // Flatten deeper levels
      subtasks.forEach(sub => {
        const flat = cleanTask(sub, 0, flattened); // reset depth for root-level
        flattened.push(flat);
      });
    }
  }

  return cleaned;
}
  
export function normalizeTaskData(result: any): TaskData[] {
  const raw = Array.isArray(result) ? result : [result];
  const final: TaskData[] = [];

  raw.forEach(task => {
    const flattened: TaskData[] = [];
    const cleaned = cleanTask(task, 0, flattened);
    final.push(cleaned, ...flattened);
  });

  return final;
}