'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Project } from "@/types/project";
import { ProjectService } from "@/services/project_management/projectService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProcurementHeader } from "@/components/custom/procurement/Header";

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "",
    budget: 0,
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await ProjectService.getById(String(id));
        setProject(data);
        setForm({
          name: data.name,
          description: data.description,
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status,
          budget: data.budget,
        });
      } catch (e) {
        toast.error(`Failed to load project`);
      }
    }
    load();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "budget" ? Number(value) : value,
    }));
  };

  async function handleSubmit() {
    try {
      await ProjectService.update(String(id), form);
      toast.success("Project updated successfully!");
      router.push("/project");
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading project details...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProcurementHeader label={`Edit Project: ${project.name}`} />
      <div className="bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto space-y-4">
        <Input
          name="name"
          placeholder="Project Name"
          value={form.name}
          onChange={handleChange}
        />
        <Input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <Input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
        />
        <Input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
        />
        <Input
          name="status"
          placeholder="Status"
          value={form.status}
          onChange={handleChange}
        />
        <Input
          type="number"
          name="budget"
          placeholder="Budget"
          value={form.budget}
          onChange={handleChange}
        />
        <Button onClick={handleSubmit} className="!bg-green-900 text-white">
          Update Project
        </Button>
      </div>
    </div>
  );
}
