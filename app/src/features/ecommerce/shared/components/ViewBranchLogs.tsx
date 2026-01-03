import { Dialog, DialogContent, ModalTitle } from "@/components/ui/dialog";
import { useFetchData } from "@/hooks/use-fetch-data";
import { formatDateTime } from "@/lib/formatter";
import { ProductService } from "@/services/ecommerce/productService";

export function ViewBranchLogs({ toView, setView }: any) {
    const { data: logs, loading } = useFetchData(
        ProductService.getBranchProductLogs,
        [toView.id],
        [toView.id]
    )
    return (
        <Dialog open onOpenChange={ (open) => { if (!open) setView(undefined) } }>
            <DialogContent>
                <ModalTitle text={`Logs for ${toView.name}`} />
                <div className="thead grid grid-cols-3">
                    <div className="th">Flow</div>
                    <div className="th">Quantity</div>
                    <div className="th">Date</div>
                </div>
                {logs.map((item, i) => (
                    <div className="tdata grid grid-cols-3" key={i}>
                        <div className="td">{ item.flow }</div>
                        <div className="td">{ item.quantity }</div>
                        <div className="td">{ formatDateTime(item.created_at) }</div>
                    </div>
                ))}
            </DialogContent>
        </Dialog>
    )
}