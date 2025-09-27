import { ButtonHTMLAttributes, Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProcurementHeader } from "../procurement/Header";
import { ModalButton } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InventoryItemService } from "@/services/Inventory/InventoryItemService";
import { toast } from "sonner";

export default function DeleteInventory({
        setOpenDelete,
        skuid,
        setLoading,
        loading
    } : 
    {
        setOpenDelete :Dispatch<SetStateAction<boolean>>
        skuid : string,
        setLoading :Dispatch<SetStateAction<boolean>>,
        loading : boolean
    }) {

    const [onProcess, setProcess] = useState(false);
    

    async function handleSubmit(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        setProcess(true)

        try {
            const data = await InventoryItemService.deleteBySkuid(skuid);
            if (data) {
                toast.success(data.message);
                setLoading(!loading);
                setOpenDelete(false);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(errorMessage);
        } finally {
            setProcess(false);
        }
        
    }


    return (
       <Dialog open onOpenChange={setOpenDelete}>
      <DialogContent>
        <DialogTitle>
          <ProcurementHeader label="Delete Inventory Item" />
        </DialogTitle>
        <p className=" px-2">Do you want to delete Inventory Item with skuid <span className="font-semibold">{skuid}</span></p>
        <ModalButton
                type="submit"
                className="!bg-green-900"
                label="Delete Item"
                loadingLabel="Deleting Item"
                onProcess={onProcess}
                icon={Plus}
                onClick={handleSubmit}
        />
      </DialogContent>
    </Dialog>
    ); 
}