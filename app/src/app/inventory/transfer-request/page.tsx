"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronDown, Pencil, PenIcon, Trash, X } from "lucide-react";
import { ProcurementHeader } from "@/components/custom/procurement/Header";

export default function BranchTransferRequest() {
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState<string>("");
  const [cart, setCart] = useState<any[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);

  const branchId = "7e42ef23-002b-4d39-8d12-9101bbaf2385    "

  const warehouses = [
    { id: "w1", name: "Warehouse A" },
    { id: "w2", name: "Warehouse B" },
  ];

  const inventoryItems = [
    { id: "12108b82-3652-479b-bb44-28788a287692", name: "Chicken Breast" },
    { id: "3322e1dc-640f-4431-9d30-ee68ba4f9818", name: "Pork Belly" },
    { id: "54ca54a5-af2f-4ee9-bef4-2afdba0dc4c2", name: "Beef Steak" },
  ];

  const availableItems = inventoryItems.filter(
    (i) => !cart.find((c) => c.id === i.id)
  );

  const handleAdd = () => {
    if (!selectedItem || !quantity) return;

    const item = inventoryItems.find((i) => i.id === selectedItem);
    if (!item) return;

    setCart((prev) => [
      ...prev,
      { id: item.id, name: item.name, qty: quantity },
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

            <div className="flex gap-4 items-center">
                <select
                className="border py-2 px rounded-md w-60 text-sm"
                value={selectedItem}
                disabled={availableItems.length === 0}
                onChange={(e) => setSelectedItem(e.target.value)}
                
                >
                <option value="">Select Item</option>
                {availableItems.map((i) => (
                    <option key={i.id} value={i.id} className="">
                    {i.name}
                    </option>
                ))}
                </select>

                <Input
                type="text" // keep it string-based
                placeholder="Quantity"
                value={quantity}
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
                    {/* ID */}
                    <span className="text-xs font-mono text-gray-600 truncate">
                        {item.id}
                    </span>

                    {/* Name */}
                    <span className="font-medium text-gray-800">{item.name}</span>

                    {/* Qty - Editable */}
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

                        {/* Remove Button */}
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
                    {/* Branch + Warehouse Info */}
                    <div className="border-b pb-2">
                        <p className="font-medium">
                        <strong>TO:</strong> <span className="text-gray-700">{branchId}</span>
                        </p>
                        <p className="font-medium">
                        <strong>From Warehouse:</strong>{" "}
                        <span className="text-gray-700">
                            {warehouses.find((w) => w.id === selectedWarehouse)?.name}
                        </span>
                        </p>
                    </div>

                    {/* Items Table */}
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
                    <Button className="!bg-green-900 text-white">Confirm Transfer</Button>
                    </div>
                </DialogContent>
                </Dialog>
        </div>
    </>
  );
}
