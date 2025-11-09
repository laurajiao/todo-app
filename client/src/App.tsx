import {api} from "@/api";
import { useEffect, useState } from "react";
import type { Task, UpdateTaskDto,CreateTaskDto } from "@/types";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await api.listTasks();
      setTasks(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const update = async (id: number, patch: UpdateTaskDto) => {
    await api.updateTask(id, patch);
    await load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this task?")) return;
    await api.deleteTask(id);
    await load();
  };

  const create = async (dto: CreateTaskDto) => {
  await api.createTask(dto);
  await load();
};

  return (
    <div className="min-h-screen text-slate-50 p-10">
     

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      {!loading && !error && (
        <KanbanBoard tasks={tasks} onUpdate={update} onDelete={remove} onCreate={create} />
      )}
    </div>
  );
}

export default App;
