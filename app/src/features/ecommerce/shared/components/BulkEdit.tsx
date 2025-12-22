import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { ProductService } from "@/services/ecommerce/productService";
import { useState } from "react";
import { toast } from "sonner";

export function BulkEdit({ claims, setOpen, toEdit, setEdit }: any) {
    const [onProcess, setProcess] = useState(false);
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);

    async function handlePriceSubmit() {
        try {
            setProcess(true)
            const data = await ProductService.bulkEdit({
                price: price,
                bulk: toEdit
            });
            if (data) {
                toast.success('BULK EDIT SUCCESS.')
                setEdit([])
                setOpen(false)
            }
        } catch (error) {
            toast.error(`${error}`)
        } finally { setProcess(false) }
    }

    async function handleStockSubmit() {
        try {
            setProcess(true)
            const data = await ProductService.bulkStock({
                stock: stock,
                bulk: toEdit
            });
            if (data) {
                toast.success('BULK EDIT SUCCESS.')
                setEdit([])
                setOpen(false)
            }
        } catch (error) {
            toast.error(`${error}`)
        } finally { setProcess(false) }
    }

    return (
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent>
                <DialogTitle><ProcurementHeader label="Edit selected items" /></DialogTitle>
                <div className="flex-center flex-col gap-2">
                    {claims.role === "E-COMMERCE MANAGER" && (
                        <>
                        <div className="font-semibold text-lg">PLEASE ENTER INCREASE/DECREASE TO PRICE</div>
                        <Input
                            value={price}
                            type="number"
                            onChange={ e => setPrice(Number(e.target.value))}
                            className="text-2xl font-semibold w-50 scale-x-110"
                        />
                        <div className="flex gap-8 mt-4">
                            <DialogClose className="font-semibold">CANCEL</DialogClose>
                            <Button
                                onClick={ handlePriceSubmit }
                                className="!bg-green-900 font-semibold"
                            >
                                UPDATE
                            </Button>
                        </div>
                        </>
                    )}

                    {claims.role === "E-COMMERCE EMPLOYEE" && (
                        <>
                        <div className="font-semibold text-lg">PLEASE ENTER INCREASE/DECREASE TO STOCK</div>
                        <Input
                            value={stock}
                            type="number"
                            onChange={ e => setStock(Number(e.target.value))}
                            className="text-2xl font-semibold w-50 scale-x-110"
                        />
                        <div className="flex gap-8 mt-4">
                            <DialogClose className="font-semibold">CANCEL</DialogClose>
                            <Button
                                onClick={ handleStockSubmit }
                                className="!bg-green-900 font-semibold"
                            >
                                UPDATE
                            </Button>
                        </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}