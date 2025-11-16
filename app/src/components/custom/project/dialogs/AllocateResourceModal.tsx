"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ResourceService } from "@/services/project_management/ResourceService";
import { ResourceAllocationService } from "@/services/project_management/ResourceAllocationService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AllocateResourceModal({
  open,
  setOpen,
  task,
  projectId,
  reload
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  task: any;
  projectId: string;
  reload: () => void;
}) {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [qty, setQty] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [process, setProcess] = useState(false);

  async function loadResources() {
    setLoading(true);
    const res = await ResourceService.getByProject(projectId);
    setResources(res || []);
    setLoading(false);
  }

  useEffect(() => {
    if (open) loadResources();
  }, [open]);

  function updateCost(resourceId: string, quantity: number) {
    const res = resources.find((r) => r.id === resourceId);
    if (!res) return setCost(0);
    setCost(Number(quantity) * Number(res.cost_per_unit || 0));
  }

  async function handleAllocate() {
    if (!selected || qty <= 0) {
      toast.error("Select a resource and enter quantity");
      return;
    }

    try {
      await ResourceAllocationService.create({
        task_id: task.id,
        resource_id: selected,
        quantity: qty,
        allocated_cost: cost
      });

      toast.success("Resource allocated!");
      reload();
      setOpen(false);
      setSelected("");
      setQty(0);
      setCost(0);
    } catch (err: any) {
      toast.error(err?.message || "Failed to allocate resource");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogTitle>Allocate Resources — {task?.name}</DialogTitle>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-bold">Select Resource</label>
              <select
                className="w-full px-3 py-2 border rounded-lg"
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value);
                  updateCost(e.target.value, qty);
                }}
              >
                <option value="">Select Resource</option>
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.availability} {r.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold">Quantity</label>
              <Input
                type="number"
                placeholder="Quantity"
                value={qty}
                onChange={(e) => {
                  const q = Number(e.target.value);
                  setQty(q);
                  updateCost(selected, q);
                }}
              />
            </div>

            <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <p className="text-sm">Allocated Cost:</p>
              <p className="font-bold text-lg">₱ {cost.toLocaleString()}</p>
            </div>

            <Button
              className="w-full bg-green-700 text-white"
              disabled={process}
              onClick={async () => {
                setProcess(true);
                await handleAllocate();
                setProcess(false);
              }}
            >
              {process ? "Saving..." : "Allocate"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
