"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ModalButton } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { hasEmptyField } from "@/lib/utils";
import { ProcurementHeader } from "../procurement/Header";
import { InventoryItemService } from "@/services/Inventory/InventoryItemService";
import { InventoryItems } from "@/types/InventoryItem";

export function EditInventory({
  setOpenEdit,
  skuid,
  setLoading
}: {
  setOpenEdit: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  skuid: string;
}) {
  const [onProcess, setProcess] = useState(false);
  const [costInput, setCostInput] = useState("");
  const [stockInput, setStockInput] = useState("");
  const [item, setItem] = useState<Partial<InventoryItems>>({
    skuid : skuid,
    name: "",
    category: "",
    unit_measurement: "",
    cost: 0,
    required_stock : 0,
    description: "",
  });

 useEffect(() => {
  async function findBySkuid(skuid: string) {
    const res = await InventoryItemService.findBySkuid(skuid);
    setItem(res);
    setCostInput(res.cost?.toString() ?? "");
    setStockInput(res.required_stock?.toString() ?? "");
  }

  findBySkuid(skuid);
}, [skuid]);


  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      skuid : skuid,
      [name]: name === "cost" || name === "required_stock" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setProcess(true);

  try {
    const updatedItem = {
      ...item,
      cost: costInput ? Number(parseFloat(costInput).toFixed(2)): 0.00,
      required_stock: stockInput ? Number(parseFloat(stockInput).toFixed(2)) : 0.00,
    };

    if (hasEmptyField(updatedItem)) {
      toast.error("PLEASE FILL UP ALL FIELDS");
      setProcess(false);
      return;
    }

    const data = await InventoryItemService.updateInventory(skuid, updatedItem);
    if (data) {
      toast.success("INVENTORY ITEM UPDATED SUCCESSFULLY");
      setLoading(true);
      setOpenEdit(false);
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : String(error));
  } finally {
    setProcess(false);
  }
}


  return (
    <Dialog open onOpenChange={setOpenEdit}>
      <DialogContent>
        <DialogTitle>
          <ProcurementHeader label="Edit Inventory Item" />
        </DialogTitle>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            name="name"
            onChange={handleChange}
            className="tracking-wider"
            placeholder="Item Name"
            value={item.name ?? ""}
          />
          <Input
            name="category"
            onChange={handleChange}
            className="tracking-wider"
            placeholder="Category"
            value={item.category ?? ""}
          />
          <Input
            name="unit_measurement"
            onChange={handleChange}
            className="tracking-wider"
            placeholder="Unit Measurement (e.g., pcs, kg, box)"
            value={item.unit_measurement ?? ""}
          />
          <div className="flex items-center border border-gray-200 rounded-md shadow-xs">
            <div className="w-10 text-center">₱</div>
            <Input
            name="cost"
            value={costInput}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                setCostInput(value);
              } else {
                toast.error("Only numbers and a single dot are allowed");
              }
            }}
            placeholder="Cost"
          />
          </div>
          <Input
            name="required_stock"
            value={stockInput}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "" ||  /^[0-9]*\.?[0-9]*$/.test(value)) {
                setStockInput(value);
              } else {
                toast.error("Only whole numbers are allowed");
              }
            }}
            placeholder="Required Stock"
          />
          <Input
            name="description"
            onChange={handleChange}
            className="tracking-wider"
            placeholder="Description"
            value={item.description ?? ""}
          />

          <ModalButton
            type="submit"
            className="!bg-green-900"
            label="Update Item"
            loadingLabel="Updating Item"
            onProcess={onProcess}
            icon={Plus}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
