import { ButtonHTMLAttributes, Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModalButton } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ProcurementHeader } from "../procurement/Header";
import { InventoryService } from "@/services/Inventory/InventoryService";
import { BranchService } from "@/services/Inventory/BranchService";
import { WarehouseService } from "@/services/Inventory/WarehouseService";


export default function DeleteLocation({
        setOpenDelete,
        name,
        id,
        setLoading,
        loading, 
        type,
        reload
    } : 
    {
        setOpenDelete :Dispatch<SetStateAction<boolean>>
        name : string,
        id : string,
        setLoading :Dispatch<SetStateAction<boolean>>,
        loading : boolean,
        type : string
        reload?: () => void;
    }) {

    const [onProcess, setProcess] = useState(false);
    

    async function handleSubmit(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        setProcess(true)

        try {
            let data: any = null;
            if (type.toLowerCase() === "branch") {
                data = await BranchService.delete(id);
            }
            else if(type.toLowerCase() === "warehouse") {
                 data = await WarehouseService.updateStatus(id, "INACTIVE");
            }
            if (data) {
                toast.success("Deleted Location for " + name);
                setLoading(!loading);
                setOpenDelete(false);
                reload?.(); 
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
          <ProcurementHeader label="Delete Location" />
        </DialogTitle>
        <p className=" px-2">Do you want to delete Location <span className="font-semibold">{name}</span>?</p>
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