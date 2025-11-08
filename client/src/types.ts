export const TaskStatus = {
  NotStarted: "NotStarted",
  InProgress: "InProgress",
  Completed: "Completed",
  Cancelled: "Cancelled",
  Overdue: "Overdue",
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

export type UpdateTaskDto = Partial<CreateTaskDto>;