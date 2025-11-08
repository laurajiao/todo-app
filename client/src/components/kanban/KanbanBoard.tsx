import type { Task, UpdateTaskDto } from "@/types";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";

type TaskStatus = Task["status"];

type Props = {
  tasks: Task[];
  onUpdate: (id: number, dto: UpdateTaskDto) => Promise<void> | void;
  onDelete: (id: number) => void;
};

function groupByStatus(tasks: Task[]) {
  const map: Record<TaskStatus, Task[]> = {
    NotStarted: [],
    InProgress: [],
    Completed: [],
    Cancelled: [],
    Overdue: [],
  };

  for (const t of tasks) {
    if (map[t.status]) {
      map[t.status].push(t);
    }
  }

  return map;
}

export function KanbanBoard({ tasks, onUpdate, onDelete }: Props) {
  const grouped = groupByStatus(tasks);

  return (
    <div className="flex gap-4 overflow-x-auto py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 min-w-full">
        <KanbanColumn
          title="Not Started"
          status="NotStarted"
          tasks={grouped.NotStarted}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        <KanbanColumn
          title="In Progress"
          status="InProgress"
          tasks={grouped.InProgress}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        <KanbanColumn
          title="Completed"
          status="Completed"
          tasks={grouped.Completed}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        <KanbanColumn
          title="Cancelled"
          status="Cancelled"
          tasks={grouped.Cancelled}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        <KanbanColumn
          title="Overdue"
          status="Overdue"
          tasks={grouped.Overdue}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
