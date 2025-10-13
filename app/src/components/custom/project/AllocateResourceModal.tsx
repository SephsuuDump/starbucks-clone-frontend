"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ResourceService } from "@/services/project_management/ResourceService";
import { TaskService } from "@/services/project_management/TaskService";
import { ResourceAllocationService } from "@/services/project_management/ResourceAllocationService";
import { toast } from "sonner";
import { Resource } from "@/types/Resource";
import { Task } from "@/types/Tasks";

export function AllocateResourceModal({
  open,
  setOpen,
  projectId,
  onAllocated,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectId: string;
  onAllocated?: () => void;
}) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState({
    task_id: "",
    resource_id: "",
    quantity: "",
    allocated_cost: 0,
  });
  const [onProcess, setOnProcess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await ResourceService.getByProject(projectId);
        const resourceList = Array.isArray(res) ? res : res.data || [];
        setResources(resourceList);

        const t = await TaskService.getAll({ project_id: projectId });
        setTasks(t.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load tasks or resources");
      }
    }
    if (projectId) loadData();
  }, [projectId]);

  const handleQuantityChange = (value: string) => {
    const filtered = value.replace(/[^\d.]/g, "").replace(/^(\d*\.\d{0,2}).*$/, "$1");
    setForm((prev) => ({ ...prev, quantity: filtered }));

    const selected = resources.find((r) => r.id === form.resource_id);
    if (selected) {
      const cost = parseFloat(filtered || "0") * selected.cost_per_unit;
      setForm((prev) => ({ ...prev, allocated_cost: cost }));
    }
  };

  async function handleSubmit() {
    if (!form.task_id || !form.resource_id || !form.quantity) {
      toast.error("Please fill in all fields.");
      return;
    }

    const selected = resources.find((r) => r.id === form.resource_id);
    if (!selected) {
      toast.error("Selected resource not found.");
      return;
    }

    const requested = parseFloat(form.quantity);
    if (requested > selected.availability) {
      toast.error(`Insufficient stock. Only ${selected.availability} ${selected.unit} available.`);
      return;
    }

    setOnProcess(true);
    try {
      const payload = {
        task_id: form.task_id,
        resource_id: form.resource_id,
        quantity: requested,
        allocated_cost: form.allocated_cost,
      };

      console.log("Allocating resource payload:", payload);

      const res = await ResourceAllocationService.create(payload);
      console.log("Allocation response:", res);

      toast.success("Resource successfully allocated!");
      setOpen(false);
      onAllocated?.();
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to allocate resource: ${err.message || err}`);
    } finally {
      setOnProcess(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg bg-white rounded-2xl p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Allocate Resource to Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-gray-700 font-medium">Select Task</Label>
            <Select
              onValueChange={(val) => setForm((prev) => ({ ...prev, task_id: val }))}
              defaultValue={form.task_id}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose task" />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Select Resource</Label>
            <Select
              onValueChange={(val) => {
                const resource = resources.find((r) => r.id === val);
                setForm((prev) => ({
                  ...prev,
                  resource_id: val,
                  allocated_cost:
                    resource && form.quantity
                      ? parseFloat(form.quantity) * resource.cost_per_unit
                      : 0,
                }));
              }}
              defaultValue={form.resource_id}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose resource" />
              </SelectTrigger>
              <SelectContent>
                {resources.map((res) => (
                  <SelectItem key={res.id} value={res.id}>
                    {res.name} — ₱{res.cost_per_unit}/ {res.unit} ({res.availability} available)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Quantity</Label>
            <Input
              name="quantity"
              placeholder="e.g., 10"
              value={form.quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Allocated Cost</Label>
            <Input value={`₱${form.allocated_cost.toFixed(2)}`} disabled />
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
              {onProcess ? "Allocating..." : "Allocate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
