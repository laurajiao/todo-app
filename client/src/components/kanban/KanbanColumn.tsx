import type { Task, UpdateTaskDto } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { KanbanTaskCard } from "@/components/kanban/KanbanTaskCard";


type TaskStatus = Task["status"];

type Props = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onUpdate: (id: number, dto: UpdateTaskDto) => Promise<void> | void;
  onDelete: (id: number) => void;
};

const statusColor: Record<TaskStatus, string> = {
  NotStarted: "bg-slate-900/60",
  InProgress: "bg-blue-900/40",
  Completed: "bg-emerald-900/40",
  Cancelled: "bg-zinc-900/40",
  Overdue: "bg-red-900/40",
};

export function KanbanColumn({
  title,
  status,
  tasks,
  onUpdate,
  onDelete,
}: Props) {
  return (
    <Card
      className={`flex flex-col h-full ${statusColor[status]} border-slate-700`}
    >
      <CardHeader className="py-3 px-3 border-b border-slate-700/60">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <span>{title}</span>
          </CardTitle>
          <Badge variant="outline" className="text-[11px]">
            {tasks.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-2">
        <ScrollArea className="h-[520px] pr-2">
          {tasks.length === 0 ? (
            <div className="text-xs text-muted-foreground px-1 py-2">
              No tasks.
            </div>
          ) : (
            tasks.map((t) => (
              <KanbanTaskCard
                key={t.id}
                task={t}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
