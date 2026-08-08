"use client";

import { Dialog, DialogContent, ModalTitle } from "@/components/ui/dialog";
import { FormEvent, useEffect, useState } from "react";
import { ProcurementHeader } from "../components/Header";
import { Input } from "@/components/ui/input";
import { ModalButton } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { hasEmptyField } from "@/lib/utils";
import { SupplyItemService } from "@/services/procurement/supplyItemService";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function UpdateSupplierItem({
    toUpdate,
    setUpdate,
}: {
    toUpdate: any;
    setUpdate: (value: any) => void;
}) {
    const [onProcess, setProcess] = useState(false);
    const [supply, setSupply] = useState<any>({
        id: toUpdate.id,
        supplier_id: toUpdate.supplier_id,
        name: "",
        description: "",
        category: "",
        unit_cost: 0,
    });

    useEffect(() => {
        if (toUpdate) {
            setSupply({
                id: toUpdate.id,
                supplier_id: toUpdate.supplier_id,
                name: toUpdate.name,
                description: toUpdate.description,
                category: toUpdate.category,
                unit_cost: toUpdate.unit_cost,
            });
        }
    }, [toUpdate]);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        try {
            e.preventDefault();
            setProcess(true);

            if (hasEmptyField(supply) || Number(supply.unit_cost) === 0) {
                toast.error("PLEASE FILL UP ALL FIELDS");
                return;
            }

            const data = await SupplyItemService.updateSupplyItem(
                supply
            );

            if (data) toast.success("SUPPLY UPDATED SUCCESSFULLY");
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setProcess(false);
            setUpdate(undefined);
        }
    }

    if (!toUpdate) return null;

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) setUpdate(undefined);
            }}
        >
            <DialogContent>
                <ModalTitle text={`Update ${toUpdate.name}`} />

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label>Supply Name</Label>
                        <Input
                            value={supply.name}
                            onChange={(e) =>
                                setSupply((prev: any) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            placeholder="Supply Name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Unit Measurement</Label>
                        <Input
                            value={supply.description}
                            onChange={(e) =>
                                setSupply((prev: any) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                            placeholder="ex. 330 ml"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={supply.category}
                            onValueChange={(value) =>
                                setSupply((prev: any) => ({
                                    ...prev,
                                    category: value,
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {["BEVERAGES", "DRINKS"].map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Price</Label>
                        <div className="flex-center-y border shadow-xs border-gray-200 rounded-md">
                            <div className="w-10 text-center">₱</div>
                            <Input
                                type="number"
                                value={supply.unit_cost}
                                onChange={(e) =>
                                    setSupply((prev: any) => ({
                                        ...prev,
                                        unit_cost: Number(e.target.value),
                                    }))
                                }
                                className="border-0 shadow-none"
                                placeholder="Unit Cost"
                            />
                        </div>
                    </div>

                    <ModalButton
                        type="submit"
                        className="!bg-green-900"
                        label="Update Supply"
                        loadingLabel="Updating Supply"
                        onProcess={onProcess}
                        icon={Save}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
