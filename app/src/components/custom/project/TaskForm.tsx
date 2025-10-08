'use client'

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Task, TaskPayload } from "@/types/Tasks";
import { TaskService } from "@/services/project_management/TaskService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TaskForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial?: Task;
}) {
  const router = useRouter();
  const [form, setForm] = useState<TaskPayload>({
    project_id: projectId,
    name: "",
    description: "",
    start_date: "",
    expected_date: "",
    end_date: "",
    employee_id: "20d5fc1e-6402-4fbb-9e58-3dab35d96628",
    status: "PLANNED",
    progress: 0,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        project_id: initial.project_id,
        name: initial.name,
        description: initial.description,
        start_date: initial.start_date || "",
        expected_date: initial.expected_date || "",
        end_date: initial.end_date || "",
        employee_id: initial.employee_id,
        status: initial.status,
        progress: initial.progress ?? 0,
      });
    }
  }, [initial]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "employee_id" || name === "progress" ? Number(value) : value,
    }));
  };

  async function handleSubmit() {
    try {
      if (initial?.id) {
        await TaskService.update(initial.id, form);
        toast.success("Task updated");
      } else {
        await TaskService.create(form);
        toast.success("Task created");
      }
      router.push(`/project/${projectId}`);
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto space-y-4">
      <Input name="name" placeholder="Task Name" value={form.name} onChange={handleChange} />
      <Input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <div className="grid grid-cols-3 gap-3">
        <Input type="date" name="start_date" value={form.start_date} onChange={handleChange} />
        <Input type="date" name="expected_date" value={form.expected_date} onChange={handleChange} />
        <Input type="date" name="end_date" value={form.end_date} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Input type="number" name="employee_id" placeholder="Employee ID" value={form.employee_id} onChange={handleChange} />
        <Input name="status" placeholder="Status (PLANNED/IN_PROGRESS/COMPLETED)" value={form.status} onChange={handleChange} />
        <Input type="number" name="progress" placeholder="Progress %" value={form.progress} onChange={handleChange} />
      </div>
      <Button onClick={handleSubmit} className="!bg-green-900 text-white">Save Task</Button>
    </div>
  );
}
