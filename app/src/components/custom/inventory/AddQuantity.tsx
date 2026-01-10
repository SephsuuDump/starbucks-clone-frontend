import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModalButton } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { InventoryService } from "@/services/Inventory/InventoryService";
import { Input } from "@/components/ui/input";
import { ProcurementHeader } from "@/features/procurement/components/Header";

export default function AddQuantityModal({
  setOpenAdd,
  name,
  id,
  setLoading,
  loading,
}: {
  setOpenAdd: Dispatch<SetStateAction<boolean>>;
  name: string;
  id: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}) {
  const [onProcess, setProcess] = useState(false);
  const [added, setAdded] = useState<string>("");

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setProcess(true);

    try {
      if (added.trim() === "" || added === "-") {
        toast.error("Please enter a valid number (e.g., 10 or -5)");
        setProcess(false);
        return;
      }

      const quantity = parseInt(added);
      if (isNaN(quantity)) {
        toast.error("Invalid quantity input");
        setProcess(false);
        return;
      }

      const data = await InventoryService.processInput(id, quantity);

      if (data) {
        toast.success(
          quantity < 0
            ? `Deducted ${Math.abs(quantity)} from ${name}`
            : `Added ${quantity} to ${name}`
        );
        setLoading(!loading);
        setOpenAdd(false);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(errorMessage);
    } finally {
      setProcess(false);
    }
  }

  return (
    <Dialog open onOpenChange={setOpenAdd}>
      <DialogContent>
        <DialogTitle>
          <ProcurementHeader label="Adjust Inventory Quantity" />
        </DialogTitle>
        <p className="px-2 mb-2">
          Modify the inventory quantity for item{" "}
          <span className="font-bold">{name}</span>.
        </p>

        <Input
          placeholder="Enter quantity (e.g., 10 or -5)"
          value={added}
          onChange={(e) => {
            const value = e.target.value;
            // ✅ Allow numbers or a temporary single '-'
            if (value === "" || value === "-" || /^-?\d+$/.test(value)) {
              setAdded(value);
            } else {
              toast.error("Only whole numbers (e.g., 10 or -5) are allowed");
            }
          }}
        />

        <ModalButton
          type="submit"
          className="!bg-green-900 mt-4"
          label="Save"
          loadingLabel="Processing..."
          onProcess={onProcess}
          icon={Plus}
          onClick={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
