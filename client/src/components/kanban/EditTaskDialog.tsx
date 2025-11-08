import { useEffect, useState } from "react";
import type { Task, UpdateTaskDto } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type EditTaskDialogProps = {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (patch: UpdateTaskDto) => Promise<void> | void;
};

function toLocalInputValue(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onSave,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [deadlineInput, setDeadlineInput] = useState(toLocalInputValue(task.dueDate));
  const [status, setStatus] = useState(task.status);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setDeadlineInput(toLocalInputValue(task.dueDate));
      setStatus(task.status);
    }
  }, [open, task]);

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert("Title is required");
      return;
    }

    const patch: UpdateTaskDto = {
      title: trimmedTitle,
      description: description.trim() || undefined,
      dueDate: deadlineInput
        ? (() => {
          const date = new Date(deadlineInput);
          date.setHours(0, 0, 0, 0);
          return date.toISOString();
        })()
        : undefined,
      status,
    };

    try {
      setSaving(true);
      await onSave(patch);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit task #{task.id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: any) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={deadlineInput}
              onChange={(e: any) => setDeadlineInput(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as Task['status'])}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NotStarted">Not Started</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
