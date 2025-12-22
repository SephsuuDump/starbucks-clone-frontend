"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProcurementHeader } from "@/components/custom/procurement/Header";
import { toast } from "sonner";
import { TaskService } from "@/services/project_management/TaskService";
import { useRouter } from "next/navigation";
import { TaskPayload } from "@/types/Tasks";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CreateTaskModal({
  open,
  setOpen,
  projectId,
  setLoading,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  projectId: string;
  setLoading?: Dispatch<SetStateAction<boolean>>;
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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "progress" ? Number(value) : value,
    }));
  };

    const handleStatusChange = (status: string) => {
        setForm((prev) => {
            let updated = { ...prev, status };

            if (status === "DONE") {
            updated.progress = 100;
            } else {
            updated.progress = 0; 
            updated.end_date = null as any;
            }

            return updated;
        });
    };


  async function handleSubmit() {
    try {
      const finalData = { ...form };
      console.log(finalData)
      if (form.status === "PLANNED" || form.status === "ONGOING") {
        finalData.end_date = null as any;
      }
      if (form.status === "DONE") {
        finalData.progress = 100;
      }

      await TaskService.create(finalData);
      toast.success("Task created successfully");

      if (setLoading) setLoading((p) => !p);
      setOpen(false);
      router.refresh();
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <div className="flex flex-col gap-6">
          <DialogTitle>
            <ProcurementHeader label="Create Task" />
          </DialogTitle>

          <div className="space-y-4">
            <Label className="text-gray-700 font-medium">Task Name</Label>
            <Input
              name="name"
              placeholder="Task Name"
              value={form.name}
              onChange={handleChange}
            />

            <Label className="text-gray-700 font-medium">Description</Label>
            <Input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Start Date
                </Label>
                <Input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Expected End Date
                </Label>
                <Input
                  type="date"
                  name="expected_date"
                  value={form.expected_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  End Date
                </Label>
                <Input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  disabled={form.status !== "DONE"}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Employee
                </Label>
                <Input
                  type="text"
                  name="employee_id"
                  placeholder="Employee ID"
                  value={form.employee_id}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2">Status</Label>
                <Select onValueChange={handleStatusChange} value={form.status}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="PLANNED">PLANNED</SelectItem>
                      <SelectItem value="ONGOING">ONGOING</SelectItem>
                      <SelectItem value="DONE">DONE</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700 font-medium mb-2">
                  Progress
                </Label>
                <Input
                  name="progress"
                  type="number"
                  placeholder="Progress %"
                  value={form.status === "DONE" ? 100 : form.progress}
                  onChange={handleChange}
                  disabled={form.status === "DONE"}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSubmit} className="!bg-green-900 text-white">
                Save Task
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
