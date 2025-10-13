"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProjectService } from "@/services/project_management/projectService";
import { ProjectPayload } from "@/types/project";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateProjectModal({
  setOpenAdd,
  name,
  id,
  setLoading,
  loading,
}: {
  setOpenAdd: Dispatch<SetStateAction<boolean>>;
  name: string;
  id: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}) {
  const [form, setForm] = useState<{
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    budget: string; // ✅ now string
  }>({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "PENDING",
    budget: "",
  });

  const [onProcess, setOnProcess] = useState(false);

  // ✅ Handles normal input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "budget") {
      // allow only digits and one decimal with up to 2 decimal places
      const filtered = value
        .replace(/[^\d.]/g, "") // remove non-digit and non-dot
        .replace(/^(\d*\.\d{0,2}).*$/, "$1"); // restrict to 2 decimal places

      // prevent multiple dots
      if ((filtered.match(/\./g) || []).length > 1) return;

      setForm((prev) => ({ ...prev, [name]: filtered }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOnProcess(true);
    setLoading(true);

    if (!form.name || !form.start_date || !form.end_date) {
      toast.error("Please fill in required fields.");
      setOnProcess(false);
      setLoading(false);
      return;
    }

    try {
      const payload: ProjectPayload = {
        name: form.name,
        description: form.description,
        start_date: form.start_date,
        end_date: form.end_date,
        status: form.status || "PENDING",
        budget: parseFloat(form.budget) || 0, // ✅ safely convert back to number
      };

      await ProjectService.create(payload);
      toast.success("Project created successfully!");
      setOpenAdd(false);
    } catch (err) {
      toast.error(`Failed to create project: ${err}`);
    } finally {
      setOnProcess(false);
      setLoading(false);
    }
  }

  return (
    <Dialog open={true} onOpenChange={setOpenAdd}>
      <DialogContent className="max-w-lg bg-white rounded-2xl p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label className="text-gray-700 font-medium">Project Name</Label>
            <Input
              name="name"
              placeholder="Enter project name"
              onChange={handleChange}
              value={form.name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-gray-700 font-medium">Description</Label>
            <Input
              name="description"
              placeholder="Brief description"
              onChange={handleChange}
              value={form.description}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-gray-700 font-medium">Start Date</Label>
              <Input
                type="date"
                name="start_date"
                onChange={handleChange}
                value={form.start_date}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-gray-700 font-medium">End Date</Label>
              <Input
                type="date"
                name="end_date"
                onChange={handleChange}
                value={form.end_date}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-gray-700 font-medium">Status</Label>
              <Select
                onValueChange={(val) => setForm((prev) => ({ ...prev, status: val }))}
                defaultValue={form.status}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="APPROVED">APPROVED</SelectItem>
                    <SelectItem value="ONGOING">ONGOING</SelectItem>
                    <SelectItem value="DONE">DONE</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-gray-700 font-medium">Budget</Label>
              <Input
                name="budget"
                placeholder="₱ Project budget"
                onChange={handleChange}
                value={form.budget}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpenAdd(false)}
              disabled={onProcess}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={onProcess}
              className="!bg-green-900 text-white hover:opacity-90"
            >
              {onProcess ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
