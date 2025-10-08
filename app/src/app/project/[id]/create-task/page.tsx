'use client'

import { useParams } from "next/navigation";
import TaskForm from "@/components/custom/project/TaskForm";
import { ProcurementHeader } from "@/components/custom/procurement/Header";

export default function CreateTaskPage() {
  const { id } = useParams();
  return (
    <div className="flex flex-col gap-6">
      <ProcurementHeader label="Create Task" />
      <TaskForm projectId={String(id)} />
    </div>
  );
}
