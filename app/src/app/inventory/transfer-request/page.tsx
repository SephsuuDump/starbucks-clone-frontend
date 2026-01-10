"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash, CalendarIcon, PlusCircle } from "lucide-react";


import { Warehouse } from "@/types/Warehouse";
import { WarehouseService } from "@/services/Inventory/WarehouseService";
import { toast } from "sonner";
import { InventoryItemService } from "@/services/Inventory/InventoryItemService";
import { InventoryItems } from "@/types/InventoryItem";
import { TransferService } from "@/services/Inventory/TransferService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { useAuth } from "@/hooks/use-auth";
import { BranchService } from "@/services/Inventory/BranchService";
import { Branch } from "@/types/Branch";

export default function BranchTransferRequest() {
  const { claims, loading } = useAuth();

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState<string>("");
  const [cart, setCart] = useState<any[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItems[]>([]);
  const [expectedDate, setExpectedDate] = useState<Date | undefined>(undefined);
  const [branch, setBranch] = useState<Branch | null>(null);

  const branchId = claims.branchId!;
  const router = useRouter();

  useEffect(() => {
    async function getAllWarehouseAndItem() {
      try {
        const data = await WarehouseService.getAll();
        const res = await InventoryItemService.getInventoryItems(
          1,
          999,
          "",
          "az"
        );
        setWarehouses(data);
        setInventoryItems(res.data);
      } catch (err) {
        toast.error(`${err}`);
      }
    }
    getAllWarehouseAndItem();
  }, []);

  useEffect(() => {
    async function getBranch() {
      if (!claims?.branchId) return;
      try {
        const data = await BranchService.getById(claims.branchId);
        setBranch(data);
      } catch (err) {
        toast.error(`${err}`);
      }
    }
    getBranch();
  }, [claims?.branchId]);

  const availableItems = inventoryItems.filter(
    (i) => !cart.find((c) => c.id === i.skuid)
  );

  const availableWarehouses = claims?.warehouseId
    ? warehouses.filter((w) => w.id !== claims.warehouseId)
    : warehouses;

  const handleAdd = () => {
    if (!selectedItem || !quantity) return;
    const item = inventoryItems.find((i) => i.skuid === selectedItem);
    if (!item) return;

    setCart((prev) => [
      { id: item.skuid, name: item.name, qty: quantity },
      ...prev,
    ]);

    setSelectedItem("");
    setQuantity("");
  };

  const handleRemove = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const toggleEdit = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedWarehouse || cart.length === 0) {
      toast.error("Please select a warehouse and add at least one item.");
      return;
    }

    const toWarehouse = claims.warehouseId ?? null;
    const toBranch = claims.branchId ?? null;

    if (!toWarehouse && !toBranch) {
      toast.error("Invalid destination: no branch or warehouse found.");
      return;
    }

    const data = {
      from_warehouse: selectedWarehouse,
      to_warehouse: toWarehouse,
      to_branch: toBranch,
      expected_arrival: expectedDate,
      items: cart.map((item) => ({
        inventory_item_id: String(item.id),
        qty: Number(item.qty),
      })),
    };

    try {
      const body = await TransferService.create(data);
      if (body) {
        const warehouse = warehouses.find((w) => w.id === selectedWarehouse);
        toast.success(
          `Transfer request from warehouse ${
            warehouse ? warehouse.name : "unknown"
          } has been sent.`
        );
      }
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      router.push("/inventory/list-transfer");
      setReviewOpen(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white p-8 flex flex-col gap-8">
     <div className="flex items-center justify-between">
      <ProcurementHeader label="Request Transfer" />

      <Button
        variant="outline"
        className="rounded-xl"
        onClick={() => router.push("/inventory")}
      >
        Back to Inventory
      </Button>
    </div>


      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-gray-600 font-medium">
            From Warehouse
          </label>
          <select
            className="border border-gray-300 px-3 py-2 rounded-xl text-sm bg-white hover:border-gray-400 transition"
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
          >
            <option value="">Select Warehouse</option>
            {availableWarehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="border-gray-300 hover:border-gray-400 text-gray-700 bg-white rounded-xl px-4 py-2 text-sm"
            >
              <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
              {expectedDate
                ? format(expectedDate, "PPP")
                : "Pick Expected Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 shadow-lg border rounded-xl">
            <Calendar
              mode="single"
              selected={expectedDate}
              onSelect={setExpectedDate}
              disabled={(date) => date <= new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <select
          className="border border-gray-300 py-2 px-3 rounded-xl w-64 text-sm bg-white hover:border-gray-400 transition"
          value={selectedItem}
          disabled={availableItems.length === 0}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          <option value="">Select Item</option>
          {availableItems.map((i) => (
            <option key={i.skuid} value={i.skuid}>
              {i.name}
            </option>
          ))}
        </select>

        <Input
          type="text"
          placeholder="Quantity"
          value={quantity}
          disabled={!selectedItem}
          onChange={(e) => {
            if (/^[0-9]*$/.test(e.target.value)) {
              setQuantity(e.target.value);
            }
          }}
          className="w-32"
        />

        <Button
          className="bg-green-700 hover:bg-green-800 text-white rounded-xl px-5 py-2.5 font-medium flex items-center gap-2"
          onClick={handleAdd}
        >
          <PlusCircle className="w-4 h-4" /> Add
        </Button>
      </div>

      <div className="mt-2">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            No items added yet — add inventory items above.
          </p>
        ) : (
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-4 bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-3 border-b">
              <div>SKUID</div>
              <div>Item Name</div>
              <div>Quantity</div>
              <div className="text-center">Actions</div>
            </div>

            {cart.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-4 items-center px-4 py-3 border-b text-sm bg-white hover:bg-gray-50 transition"
              >
                <span className="truncate text-gray-700 font-mono text-xs">
                  {item.id}
                </span>
                <span className="text-gray-800 font-medium">
                  {item.name}
                </span>
                {item.isEditing ? (
                  <Input
                    type="text"
                    className="w-20 h-8 text-center text-sm"
                    value={item.qty}
                    onChange={(e) => {
                      if (/^[0-9]*$/.test(e.target.value)) {
                        item.qty = e.target.value;
                        setCart([...cart]);
                      }
                    }}
                  />
                ) : (
                  <span className="text-gray-700">{item.qty}</span>
                )}
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-xs rounded-lg flex items-center gap-1"
                    onClick={() => toggleEdit(item.id)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {item.isEditing ? "Done" : "Edit"}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs rounded-lg flex items-center gap-1"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash className="w-3.5 h-3.5" /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          className="bg-green-700 hover:bg-green-800 text-white rounded-xl px-5 py-2.5 font-medium"
          disabled={cart.length === 0 || !selectedWarehouse}
          onClick={() => setReviewOpen(true)}
        >
          Review Transfer
        </Button>
      </div>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-lg rounded-2xl shadow-xl">
          <DialogTitle>
            <ProcurementHeader label="Transfer Receipt" />
          </DialogTitle>

          <div className="space-y-5 mt-3 text-sm">
           <div className="border-b pb-3 text-gray-700">
              {claims.branchId ? (
                <p>
                  <strong>To Branch:</strong>{" "}
                  {branch?.name ?? "N/A"}
                </p>
              ) : (
                <p>
                  <strong>To Warehouse:</strong>{" "}
                  {warehouses.find((w) => w.id === claims.warehouseId)?.name ?? "N/A"}
                </p>
              )}

              <p>
                <strong>Expected Arrival:</strong>{" "}
                {expectedDate ? format(expectedDate, "PPP") : "N/A"}
              </p>

              <p>
                <strong>From Warehouse:</strong>{" "}
                {warehouses.find((w) => w.id === selectedWarehouse)?.name}
              </p>
            </div>


            <div>
              <h3 className="font-semibold mb-2">Requested Items</h3>
              <div className="border rounded-xl overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-100 px-3 py-2 font-semibold text-gray-700 text-xs">
                  <div>SKUID</div>
                  <div>Item Name</div>
                  <div className="text-right">Quantity</div>
                </div>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-3 px-3 py-2 border-t text-gray-700 text-xs"
                  >
                    <div className="truncate">{item.id}</div>
                    <div>{item.name}</div>
                    <div className="text-right">{item.qty}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-2 font-medium text-gray-700">
              <span>Total Items</span>
              <span>{cart.length}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-600 rounded-xl px-4"
              onClick={() => setReviewOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800 text-white rounded-xl px-5"
              onClick={handleSubmit}
            >
              Confirm Transfer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
