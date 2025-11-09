import { useState } from "react"
import type { Task, UpdateTaskDto, CreateTaskDto } from "@/types"
import { KanbanColumn } from "@/components/kanban/KanbanColumn"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskDialog } from "@/components/kanban/EditTaskDialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { DndContext } from "@dnd-kit/core"
import type { DragEndEvent } from "@dnd-kit/core"


type TaskStatus = Task["status"]

type Props = {
  tasks: Task[]
  onUpdate: (id: number, dto: UpdateTaskDto) => Promise<void> | void
  onDelete: (id: number) => void
  onCreate: (dto: CreateTaskDto) => Promise<void> | void
}

function groupByStatus(tasks: Task[]) {
  const map: Record<TaskStatus, Task[]> = {
    NotStarted: [],
    InProgress: [],
    Completed: [],
    Cancelled: [],
  }
  for (const t of tasks) {
    if (map[t.status]) map[t.status].push(t)
  }
  return map
}

export function KanbanBoard({ tasks, onUpdate, onDelete, onCreate }: Props) {
  const grouped = groupByStatus(tasks)
  const [createOpen, setCreateOpen] = useState(false)
  const [filter, setFilter] = useState<TaskStatus | "All">("All");

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event
    if (!over) return
    const newStatus = over.id as Task["status"]
    const taskId = parseInt(active.id as string)
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.status !== newStatus) {
      onUpdate(taskId, { status: newStatus })
    }
  }

  const totalTasks = tasks.length
  const completedTasks = grouped.Completed.length
  const notStarted = grouped.NotStarted.length
  const inProgress = grouped.InProgress.length
  const cancelled = grouped.Cancelled.length
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter)

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-xl font-semibold text-gray-900">Task Board</h2>
          <div className="flex items-center gap-4">
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value as TaskStatus | "All")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="NotStarted">Not Started</SelectItem>
                <SelectItem value="InProgress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4" /> Create Task
            </Button>
          </div>
        </div>

        <div className="mt-8 bg-gray-100 rounded-xl p-4 text-gray-800">
          <h3 className="text-lg font-semibold mb-2">Task Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>Total Tasks: <span className="font-medium">{totalTasks}</span></div>
            <div>Completed: <span className="font-medium">{completedTasks}</span></div>
            <div>Not Started: <span className="font-medium">{notStarted}</span></div>
            <div>In Progress: <span className="font-medium">{inProgress}</span></div>
            <div>Cancelled: <span className="font-medium">{cancelled}</span></div>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            Completion Rate: <span className="font-semibold">{completionRate}%</span>
          </p>
        </div>

        {filter === "All" ? (
          <div className="flex overflow-x-auto py-4 h-full">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
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
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 py-4">
            {filteredTasks.map((task) => (
              <KanbanColumn
                key={task.id}
                title={task.status}
                status={task.status}
                tasks={[task]}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}

        <TaskDialog
          mode="create"
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSave={(dto) => onCreate(dto)}
        />
      </div>
    </DndContext>
  )
}
