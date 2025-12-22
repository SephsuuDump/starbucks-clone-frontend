import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { ProductService } from "@/services/ecommerce/productService";
import { ArrowBigRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function EditStock({ open, setOpen, setReload }: any) {
    const [newStock, setNewStock] = useState(open.quantity);

    async function handleSubmit() {
        if (!newStock || (typeof newStock === "number" && !isNaN(newStock))) return toast.warning('Please enter a valid stock')
        const data = await ProductService.updateBranchProduct({
            id: open.id,
            stock: Number(newStock)
        })
        if (data) {
            toast.success('Stock edited successfully.')
            setOpen(undefined)
            setReload((prev: any) => !prev)
        }
    }
    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setOpen(undefined) } }>
            <DialogContent>
                <DialogTitle><ProcurementHeader label="Edit Stock" /></DialogTitle>
                <div className="space-y-4">
                    <div className="font-extrabold text-center">EDIT STOCK FOR</div>
                    <div className="font-extrabold text-center text-green-900 text-lg uppercase -mt-4">{ open.name }</div>
                    <div className="flex-center gap-4">
                        <div className="text-lg font-extrabold">{ open.stock }</div>
                        <ArrowBigRight className="w-5 h-5 scale-x-125" fill="#000" />
                        <Input
                            placeholder="New Stock"
                            className="w-30 text-[16px] font-extrabold"
                            onChange={ e => setNewStock(e.target.value) }
                        />
                    </div>
                    <div className="flex-center gap-2">
                        <Button
                            onClick={ () => setOpen(undefined) }
                            className="!bg-red-900 font-extrabold hover:opacity-90"
                        >
                            CANCEL
                        </Button>
                        <Button
                            onClick={ handleSubmit }
                            className="!bg-green-900 font-extrabold hover:opacity-90"
                        >
                            UPDATE
                        </Button>
                    </div>
                </div>

            </DialogContent>
            
        </Dialog>
    )
}