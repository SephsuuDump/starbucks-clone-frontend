"use client";

import { ModalButton } from "@/components/ui/button";
import { Dialog, DialogContent, ModalTitle } from "@/components/ui/dialog";
import { SupplyItemService } from "@/services/procurement/supplyItemService";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function DeleteSupplierItem({
    toDelete,
    setDelete,
}: {
    toDelete: any;
    setDelete: Dispatch<SetStateAction<any>>;
}) {
    const [onProcess, setProcess] = useState(false);

    async function handleDelete() {
        try {
            setProcess(true);

            const data = await SupplyItemService.deleteSupplyItem(toDelete.id);

            if (data) {
                toast.success(`${toDelete.name} successfully deleted.`);
                setDelete(undefined);
            }
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            setProcess(false);
        }
    }

    return (
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) setDelete(undefined);
            }}
        >
            <DialogContent>
                <ModalTitle text={`Delete ${toDelete.name}?`} />

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleDelete();
                    }}
                >
                    <ModalButton
                        icon={Trash2}
                        label="Delete Supply"
                        loadingLabel="Deleting Supply"
                        onProcess={onProcess}
                        className="!bg-red-900"
                        type="submit"
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}
