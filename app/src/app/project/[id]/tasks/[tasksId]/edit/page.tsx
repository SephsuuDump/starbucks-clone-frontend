'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TaskForm from "@/components/custom/project/TaskForm";
import { Task } from "@/types/Tasks";
import { TaskService } from "@/services/project_management/TaskService";
import { toast } from "sonner";
import { ProcurementHeader } from "@/components/custom/procurement/Header";

export default function EditTaskPage() {
  const { id, taskId } = useParams();
  const [task, setTask] = useState<Task>();

  useEffect(() => {
    async function load() {
      try {
        const res = await TaskService.getById(Number(taskId));
        setTask(res.data);
      } catch (e) {
        toast.error(`${e}`);
      }
    }
    load();
  }, [taskId]);

  return (
    <div className="flex flex-col gap-6">
      <ProcurementHeader label="Edit Task" />
      <TaskForm projectId={String(id)} initial={task} />
    </div>
  );
}
