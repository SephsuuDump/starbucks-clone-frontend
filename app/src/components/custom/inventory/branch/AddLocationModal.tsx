"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { ModalButton } from "@/components/ui/button";
import { BranchService } from "@/services/Inventory/BranchService";
import { WarehouseService } from "@/services/Inventory/WarehouseService";
import { ProcurementHeader } from "../../procurement/Header";

export default function AddLocationModal({
  setOpenAdd,
  reload,
  type,
}: {
  setOpenAdd: Dispatch<SetStateAction<boolean>>;
  reload: () => void;
  type: string; 
}) {
  const [onProcess, setProcess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    image: null as File | null,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, files } = e.target;

    if (name === "image" && files) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setProcess(true);

    try {
      if (!form.name || !form.location) {
        toast.error("Please fill in all fields");
        return;
      }

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("location", form.location);
      if (form.image) formData.append("image", form.image);

      console.log(formData)

      let data: any = null;
      if (type.toLowerCase() === "branch") {
        data = await BranchService.create(formData);
      } else if (type.toLowerCase() === "warehouse") {
        data = await WarehouseService.create(formData);
      }

      if (data) {
        toast.success(`Created new ${type} successfully`);
        reload?.(); 
        setOpenAdd(false);
      }
    } catch (error) {
      toast.error(`Failed to create ${type}`);
    } finally {
      setProcess(false);
    }
  }

  return (
    <Dialog open onOpenChange={setOpenAdd}>
      <DialogContent className="rounded-xl shadow-xl">
        <DialogTitle>
          <ProcurementHeader label={`Add ${type.charAt(0).toUpperCase() + type.slice(1)}`} />
        </DialogTitle>

        <form className="flex flex-col gap-3 mt-3 px-2" onSubmit={handleSubmit}>
          <h1 className="text-sm font-bold ms-1">{`${type.charAt(0).toUpperCase() + type.slice(1)} Name:`}</h1>
          <Input
            name="name"
            placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} Name`}
            value={form.name}
            onChange={handleChange}
          />

          <h1 className="text-sm font-bold ms-1">{`${type.charAt(0).toUpperCase() + type.slice(1)} Location:`}</h1>
          <Input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <h1 className="text-sm font-bold ms-1">{`${type.charAt(0).toUpperCase() + type.slice(1)} Image:`}</h1>
          <Input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />


          <ModalButton
            type="submit"
            className="!bg-green-900 mt-3"
            label={`Add ${type}`}
            loadingLabel={`Creating ${type}...`}
            onProcess={onProcess}
            icon={Plus}
            onClick={handleSubmit}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
