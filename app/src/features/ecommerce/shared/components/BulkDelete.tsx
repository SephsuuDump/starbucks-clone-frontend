import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { ProductService } from "@/services/ecommerce/productService";
import { useState } from "react";
import { toast } from "sonner";

export function BulkDelete({ setOpen, toDelete, setDelete }: any) {
    const [onProcess, setProcess] = useState(false);
    async function handleSubmit() {
        try {
            setProcess(true)
            const data = await ProductService.bulkDelete({
                bulk: toDelete
            });
            if (data) {
                toast.success('BULK DELETE SUCCESS.')
                setDelete([])
                setOpen(false)
            }
        } catch (error) {
            toast.error(`${error}`)
        } finally { setProcess(false) }
    }
    return (
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent>
                <DialogTitle><ProcurementHeader label="delete selected items?" /></DialogTitle>
                <div className="flex-center flex-col gap-2">
                    <div className="flex gap-8 mt-4">
                        <DialogClose className="font-semibold">CANCEL</DialogClose>
                        <Button
                            onClick={ handleSubmit }
                            className="!bg-red-900 font-semibold"
                        >
                            DELETE
                        </Button>
                    </div>
                </div>
            </DialogContent>
            
        </Dialog>
    )
}