"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ProcurementHeader } from "@/features/procurement/components/Header"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button, ModalButton } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { X, Plus, CalendarSync } from "lucide-react"
import { useEffect, useState } from "react"
import { InventoryItemService } from "@/features/inventory/inventoryItem"
import { useFetchOne } from "@/hooks/use-fetch-one"
import { formatToPeso } from "@/lib/formatter"
import { toast } from "sonner"
import { ProductService } from "@/services/ecommerce/productService"
import { EmptyState } from "@/components/custom/EmptyState"

export function EditProductRequirement({
    product,
    setOpen,
    setView,
    setReload
}: {
    product: any
    setOpen: (v?: any) => void
    setView: (v?: any) => void
    setReload: (v?: any) => void
}) { 
    const { data: inventoryResponse, loading } =
        useFetchOne(InventoryItemService.getAllInventoryItem)

    const inventoryItems = inventoryResponse?.data ?? []

    const [onProcess, setProcess] = useState(false);
    const [requirements, setRequirements] = useState<any[]>([])

    useEffect(() => {
        if (!inventoryItems.length) return
        if (!product?.items_needed?.length) return

        const normalized = product.items_needed.map((req: any) => {
            const matched = inventoryItems.find(
                (i: any) => i.name === req.name
            )

            return {
                inventory_item_id: matched?.skuid ?? "",
                name: req.name,
                category: req.category,
                cost: req.cost,
                unit_measurement: req.unit_measurement,
            }
        })

        setRequirements(normalized)
    }, [inventoryItems, product])

    const addRequirement = () => {
        setRequirements(prev => [
            ...prev,
            {
                inventory_item_id: "",
                name: "",
                category: "",
                cost: 0,
                unit_measurement: "",
            },
        ])
    }

    const updateRequirement = (index: number, item: any) => {
        setRequirements(prev =>
            prev.map((r, i) => (i === index ? item : r))
        )
    }

    const removeRequirement = (index: number) => {
        setRequirements(prev => prev.filter((_, i) => i !== index))
    }

    const getAvailableInventoryItems = (currentIndex: number) => {
        const selectedIds = requirements
            .filter((_, i) => i !== currentIndex)
            .map(r => r.inventory_item_id)
            .filter(Boolean)

        return inventoryItems.filter(
            (item: any) => !selectedIds.includes(item.skuid)
        )
    }

    async function handleSubmit() {
        try {
            setProcess(true)
            const inventoryItems = requirements.map(item => item.inventory_item_id);
            const payload = {
                product_id: product.id,
                inventory_items: inventoryItems                
            }
            const data = await ProductService.createProductlink(payload);
            if (data) {
                toast.success('Product link updated successfully.')
                setReload((prev: any) => !prev)
                setView(undefined)
                setOpen(undefined)
            }
            
        } catch (error) {
            toast.error(`${error}`)
        } finally { setProcess(true) }
    }

    if (loading) return <div>Loading</div>

    return (
        <Dialog open onOpenChange={open => !open && setOpen(undefined)}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogTitle className="sr-only">
                    Edit Product Requirements
                </DialogTitle>

                <ProcurementHeader label="edit product requirements" />

                <div className="text-center font-extrabold uppercase">
                    Materials for{" "}
                    <span className="text-green-900">{product.name}</span>
                </div>

                <div className="space-y-4 mt-4">
                    {requirements.map((req, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-4 bg-green-50 space-y-3 relative"
                        >
                            <button
                                onClick={() => removeRequirement(index)}
                                className="absolute top-2 right-2 text-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                    <Label>Inventory Item</Label>
                                    <Select
                                        value={req.inventory_item_id}
                                        onValueChange={skuid => {
                                            const selected = inventoryItems.find(
                                                (i: any) => i.skuid === skuid
                                            )

                                            if (!selected) return

                                            updateRequirement(index, {
                                                inventory_item_id: selected.skuid,
                                                name: selected.name,
                                                category: selected.category,
                                                cost: selected.cost,
                                                unit_measurement: selected.unit_measurement,
                                            })
                                        }}
                                    >
                                        <SelectTrigger className="uppercase font-extrabold text-orange-900 bg-white">
                                            <SelectValue placeholder="Select inventory item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getAvailableInventoryItems(index).map((item: any) => (
                                                <SelectItem key={item.skuid} value={item.skuid}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <span className="text-muted-foreground">
                                        Cost
                                    </span>
                                    <div className="font-extrabold text-green-900">
                                        {formatToPeso(req.cost || 0)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">
                                        Category
                                    </span>
                                    <div className="font-semibold uppercase">
                                        {req.category || "—"}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-muted-foreground">
                                        Unit
                                    </span>
                                    <div className="font-semibold uppercase">
                                        {req.unit_measurement || "—"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {requirements.length === 0 && (
                        <EmptyState 
                            title="No materials linked to this product"
                            message="Please select product link to inventory items"
                        />
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex gap-2"
                        onClick={addRequirement}
                    >
                        <Plus className="w-4 h-4" />
                        Add Material
                    </Button>
                </div>

                <form 
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit();
                    } }
                    className="flex justify-end gap-2 pt-4"
                >
                    <ModalButton
                        type="submit"
                        className="!bg-green-900"
                        label="Save Changes"
                        loadingLabel="Saving Changes"
                        onProcess={ onProcess }
                        icon={ CalendarSync }
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}
