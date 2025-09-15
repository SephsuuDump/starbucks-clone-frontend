import { ProcurementBadge } from "@/components/ui/badge";
import { Button, ModalButton } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatTimestamptzToWords, formatToPeso } from "@/lib/formatter";
import { PurchaseOrderService } from "@/services/purchaseOrderService";import { CircleCheckBig } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

interface Props {
    activeRequest: any;
    setRequest: Dispatch<SetStateAction<any | undefined>>;
    setReload: Dispatch<SetStateAction<boolean>>;
}

export function RequestOrderModal({ activeRequest, setRequest, setReload }: Props) {
    const [onProcess, setProcess] = useState(false);
    async function updateStatus(id: string, status: string) {
        try {
            setProcess(true);
            const data = await PurchaseOrderService.updateStatus({ id: id, status: status });
            if (data) toast.success('ORDER STATUS UPDATED!');
        } catch (error) { toast.error(`${error}`) }
        finally { 
            setReload(prev => !prev);
            setProcess(false); 
            setRequest(undefined);
        }
    }

    return(
        <Dialog open onOpenChange={ (open) => { if (!open) setRequest(undefined) } }>
            <DialogContent>
                <DialogTitle className="font-normal">Order Request for <span className="font-semibold">{ activeRequest.id }</span></DialogTitle>
                <div className="flex justify-between text-sm">
                    <div>Request Date</div>
                    <div className="font-semibold">{ formatTimestamptzToWords(activeRequest.date) }</div>
                </div>
                <Separator className="-mt-2" />
                <div className="flex justify-between text-sm -mt-2">
                    <div>Supplier Name</div>
                    <div className="font-semibold">{ activeRequest.supplier.name } <span className="text-gray-500">({ activeRequest.supplier.contact })</span></div>
                </div>
                <Separator className="-mt-2" />
                <div className="flex justify-between text-sm -mt-2">
                    <div>Status</div>
                    <ProcurementBadge label={ activeRequest.status } />
                </div>
                <Separator className="-mt-2" />
                <div className="font-semibold">Orders</div>

                <div className="h-[180px] overflow-auto">
                    <div className="grid grid-cols-3 thead">
                        <div className="th">Supply Name</div>
                        <div className="th">Quantity</div>
                        <div className="th">Unit Price</div>
                    </div>
                    {activeRequest.supplies.map((item: any, _: number) => (
                        <div className="tdata grid grid-cols-3 !m-0" key={_}>
                            <div className="td">{ item.name }</div>
                            <div className="td">{ item.quantity }</div>
                            <div className="td">{ formatToPeso(item.unit_cost * item.quantity) }</div>
                        </div>
                    ))}
                </div>
                <ModalButton
                    onClick={ () => updateStatus(activeRequest.id, "SENT") }
                    icon={ CircleCheckBig }
                    onProcess={ onProcess }
                    label="Approve Request"
                    loadingLabel="Processing Request"
                    className="!bg-green-900 hover:opacity-90"
                />
                <button className="text-red-600 text-end text-sm">Reject Request</button>
            </DialogContent>
        </Dialog>
    );
}