"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ModalButton } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { hasEmptyField } from "@/lib/utils";
import { ProcurementHeader } from "../procurement/Header";
import { InventoryItemService } from "@/services/Inventory/InventoryItemService";

export function AddInventory({setOpen }: {
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
      const [onProcess, setProcess] = useState(false);
  const [item, setItem] = useState<any>({
    name: "",
    cost: 0,
    category: "",
    unit_measurement: "",
    description: "",
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setProcess(true);

      if (hasEmptyField(item) || item.cost === 0) {
        toast.error("PLEASE FILL UP ALL FIELDS");
        return;
      }

      const data = await InventoryItemService.createInventoryItem(item);

      if (data) toast.success("INVENTORY ITEM ADDED SUCCESSFULLY");
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setProcess(false);
      setOpen(false);
    }
  }

  return (
    <Dialog open onOpenChange={setOpen}>
    <DialogContent>
        <DialogTitle>
        <ProcurementHeader label="Add Inventory Item" />
        </DialogTitle>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <Input
            onChange={(e) =>
            setItem((prev: any) => ({ ...prev, name: e.target.value }))
            }
            className="tracking-wider"
            placeholder="Item Name"
        />
        <Input
            onChange={(e) =>
            setItem((prev: any) => ({ ...prev, category: e.target.value }))
            }
            className="tracking-wider"
            placeholder="Category"
        />
        <Input
            onChange={(e) =>
            setItem((prev: any) => ({
                ...prev,
                unit_measurement: e.target.value,
            }))
            }
            className="tracking-wider"
            placeholder="Unit Measurement (e.g., pcs, kg, box)"
        />
        <div className="flex items-center border border-gray-200 rounded-md shadow-xs">
            <div className="w-10 text-center">₱</div>
            <Input
            onChange={(e) =>
                setItem((prev: any) => ({
                ...prev,
                cost: Number(e.target.value),
                }))
            }
            type="number"
            className="tracking-wider border-0 shadow-none"
            placeholder="Cost"
            />
        </div>
        <Input
            onChange={(e) =>
            setItem((prev: any) => ({
                ...prev,
                description: e.target.value,
            }))
            }
            className="tracking-wider"
            placeholder="Description"
        />

        <ModalButton
            type="submit"
            className="!bg-green-900"
            label="Add Item"
            loadingLabel="Adding Item"
            onProcess={onProcess}
            icon={Plus}
        />
        </form>
    </DialogContent>
    </Dialog>
  );
}