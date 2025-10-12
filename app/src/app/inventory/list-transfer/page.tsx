'use client'

import { ProcurementHeader } from "@/components/custom/procurement/Header";
import { Button } from "@/components/ui/button";
import { TransferService } from "@/services/Inventory/TransferService";
import { TransferResponse } from "@/types/TransferResponse";
import { Box, ScanEye } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type TransferStatus = "pending" | "out" | "completed";

export default function ListTransfer() {
    const [transfers, setTransfers] = useState<Record<TransferStatus, TransferResponse[]>>({
        pending: [],
        out: [],
        completed: [],
    });
    const [reviewOpen, setReviewOpen] = useState<boolean>(false);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [viewing, setViewing] = useState<TransferResponse>();
    const [refresh, setRefresh] = useState<boolean>(false);
    const branchId = "7e42ef23-002b-4d39-8d12-9101bbaf2385"
    // const branchId = "ae059e49-a1a6-471c-8da0-ee1fa1d2cdf4"

    async function fetchTransfers(status: TransferStatus) {
        const res = await TransferService.getByDestination(branchId, status);
        setTransfers(prev => ({ ...prev, [status]: res }));
    }

    useEffect(() => {
        fetchTransfers("pending");
        fetchTransfers("out");
    }, [refresh]) 

    async function handleViewing(id:string) {
        if(!id) {
            toast.error('ID is requuied')
        }

        try {
            const data = await TransferService.getById(id);
            setViewing(Array.isArray(data) ? data[0] : data);
        } catch(e) {
            toast.error(`${e}`)
        }
        
    }

    async function handleReceived(id : string ) {
          if(!id) {
            toast.error('ID is requuied')
        }

        try {
            const data = await TransferService.updateStatus(id, 'DELIVERED');   
            if(data) {
                toast.success(`Updated transfer id ${id} to Delivered `)
            }
            setRefresh(!refresh)

        } catch(e) {
            toast.error(`${e}`)
        }
        
    }

    return (
        <>
            <ProcurementHeader label="Supply Transfer"/>

            <div className="flex flex-col bg-white shadow-sm rounded-xl w-full  p-6 mt-5">
                <h1 className="font-bold text-gray-700 text-lg">PENDING TRANSFERS</h1>
                
                <div className="grid grid-cols-4 text-sm font-semibold text-gray-700 mt-5 mb-2 items-center justify-center">
                    <div className="flex justify-center">TRANSFER ID</div>
                    <div className="flex justify-center">FROM</div>
                    <div className="flex justify-center">TO</div>
                    <div className="flex justify-center">ACTION</div>
                </div>

                {transfers.pending.length === 0 ? 
                <div className="flex rounded-lg shadow-sm p-4 mb-3 border-gray-200 justify-center font-light text-sm bg-gray-200">No data found </div>  : 
                <>
                {transfers.pending.map((request) => (
                    <div
                        key={request.id}
                        className="bg-white rounded-lg shadow-sm p-2 mb-3 border "
                    >
                        <div className="grid grid-cols-4 items-center text-sm font-light text-gray-800">
                            <div className="flex justify-center">{request.id}</div>
                            <div className="flex justify-center">{request.from_warehouse?.name}</div>
                            <div className="flex justify-center">{request.to_branch?.name || request.to_warehouse?.name}</div>
                            <div className="flex justify-center">
                                <Button className="!bg-yellow-500 text-white px-2 py-1 rounded-md text-sm"
                                onClick={() => {
                                    handleViewing(request.id)
                                    setReviewOpen(true)
                                    
                                }}>
                                <ScanEye /> View Order
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                </>
                }
            </div>

            
            <div className="flex flex-col bg-white shadow-sm rounded-xl w-full  p-6 mt-5">
                <h1 className="font-bold text-gray-700 text-lg">OUT FOR DELVERIES</h1>
                
                <div className="grid grid-cols-4 text-sm font-semibold text-gray-700 mt-5 mb-2 items-center justify-center">
                    <div className="flex justify-center">TRANSFER ID</div>
                    <div className="flex justify-center">FROM</div>
                    <div className="flex justify-center">TO</div>
                    <div className="flex justify-center">ACTION</div>
                </div>

                {transfers.out.length === 0 ? 
                <div className="flex rounded-lg shadow-sm p-4 mb-3 border-gray-200 justify-center font-light text-sm bg-gray-200">No data found </div>  
                : 
                <>
                  {transfers.out.map((request) => (
                    <div
                        key={request.id}
                        className="bg-white rounded-lg shadow-sm p-4 mb-3 border "
                    >
                        <div className="grid grid-cols-4 items-center text-sm font-light text-gray-800">
                            <div className="flex justify-center">{request.id}</div>
                            <div className="flex justify-center">{request.from_warehouse?.name}</div>
                            <div className="flex justify-center">{request.to_branch?.name}</div>
                            <div className="flex justify-center gap-2">
                                <Button className="!bg-yellow-500 text-white px-2 py-1 rounded-md text-sm hover:opacity-90" 
                                onClick={() => {
                                    handleViewing(request.id)
                                    setReviewOpen(true)
                                }}>
                                <ScanEye /> View Order
                                </Button>

                                <Button className="!bg-green-700 text-white px-2 py-1 rounded-md text-sm hover:opacity-90" 
                                onClick={() => {
                                    handleViewing(request.id)
                                    setConfirmOpen(true)
                                }}>
                                <Box /> Received Order
                                </Button>

                                
                            </div>
                        </div>
                    </div>
                ))}
                </>
            }
            </div>

         <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
            <DialogContent className="max-w-lg">
                <DialogTitle>
                <ProcurementHeader label="Transfer Receipt" />
                </DialogTitle>

                <div className="space-y-5 mt-3 text-sm">
                <div className="border-b pb-2">
                    <p className="font-medium">
                    <strong>From Warehouse:</strong>{" "}
                    <span className="text-gray-700">
                        {viewing?.from_warehouse?.name}
                    </span>
                    </p>
                    <p className="font-medium">
                    <strong>TO:</strong>{" "}
                    <span className="text-gray-700">{viewing?.to_branch?.name}</span>
                    </p>
                </div>

                {/* Items Table */}
                <div>
                    <h3 className="font-semibold mb-2">Requested Items</h3>
                    <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 bg-gray-100 px-3 py-2 font-semibold text-gray-700 text-xs">
                        <div>SKUID</div>
                        <div>Item Name</div>
                        <div className="text-right">Quantity</div>
                    </div>
                    {viewing?.transfer_item?.map((item, index) => (
                        <div
                        key={index}
                        className="grid grid-cols-3 px-3 py-2 border-t text-gray-700 text-xs"
                        >
                        <div className="truncate">{item.inventory_item.skuid}</div>
                        <div>{item.inventory_item.name}</div>
                        <div className="text-right">{item.quantity}</div>
                        </div>
                    ))}
                    </div>
                </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                <Button
                    variant="outline"
                    className="text-gray-600 border-gray-300"
                    onClick={() => setReviewOpen(false)}
                >
                    Cancel
                </Button>
                </div>
            </DialogContent>
            </Dialog>

            {/* Confirm Dialog */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="max-w-lg">
                    <DialogTitle>
                        <ProcurementHeader label="Confirm Delivery" />
                    </DialogTitle>
                    <p>Are you sure you have received the order?</p>
                    <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        className="text-gray-600 border-gray-300"
                        onClick={() => setConfirmOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="!bg-green-700 text-white px-3 py-1 rounded-md"
                        onClick={() => {
                        setConfirmOpen(false);
                        handleReceived(viewing!.id)
                        }}
                    >
                        Yes, Received
                    </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}