"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ResourceService } from "@/services/project_management/ResourceService";
import { toast } from "sonner";

export function AddResourceModal({
  open,
  setOpen,
  projectId,
  setLoading,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectId: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [form, setForm] = useState({
    type: "",
    name: "",
    cost_per_unit: "",
    unit: "",
    availability: "",
  });

  const [onProcess, setOnProcess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (["cost_per_unit", "availability"].includes(name)) {
      const filtered = value
        .replace(/[^\d.]/g, "")
        .replace(/^(\d*\.\d{0,2}).*$/, "$1");
      setForm((prev) => ({ ...prev, [name]: filtered }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOnProcess(true);
    setLoading(true);

    try {
      await ResourceService.create({
        type: form.type.toUpperCase(),
        name: form.name,
        cost_per_unit: parseFloat(form.cost_per_unit) || 0,
        unit: form.unit,
        availability: parseFloat(form.availability) || 0,
        project_id: projectId,
      });

      toast.success("Resource added successfully!");
      setOpen(false);
    } catch (err) {
      toast.error(`Failed to add resource: ${err}`);
    } finally {
      setOnProcess(false);
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg bg-white rounded-2xl p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Add Resource
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label className="text-gray-700 font-medium">Type</Label>
            <Input
              name="type"
              placeholder="e.g., MATERIAL, EQUIPMENT, LABOR"
              value={form.type}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-gray-700 font-medium">Name</Label>
            <Input
              name="name"
              placeholder="Resource name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-gray-700 font-medium">Cost Per Unit</Label>
              <Input
                name="cost_per_unit"
                placeholder="e.g., 250.00"
                value={form.cost_per_unit}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-gray-700 font-medium">Unit</Label>
              <Input
                name="unit"
                placeholder="e.g., bag, meter, hour"
                value={form.unit}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-gray-700 font-medium">Availability</Label>
            <Input
              name="availability"
              placeholder="e.g., 100"
              value={form.availability}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={onProcess}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={onProcess}
              className="!bg-green-900 text-white hover:opacity-90"
            >
              {onProcess ? "Saving..." : "Save Resource"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
