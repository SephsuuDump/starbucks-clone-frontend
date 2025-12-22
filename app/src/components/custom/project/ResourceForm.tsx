'use client'

import { useEffect, useState } from "react";
import { Resource, ResourcePayload } from "@/types/Resource";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResourceService } from "@/services/project_management/ResourceService";
import { toast } from "sonner";

export default function ResourceForm({
  initial,
  onSaved,
}: {
  initial?: Resource;
  onSaved?: () => void;
}) {
  const [form, setForm] = useState<ResourcePayload>({
    type: "",
    name: "",
    cost_per_unit: 0,
    unit: "",
    availability: 0,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        type: initial.type,
        name: initial.name,
        cost_per_unit: initial.cost_per_unit,
        unit: initial.unit,
        availability: initial.availability,
      });
    }
  }, [initial]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "cost_per_unit" || name === "availability" ? Number(value) : value,
    }));
  };

  async function handleSubmit() {
    try {
      if (initial?.id) {
        await ResourceService.update(initial.id, form);
        toast.success("Resource updated");
      } else {
        await ResourceService.create(form);
        toast.success("Resource created");
      }
      onSaved?.();
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <Input name="type" placeholder="Type (HUMAN/MATERIAL/FINANCIAL)" value={form.type} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Input name="unit" placeholder="Unit (e.g., hr, pc, PHP)" value={form.unit} onChange={handleChange} />
        <Input type="number" name="cost_per_unit" placeholder="Cost/Unit" value={form.cost_per_unit} onChange={handleChange} />
        <Input type="number" name="availability" placeholder="Availability" value={form.availability} onChange={handleChange} />
      </div>
      <Button onClick={handleSubmit} className="!bg-green-900 text-white">Save Resource</Button>
    </div>
  );
}
