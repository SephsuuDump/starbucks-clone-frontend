"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModalButton } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ProjectService } from "@/services/project_management/projectService";
import { ProjectResponse } from "@/types/project";
import { ProcurementHeader } from "@/features/procurement/components/Header";

export default function DeleteProjectDialog({
  setOpenDelete,
  project,
  setLoading,
  loading,
  reload
}: {
  setOpenDelete: Dispatch<SetStateAction<boolean>>;
  project: ProjectResponse;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  reload?: () => void;
}) {
  const [onProcess, setProcess] = useState(false);

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setProcess(true);

    try {
      await ProjectService.deleteById(project.id);

      toast.success("Project Deleted!");
      setLoading(!loading);
      reload?.();
      setOpenDelete(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete project");
    } finally {
      setProcess(false);
    }
  }

  return (
    <Dialog open onOpenChange={setOpenDelete}>
      <DialogContent>
        <DialogTitle>
          <ProcurementHeader label="Delete Project" />
        </DialogTitle>

        <p className="px-2">
          Do you want to delete project{" "}
          <span className="font-semibold">{project?.name}</span>?
        </p>

        <ModalButton
          type="submit"
          icon={Plus}
          className="!bg-red-700"
          label="Delete Project"
          loadingLabel="Deleting..."
          onProcess={onProcess}
          onClick={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
