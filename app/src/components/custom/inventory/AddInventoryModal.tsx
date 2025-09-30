'use client'

import { useEffect, useState } from "react";
import { InventoryService } from "@/services/Inventory/InventoryService";
import { Inventory } from "@/types/Inventory";
import { Button, ModalButton } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { InventoryItemService } from "@/services/Inventory/InventoryItemService";
import { Plus } from "lucide-react";

interface AddInventoryModalProps {
  id: string; // branch id
  open: boolean;
  setOpen: (open: boolean) => void;
  currentInventory: Inventory[]; // still used but not relied on
  setLoading: (loading: boolean) => void;
}

export function AddInventoryModal({ id, open, setOpen, currentInventory, setLoading }: AddInventoryModalProps) {
    const [items, setItems] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("");
    const [loadingItems, setLoadingItems] = useState(false);
    const [creating, setCreating] = useState(false);
    const [onProcess, setProcess] = useState(false);
    async function fetchAllBranchInventory(branch_id: string) {
        let page = 1;
        const limit = 1000; 
        const all: Inventory[] = [];

        while (true) {
        const res = await InventoryService.getByBranch(branch_id, page, limit);
        if (res.data.length === 0) break;
        all.push(...res.data);
        if (res.data.length < limit) break;
        page++;
        }

        return all;
    }

    const handleQuantityChange = (value: string) => {
        if (value === "") {
        setQuantity("");
        return;
        }

        const isWholeNumber = /^[0-9]+$/.test(value);

        if (isWholeNumber) {
        setQuantity(value);
        } else {
        toast.error("Please input whole number only");
        }
    };

    useEffect(() => {
        async function fetchItems() {
        try {
            setLoadingItems(true);
            const allInventoryItems = await InventoryItemService.getInventoryItems(1, 9999, "", "asc");
            const branchInventory = await fetchAllBranchInventory(id);
            const existingSkuids = branchInventory.map(inv => inv.inventory_item.skuid);

            const filtered = allInventoryItems.data.filter(
            (item: any) => !existingSkuids.includes(item.skuid)
            );

            setItems(filtered);
        } catch (e) {
            toast.error(`Failed to load inventory items: ${e}`);
        } finally {
            setLoadingItems(false);
        }
        }

        if (open) {
        fetchItems();
        setSelectedItem("");
        setQuantity("");
        }
    }, [open, id]);

    const handleSubmit = async () => {
        if (!selectedItem) {
        toast.error("Please select an inventory item");
        return;
        }

        try {
        setCreating(true);
        setLoading(true);

        const body: any = {
            inventory_item_id: selectedItem,
            qty: parseInt(quantity),
            warehouse_id: null,
            branch_id: id,
        };

        console.log("📦 Payload:", body);
        await InventoryService.createInventory(body);

        toast.success("Inventory item added successfully");
        setOpen(false);
        } catch (e) {
        toast.error(`Failed to add inventory: ${e}`);
        } finally {
        setCreating(false);
        setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4 mt-3">
            <select
                className="border border-gray-300 rounded-lg p-2"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                disabled={loadingItems || creating}
            >
                <option value="">Select an item</option>
                {items.map(item => (
                <option key={item.skuid} value={item.skuid}>
                    {item.name} ({item.unit_measurement})
                </option>
                ))}
            </select>

                <input
                type="text"
                className="border border-gray-300 rounded-lg p-2"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                disabled={creating}
            />

                <ModalButton
                    type="submit"
                    className="!bg-green-900"
                    label="Add quantity"
                    loadingLabel="Adding quantity"
                    onProcess = {onProcess}
                    icon={Plus}
                    onClick={handleSubmit}
            />
            </div>
        </DialogContent>
        </Dialog>
    );
}
