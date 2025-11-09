export const TaskStatus = {
  NotStarted: "NotStarted",
  InProgress: "InProgress",
  Completed: "Completed",
  Cancelled: "Cancelled",
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];  

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate?: string; // ISO date string
    createdAt: string; // ISO date string
};

export interface CreateTaskDto {
    title: string;
    description?: string;
    status: TaskStatus;
    dueDate?: string; // ISO date string
};

export type UpdateTaskDto = {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
};
