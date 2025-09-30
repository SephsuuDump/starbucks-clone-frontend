import { ButtonHTMLAttributes, Dispatch, SetStateAction, use, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModalButton } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ProcurementHeader } from "../procurement/Header";
import { InventoryService } from "@/services/Inventory/InventoryService";
import { Input } from "@/components/ui/input";


export default function AddQuantityModal({
        setOpenAdd,
        name,
        id,
        setLoading,
        loading
    } : 
    {
        setOpenAdd :Dispatch<SetStateAction<boolean>>
        name : string,
        id : string,
        setLoading :Dispatch<SetStateAction<boolean>>,
        loading : boolean
    }) {

    const [onProcess, setProcess] = useState(false);
    const [added, setAdded] = useState<string>("");

    async function handleSubmit(e:React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        setProcess(true)

        try {
            const data = await InventoryService.processInput(id, parseInt(added));
            if (data) {
                toast.success("Add quantity for inventory " + name);
                setLoading(!loading);
                setOpenAdd(false);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(errorMessage);
        } finally {
            setProcess(false);
        }
        
    }


    return (
       <Dialog open onOpenChange={setOpenAdd}>
      <DialogContent>
        <DialogTitle>
          <ProcurementHeader label="Add Inventory" />
        </DialogTitle>
        <p className=" px-2">Add Inventory Quantity for item <span className="font-bold">{name}</span></p>

        <Input
            placeholder="Enter additional quantity"
             onChange={(e) => {
                          const value = e.target.value;
            
                          if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
                            setAdded(value)
                          } else {
                            toast.error("Only numbers and a single dot are allowed");
                          }
            }}
        />

        <ModalButton
                type="submit"
                className="!bg-green-900"
                label="Add quantity"
                loadingLabel="Adding quantity"
                onProcess={onProcess}
                icon={Plus}
                onClick={handleSubmit}
        />
      </DialogContent>
    </Dialog>
    ); 
}