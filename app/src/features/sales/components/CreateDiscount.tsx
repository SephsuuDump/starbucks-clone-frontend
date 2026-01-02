"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ModalButton } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ProcurementHeader } from "@/features/procurement/components/Header"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { DiscountService } from "@/services/sales/discountService"

const discountTypes = [
    "Discount Percentage",
    "Fixed Amount",
]

export default function CreateDiscount({
    setOpen,
    setReload,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setReload: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [onProcess, setProcess] = React.useState(false)

    const [discount, setDiscount] = React.useState({
        name: "",
        type: "",
        value: "",
    })

    const handleSubmit = async () => {
        try {
            setProcess(true)

            const payload = {
                name: discount.name,
                type: discount.type,
                value: Number(discount.value),
            }

            const data = await DiscountService.createDiscount(payload)

            if (data) {
                toast.success(`${discount.name} has been created.`)
                setReload(prev => !prev)
                setOpen(false)
            }
        } catch (error) {
            toast.error(`${error}`)
        } finally {
            setProcess(false)
        }
    }

    return (
        <Dialog open onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogTitle>
                    <ProcurementHeader label="create discount" />
                </DialogTitle>

                <form
                    onSubmit={e => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                    className="space-y-4"
                >
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="name">Discount Name</Label>
                        <Input
                            value={discount.name}
                            onChange={e =>
                                setDiscount(prev => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="type">Discount Type</Label>
                        <Select
                            value={discount.type}
                            onValueChange={value =>
                                setDiscount(prev => ({
                                    ...prev,
                                    type: value,
                                }))
                            }
                            required
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                            <SelectContent>
                                {discountTypes.map(type => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="value">
                            {discount.type === "Discount Percentage"
                                ? "Discount Percentage (%)"
                                : "Discount Amount"}
                        </Label>
                        <Input
                            type="number"
                            min={0}
                            max={discount.type === "Discount Percentage" ? 100 : undefined}
                            value={discount.value}
                            onChange={e =>
                                setDiscount(prev => ({
                                    ...prev,
                                    value: e.target.value,
                                }))
                            }
                            required
                        />
                    </div>

                    <ModalButton
                        type="submit"
                        className="!bg-green-900"
                        label="Create Discount"
                        loadingLabel="Creating Discount"
                        onProcess={onProcess}
                        icon={Plus}
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}
