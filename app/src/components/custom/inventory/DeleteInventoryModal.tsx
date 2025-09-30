import { ButtonHTMLAttributes, Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModalButton } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ProcurementHeader } from "../procurement/Header";
import { InventoryService } from "@/services/Inventory/InventoryService";


export default function DeleteInventoryModal({
        setOpenDelete,
        name,
        id,
        setLoading,
        loading
    } : 
    {
        setOpenDelete :Dispatch<SetStateAction<boolean>>
        name : string,
        id : string,
        setLoading :Dispatch<SetStateAction<boolean>>,
        loading : boolean
    }) {

    const [onProcess, setProcess] = useState(false);
    

    async function handleSubmit(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        setProcess(true)

        try {
            const data = await InventoryService.deleteById(id);
            if (data) {
                toast.success("Deleted inventory for " + name);
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
          <ProcurementHeader label="Delete Inventory" />
        </DialogTitle>
        <p className=" px-2">Do you want to delete inventory for <span className="font-semibold">{name}</span>?</p>
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