'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProjectService } from "@/services/project_management/projectService";
import { useRouter } from "next/navigation";
import { ProcurementHeader } from "@/components/custom/procurement/Header";

export default function CreateProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "",
    budget: 0,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit() {
    try {
      await ProjectService.create(form);
      toast.success("Project created successfully!");
      router.push("/project");
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ProcurementHeader label="Create New Project" />
      <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto space-y-4">
        <Input name="name" placeholder="Project Name" onChange={handleChange} />
        <Input name="description" placeholder="Description" onChange={handleChange} />
        <Input type="date" name="start_date" onChange={handleChange} />
        <Input type="date" name="end_date" onChange={handleChange} />
        <Input name="status" placeholder="Status" onChange={handleChange} />
        <Input type="number" name="budget" placeholder="Budget" onChange={handleChange} />
        <Button onClick={handleSubmit} className="!bg-green-900 text-white">Save</Button>
      </div>
    </div>
  );
}
