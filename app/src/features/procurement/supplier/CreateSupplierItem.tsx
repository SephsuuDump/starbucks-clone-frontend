"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { ProcurementHeader } from "../components/Header";
import { Input } from "@/components/ui/input";
import { ModalButton } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { hasEmptyField } from "@/lib/utils";
import { SupplyItemService } from "@/services/procurement/supplyItemService";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CreateSupplierItem({ id, setOpen }: {
    id: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [onProcess, setProcess] = useState(false);
    const [supply, setSupply] = useState<any>({
        supplier_id: id,
        name: '',
        description: '',
        category: '',
        unit_cost: 0
    });

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        try {
            e.preventDefault();
            setProcess(true);
            if (hasEmptyField(supply) || supply.unit_cost === 0) toast.error('PLEASE FILL UP ALL FIELDS');  
            const data = await SupplyItemService.createSupplyItem(supply);
            if (data) toast.success('SUPPLY ADDED SUCCESSFULLY');
        } catch (error) { toast.error(`${error}`) }
        finally {
            setProcess(false);
            setOpen(!open);
        }
    }

    useEffect(() => {
        console.log(supply);
        
    }, [supply])

    return(
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent>
                <DialogTitle><ProcurementHeader label="Add a supply" /></DialogTitle>
                <form className="flex flex-col gap-4" onSubmit={ handleSubmit }>
                    <div className="space-y-2">
                        <Label>Supply Name</Label>
                        <Input 
                            onChange={ e => setSupply((prev: any) => ({
                                ...prev,
                                name: e.target.value
                            }))}
                            className="tracking-wider"
                            placeholder="Supply Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Unit Measurement</Label>
                        <Input 
                            onChange={ e => setSupply((prev: any) => ({
                                ...prev,
                                description: e.target.value
                            }))}
                            className="tracking-wider"
                            placeholder="ex. 330 ml"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={ supply.category } 
                            onValueChange={ (value) => setSupply((prev: any) => ({
                                ...prev,
                                category: value
                            })) }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {["BEVERAGES", "DRINKS"].map((item: any) => (
                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Price</Label>
                        <div className="flex-center-y border-1 shadow-xs border-gray-200 rounded-md">
                        <div className="w-10 text-center">₱</div>
                            <Input 
                                onChange={ e => setSupply((prev: any) => ({
                                    ...prev,
                                    unit_cost: e.target.value
                                }))}
                                type="number"
                                className="tracking-wider border-0 shadow-none"
                                placeholder="Unit Cost"
                            />
                        </div>
                    </div>
                    <ModalButton
                        type="submit"
                        className="!bg-green-900"
                        label="Add Supply"
                        loadingLabel="Adding Supply"
                        onProcess={ onProcess }
                        icon={ Plus }
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}