"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProjectService } from "@/services/project_management/projectService";
import { Project } from "@/types/project";
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
import { formatDate } from "./ProjectOverview";


export default function EditProjectModal({
  setOpenEdit,
  project,
  setLoading,
  loading,
}: {
  setOpenEdit: Dispatch<SetStateAction<boolean>>;
  project: Project;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}) {
  const [form, setForm] = useState({
    status: project.status || "PENDING",
    budget: String(project.budget ?? 0),
  });

  const [onProcess, setOnProcess] = useState(false);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/^(\d*\.\d{0,2}).*$/, "$1");
    setForm((prev) => ({ ...prev, budget: filtered }));
    console.log(project)
  };

  async function handleSubmit() {
    setOnProcess(true);
    setLoading(true);
    try {
      await ProjectService.update(project.id, {
        start_date: project.start_date,
        end_date: project.end_date,
        status: form.status,
        budget: parseFloat(form.budget) || 0,
      });
      toast.success("Project updated successfully!");
      setOpenEdit(false);
    } catch (err) {
      toast.error(`Failed to update project: ${err}`);
    } finally {
      setOnProcess(false);
      setLoading(false);
    }
  }

  function formatDateForInput(dateString?: string) {
    if (!dateString) return "";
    return dateString.split("T")[0]; 
    }

  return (
    <Dialog open={true} onOpenChange={setOpenEdit}>
      <DialogContent className="max-w-lg bg-white rounded-2xl p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Edit Project — {project.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          <div>
            <Label className="text-gray-700 font-medium">Project Name</Label>
            <Input value={project.name} disabled className="bg-gray-100" />
          </div>

          <div>
            <Label className="text-gray-700 font-medium">Description</Label>
            <Input value={project.description} disabled className="bg-gray-100" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-gray-700 font-medium">Start Date</Label>
              <Input type="date" value={formatDateForInput(project.start_date)} disabled className="bg-gray-100" />
            </div>
            <div>
              <Label className="text-gray-700 font-medium">End Date</Label>
              <Input type="date" value={formatDateForInput(project.end_date)} disabled className="bg-gray-100" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
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

            <div>
              <Label className="text-gray-700 font-medium">Budget</Label>
              <Input
                name="budget"
                value={form.budget}
                placeholder="₱ Project budget"
                onChange={handleBudgetChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpenEdit(false)} disabled={onProcess}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={onProcess}
              className="!bg-green-900 text-white hover:opacity-90"
            >
              {onProcess ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
