
import type { CreateTaskDto, Task, UpdateTaskDto } from "./types";

const BASE = import.meta.env.VITE_API_BASE as string;

async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
    if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
    return response.json() as Promise<T>;
}

export const api = {
    listTasks: () => http<Task[]>(`${BASE}/tasks`),
    createTask: (dto: CreateTaskDto) =>
        http<Task>(`${BASE}/tasks`, {
            method: "POST",
            body: JSON.stringify(dto),
}),
    updateTask: (id: number, dto: UpdateTaskDto) =>
        http<Task>(`${BASE}/tasks/${id}`, {
            method: "PUT", 
            body: JSON.stringify(dto),
}),
    deleteTask: (id: number) => 
        fetch(`${BASE}/tasks/${id}`, {
            method: "DELETE",
}).then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }),
};