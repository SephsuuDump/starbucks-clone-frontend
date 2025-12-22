'use client'

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResourceAllocationPayload } from "@/types/ResourceAllocation";
import { ResourceAllocationService } from "@/services/project_management/ResourceAllocationService";
import { toast } from "sonner";

export default function ResourceAllocationForm({
  projectId,
  onAdded,
}: {
  projectId: number | string;
  onAdded?: () => void;
}) {
  const [form, setForm] = useState<ResourceAllocationPayload>({
    project_id: Number(projectId),
    task_id: 0,
    resource_id: 0,
    quantity: 0,
    allocated_cost: 0,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: Number(value),
    }));
  };

  async function handleSubmit() {
    try {
      await ResourceAllocationService.create(form);
      toast.success("Allocation added");
      onAdded?.();
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
      <div className="grid grid-cols-5 gap-3">
        <Input type="number" name="task_id" placeholder="Task ID" value={form.task_id} onChange={handleChange} />
        <Input type="number" name="resource_id" placeholder="Resource ID" value={form.resource_id} onChange={handleChange} />
        <Input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
        <Input type="number" name="allocated_cost" placeholder="Allocated Cost" value={form.allocated_cost} onChange={handleChange} />
        <Button onClick={handleSubmit} className="!bg-green-900 text-white">Add Allocation</Button>
      </div>
    </div>
  );
}
