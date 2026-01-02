"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ProcurementHeader } from "@/features/procurement/components/Header"
import { Label } from "@/components/ui/label"
import { formatToPeso } from "@/lib/formatter"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { EditProductRequirement } from "./EditProductRequirements"
import { EmptyState } from "@/components/custom/EmptyState"

export default function ViewProduct({
    toEdit,
    setEdit,
    product,
    setOpen,
}: {
    toEdit: any
    setEdit: any
    product: any
    setOpen: any
}) {
    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setOpen(undefined) } }>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogTitle>
                    <ProcurementHeader label="product details" />
                </DialogTitle>

                <div className="space-y-4">
                    <div className="w-full">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-56 object-cover rounded-lg"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Product Name</Label>
                        <div className="font-extrabold uppercase">
                            {product.name}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">

                        <div className="flex flex-col gap-1">
                            <Label>Category</Label>
                            <div className="text-sm uppercase font-extrabold text-orange-900">
                                {product.category}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Price</Label>
                            <div className="font-extrabold text-green-900">
                                {formatToPeso(product.price)}
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Description</Label>
                        <div className="text-sm text-muted-foreground whitespace-pre-line">
                            {product.description}
                        </div>
                    </div>
                    <Separator className="mt-2 mb-4" />
                    <div className="flex flex-col gap-2">
                        <div className="flex-center-y justify-between mx-2">
                            <Label className="uppercase font-extrabold">Items Needed</Label>
                            <div
                                onClick={ () => {
                                    setEdit(product);
                                    setOpen(undefined)
                                } }
                                className="underline text-xs font-semibold cursor-pointer"
                            >
                                Edit Items
                            </div>
                        </div>

                        {product.items_needed?.length === 0 && (
                            <EmptyState
                                title="No items linked to this product." 
                            />
                        )}

                        <div className="space-y-2">
                            {product.items_needed?.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center border rounded-md p-3 bg-green-50"
                                >
                                    <div>
                                        <div className="text-sm font-extrabold uppercase text-green-900">
                                            {item.name}
                                        </div>
                                        <div className="text-xs font-extrabold uppercase text-orange-900">
                                            {item.category} • {item.unit_measurement}
                                        </div>
                                    </div>

                                    <div className="text-sm font-semibold">
                                        {formatToPeso(item.cost)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>    
    )
}

