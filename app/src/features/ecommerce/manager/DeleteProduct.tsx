import { ModalButton } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductService } from "@/services/ecommerce/productService";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function DeleteProduct({ toDelete, setDelete, setReload }: {
    toDelete: any
    setDelete: Dispatch<SetStateAction<any>>
    setReload: Dispatch<SetStateAction<any>>
}) {
    const [onProcess, setProcess] = useState(false);

    async function handleDelete() {
        try {
            setProcess(true);
            const data = await ProductService.deleteProduct(toDelete.id);
            if (data) {
                toast.success(`${toDelete.name} successfully deleted.`)
                setReload((prev: any) => !prev)
                setDelete(undefined)
            }
        } catch (error) { toast.error(`${error}`) }
        finally { setProcess(false) }
    }
    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setDelete(undefined) }}>
            <DialogContent>
                <DialogTitle>Delete { toDelete.name }?</DialogTitle>
                <form
                    onSubmit={ e => {
                        e.preventDefault();
                        handleDelete();
                    }}
                >
                    <ModalButton
                        icon={ Trash2 }
                        label="Delete Product"
                        loadingLabel="Deleting Product"
                        onProcess={ onProcess }
                        className="!bg-red-900"
                        type="submit"
                    />
                </form>
            </DialogContent>
        </Dialog>
    )
}