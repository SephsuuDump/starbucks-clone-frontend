"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModalButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ProcurementHeader } from "../procurement/Header";
import { BranchService } from "@/services/Inventory/BranchService";
import { WarehouseService } from "@/services/Inventory/WarehouseService";


export default function LocationUpdateModal({
  setOpenEdit,
  name,
  location,
  id,
  setLoading,
  loading,
  type,
  reload
}: {
  setOpenEdit: Dispatch<SetStateAction<boolean>>;
  name: string;
  location: string;
  id: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  type: string; 
  reload?: () => void;
}) {
  const [onProcess, setProcess] = useState(false);
  const [form, setForm] = useState({
    name: name || "",
    location: location || "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setProcess(true);

    try {
      let data: any = null;
      if (type.toLowerCase() === "branch") {
        data = await BranchService.update(form, id);
      } else if (type.toLowerCase() === "warehouse") {
        data = await WarehouseService.update(id, form);
      }
      if (data) {
        toast.success("Updated Location for " + form.name);
        setLoading(!loading);
        setOpenEdit(false);
        reload?.();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(errorMessage);
    } finally {
      setProcess(false);
    }
  }

  return (
    <Dialog open onOpenChange={setOpenEdit}>
      <DialogContent>
        <DialogTitle>
          <ProcurementHeader label="Update Location" />
        </DialogTitle>
        <div className="flex flex-col gap-3 px-2">
          <h1 className="text-sm font-bold ms-1">Branch Name: </h1>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter name"
            className="mb-1"
          />
          <h1 className="text-sm font-bold ms-1">Branch Location: </h1>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter location"
          />
        </div>
        <ModalButton
          type="submit"
          className="!bg-green-900"
          label="Update"
          loadingLabel="Updating..."
          onProcess={onProcess}
          icon={Plus}
          onClick={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
