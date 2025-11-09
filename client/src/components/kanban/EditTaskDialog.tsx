import { useEffect, useState } from "react";
import type { Task, CreateTaskDto, UpdateTaskDto } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TaskDialogProps =
  | {
    mode: "create";
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: CreateTaskDto) => Promise<void> | void;
    task?: never;
  }
  | {
    mode: "edit";
    task: Task;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: UpdateTaskDto) => Promise<void> | void;
  };

function toLocalInputValue(iso?: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function TaskDialog(props: TaskDialogProps) {
  if (props.mode === "edit") {
    const { task, open, onOpenChange, onSave } = props;
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? "");
    const [deadlineInput, setDeadlineInput] = useState(toLocalInputValue(task.dueDate));
    const [status, setStatus] = useState<Task["status"]>(task.status);
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
      const updateData: UpdateTaskDto = {
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
        await onSave(updateData);
        onOpenChange(false);
      } finally {
        setSaving(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task #{task.id}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadlineInput}
                onChange={(e) => setDeadlineInput(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Task["status"])}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NotStarted">Not Started</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving} className="cursor-pointer">
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  } else {
    const { open, onOpenChange, onSave } = props;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadlineInput, setDeadlineInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<Task["status"]>("NotStarted");


    const handleSave = async () => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        alert("Title is required");
        return;
      }
      const createData: CreateTaskDto = {
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
        console.log("Creating task with data:", createData);
        await onSave(createData);
        onOpenChange(false);
      } catch (err) {
      } finally {
        setSaving(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadlineInput}
                onChange={(e) => setDeadlineInput(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Task["status"])}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NotStarted">Not Started</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving} className="cursor-pointer">
              {saving ? "Saving..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
