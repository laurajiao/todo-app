import { useState } from "react";
import type { Task, UpdateTaskDto } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskDialog } from "@/components/kanban/EditTaskDialog";

function daysRemaining(deadline?: string | null) {
  if (!deadline) return null;
  const end = new Date(deadline).getTime();
  return Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
}

function isOverdue(task: Task) {
  const d = daysRemaining(task.dueDate);
  return (
    d !== null &&
    d < 0 &&
    task.status !== "Completed" &&
    task.status !== "Cancelled"
  );
}

type Props = {
  task: Task;
  onUpdate: (id: number, dto: UpdateTaskDto) => Promise<void> | void;
  onDelete: (id: number) => void;
};

export function KanbanTaskCard({ task, onUpdate, onDelete }: Props) {
  const overdue = isOverdue(task);
  const dleft = daysRemaining(task.dueDate);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardContent className="px-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div
                className={
                  "font-semibold text " +
                  (overdue ? "text-destructive" : "")
                }
              >
                {task.title}
                {overdue && (
                  <span className="ml-2 text-xs text-red-500">Overdue</span>
                )}
              </div>
              {task.description && (
                <div className="mt-2 text-sm line-clamp-2">
                  {task.description}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                #{task.id}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <div>
              Deadline:{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString("en-AU", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "—"}
            </div>
            <div className={overdue ? "text-destructive font-semibold" : ""}>
              Days: {dleft === null ? "-" : dleft}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              className="cursor-pointer"
              size="sm"
              variant="outline"
              onClick={() => setOpen(true)}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="cursor-pointer"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <TaskDialog
        mode="edit"
        task={task}
        open={open}
        onOpenChange={setOpen}
        onSave={(dto) => onUpdate(task.id, dto)}
      />
    </>
  );
}
