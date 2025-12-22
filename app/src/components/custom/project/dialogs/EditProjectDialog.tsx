"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModalButton } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ProcurementHeader } from "../../procurement/Header";
import { Input } from "@/components/ui/input";
import { ProjectService } from "@/services/project_management/projectService";
import { ProjectResponse } from "@/types/project";

export default function EditProjectDialog({
  setOpenEdit,
  project,
  setLoading,
  loading,
  reload
}: {
  setOpenEdit: Dispatch<SetStateAction<boolean>>;
  project: ProjectResponse;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  reload?: () => void;
}) {
  const [form, setForm] = useState({
    name: project?.name || "",
    description: project?.description || "",
    end_date: project?.end_date?.slice(0, 10) || "", 
    budget: String(project?.budget || "")
  });

  const [onProcess, setProcess] = useState(false);
  const isBudgetLocked = project.status !== "PENDING_BUDGET";


  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setProcess(true);

    try {
      await ProjectService.update(project.id, {
        name: form.name,
        description: form.description,
        end_date: form.end_date || null,  
         ...(isBudgetLocked ? {} : { budget: Number(form.budget) || 0 })
      });

      toast.success("Project Updated!");
      setLoading(!loading);
      reload?.();
      setOpenEdit(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update project");
    } finally {
      setProcess(false);
    }
  }

  return (
    <Dialog open onOpenChange={setOpenEdit}>
      <DialogContent className="max-w-md">
        <DialogTitle>
          <ProcurementHeader label="Edit Project" />
        </DialogTitle>

        <div className="space-y-3 px-2">
          <div>
            <label className="text-sm font-medium">Project Name</label>
            <Input
              className="mt-1"
              placeholder="Project Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              className="mt-1"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Expected End</label>
            <Input
              type="date"
              className="mt-1"
              value={form.end_date}
              onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Budget</label>
            <Input
              type="number"
              className="mt-1"
              placeholder="Budget"
              value={form.budget}
              disabled={isBudgetLocked}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
          </div>
        </div>

        <ModalButton
          type="submit"
          icon={Plus}
          className="!bg-yellow-600"
          label="Save Changes"
          loadingLabel="Saving..."
          onProcess={onProcess}
          onClick={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
