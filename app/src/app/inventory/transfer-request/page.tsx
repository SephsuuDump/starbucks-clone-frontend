"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {Pencil,Trash} from "lucide-react";
import { ProcurementHeader } from "@/components/custom/procurement/Header";
import { Warehouse } from "@/types/Warehouse";
import { WarehouseService } from "@/services/Inventory/WarehouseService";
import { toast } from "sonner";
import { InventoryItemService } from "@/services/Inventory/InventoryItemService";
import { InventoryItems } from "@/types/InventoryItem";
import { TransferService } from "@/services/Inventory/TransferService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar";

export default function BranchTransferRequest() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState<string>("");
  const [cart, setCart] = useState<any[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [warehouses, setWarehouses]  =  useState<Warehouse[]>([])
  const [inventoryItems, setInventoryItems]  =  useState<InventoryItems[]>([])
  const [expectedDate, setExpectedDate] = useState<Date | undefined>(undefined);


  const branchId = "7e42ef23-002b-4d39-8d12-9101bbaf2385"

  useEffect(() => {
    async function getAllWarehouseAndItem() {
        try {
            const data = await WarehouseService.getAll()
            const res = await InventoryItemService.getInventoryItems(1, 999, '', 'az')
            setWarehouses(data);
            setInventoryItems(res.data)
        } catch(err) {
            toast.error(`${err}`)
        }   
    };

    getAllWarehouseAndItem();
  }, [])

  const availableItems = inventoryItems.filter(
    (i) => !cart.find((c) => c.id === i.skuid)
  );

  const handleAdd = () => {
    if (!selectedItem || !quantity) return;

    const item = inventoryItems.find((i) => i.skuid === selectedItem);
    if (!item) return;

    setCart((prev) => [
      ...prev,
      { id: item.skuid, name: item.name, qty: quantity },
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
    if(!selectedWarehouse && cart.length === 0 ) {
        toast.error('Please make sure that you selected a warehouse and atleast one item.')
        return;
    }


    const data = {
        from_warehouse : selectedWarehouse,
        to_warehouse : null,
        to_branch : branchId.trim(),
        expected_arrival : expectedDate,
        items : cart.map(item => ({
            inventory_item_id : String(item.id),
            qty : Number(item.qty)
        }))

    };

    console.log(JSON.stringify(data))

    try {
        const body = await TransferService.create(data);
        if (body) {
            const warehouse = warehouses.find(w => w.id === selectedWarehouse);
            toast.success(`Transfer request from warehouse ${warehouse ? warehouse.name :'unknown'} is sent.`)
        }
    } catch(err) {
        toast.error(`${err}`)
    }
  }


  return (
    <>
        <ProcurementHeader label="Request Transfer" />
        <div className="flex flex-col gap-6 p-6 mt-5 bg-white shadow-md rounded-xl">
            <div className="flex gap-3 items-center">
                <h3 className="font-light text-sm">To warehouse: </h3>
                <select
                    className="border px-2 py-1 rounded-lg text-gray-500 font-light text-sm"
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    >
                    <option value="" className="text-sm text-black">Select Warehouse</option>
                    {warehouses.map((w) => (
                        <option key={w.id} value={w.id} className="text-black text-sm">
                        {w.name}
                    </option>
                    ))}
                </select>

            </div>

            <div className="flex justify-between">
                <div  className="flex gap-4 items-center">
                     <select
                    className="border py-2 px rounded-md w-60 text-sm disabled:text-gray-500"
                    value={selectedItem}
                    disabled={availableItems.length === 0}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    
                    >
                    <option value="" className="">Select Item</option>
                    {availableItems.map((i) => (
                        <option key={i.skuid} value={i.skuid} className="">
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

                    <Button className="!bg-green-900 text-white" onClick={handleAdd}>
                    + Add
                 </Button>
                </div>
                 <div  className="flex gap-4 items-center">
                   <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant="outline"
                        className="w-50 justify-start text-left font-normal"
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expectedDate ? format(expectedDate, "PPP") : "Pick Expected Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={expectedDate}
                        onSelect={setExpectedDate}
                        />
                    </PopoverContent>
                    </Popover>

                </div>
               
            </div>


            <div className="grid mt-4">
                {cart.length === 0 && (
                    <p className="text-gray-500 text-sm">No items added yet</p>
                )}
                {cart.length > 0 && (
                    <div className="grid grid-cols-4 items-center bg-white px-4 py-2 mb-2 text-sm font-bold">
                    <div>Skuid:</div>
                    <div>Name:</div>
                    <div>Requested Quantity:</div>
                    <div>Actions</div>
                    </div>
                )}
                {cart.map((item) => (
                    <div
                    key={item.id}
                    className="grid grid-cols-4 items-center bg-white rounded-md px-4 py-2 shadow-sm border text-sm"
                    >
                    <span className="text-xs font-mono text-gray-600 truncate">
                        {item.id}
                    </span>

                    <span className="font-medium text-gray-800">{item.name}</span>

                    {item.isEditing ? (
                        <Input
                        type="text"
                        className="w-20 h-7 text-center text-sm"
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

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="!text-white w-25 !bg-green-900 hover:opacity-90 "
                            onClick={() => toggleEdit(item.id)}
                        >
                           <Pencil /> {item.isEditing ? "Done" : "Edit"}
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="!text-white  w-25 !bg-red-900 hover:opacity-90"
                            onClick={() => handleRemove(item.id)}
                        >
                            <Trash /> Remove
                        </Button>
                    </div>
                    </div>
                ))}
                </div>

            <Button
                className="!bg-green-700 text-white mt-4"
                disabled={cart.length === 0 || !selectedWarehouse}
                onClick={() => setReviewOpen(true)}
            >
                Review Transfer
            </Button>

           <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                <DialogContent className="max-w-lg">
                    <DialogTitle>
                    <ProcurementHeader label="Transfer Receipt" />
                    </DialogTitle>

                    <div className="space-y-5 mt-3 text-sm">
                    <div className="border-b pb-2">
                        <p className="font-medium">
                        <strong>TO:</strong> <span className="text-gray-700">{branchId}</span>
                        </p>
                        <p className="font-medium">
                        <strong>Expected Arrival:</strong> <span className="text-gray-700">{expectedDate ? format(expectedDate, "PPP") : "N/A"}</span>
                        </p>
                        <p className="font-medium">
                        <strong>From Warehouse:</strong>{" "}
                        <span className="text-gray-700">
                            {warehouses.find((w) => w.id === selectedWarehouse)?.name}
                        </span>
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Requested Items</h3>
                        <div className="border rounded-lg overflow-hidden">
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

                    {/* Totals */}
                    <div className="flex justify-between items-center border-t pt-2 text-sm font-medium">
                        <span>Total Items</span>
                        <span>{cart.length}</span>
                    </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        className="text-gray-600 border-gray-300"
                        onClick={() => setReviewOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button className="!bg-green-900 text-white"
                    onClick={handleSubmit}
                    >Confirm Transfer</Button>
                    </div>
                </DialogContent>
                </Dialog>
        </div>
    </>
  );
}
