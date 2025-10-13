"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProjectService } from "@/services/project_management/projectService";
import { ProcurementHeader } from "../procurement/Header";

export default function DeleteProjectModal({
  setOpenDelete,
  name,
  id,
  setLoading,
  loading,
}: {
  setOpenDelete: Dispatch<SetStateAction<boolean>>;
  name: string;
  id: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}) {
  const [onProcess, setOnProcess] = useState(false);

  async function handleDelete() {
    setOnProcess(true);
    setLoading(true);

    try {
      await ProjectService.deleteById(id);
      toast.success(`Project "${name}" deleted successfully.`);
      setOpenDelete(false);
    } catch (err) {
      toast.error(`Failed to delete project: ${err}`);
    } finally {
      setOnProcess(false);
      setLoading(false);
    }
  }

  return (
    <Dialog open={true} onOpenChange={setOpenDelete}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-6 shadow-lg">
        <DialogTitle className="text-lg font-semibold text-gray-800 mb-4">
          <ProcurementHeader label="Delete Project"/>
        </DialogTitle>

        <p className="text-gray-600 mb-4">
          Are you sure you want to delete <b>{name}</b>? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => setOpenDelete(false)}
            disabled={onProcess}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={onProcess}
            className="!bg-red-600 text-white hover:opacity-90"
          >
            {onProcess ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
