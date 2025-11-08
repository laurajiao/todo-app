import { useState } from "react";
import type { Task, UpdateTaskDto } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditTaskDialog } from "@/components/kanban/EditTaskDialog";

function daysRemaining(deadline?: string | null) {
  if (!deadline) return null;
  const end = new Date(deadline).getTime();
  return Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
}

function isOverdue(task: Task) {
  if (task.status === "Overdue") return true;
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

  const handleSave = async (patch: UpdateTaskDto) => {
    await onUpdate(task.id, patch);
  };

  return (
    <>
      <Card className="mb-2 shadow-sm hover:shadow-md transition">
        <CardContent className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div
                className={
                  "font-semibold text-sm " +
                  (overdue ? "text-destructive" : "")
                }
              >
                {task.title}
              </div>
              {task.description && (
                <div className="text-xs text-muted-foreground line-clamp-2">
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

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
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
              Days: {dleft === null ? "—" : dleft}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditTaskDialog
        task={task}
        open={open}
        onOpenChange={setOpen}
        onSave={handleSave}
      />
    </>
  );
}
