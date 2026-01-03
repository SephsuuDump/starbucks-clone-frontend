import { AlertDialog, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { formatToPeso } from "@/lib/formatter";
import { OrderItemService, OrderService } from "@/services/ecommerce/orderService";
import { AccountCreditService } from "@/services/procurement/accountCreditService";
import { UserService } from "@/services/userService";
import { LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function OrderInvoice({ storeId, claims, setOpen, selectedItems, setSelectedItems }: {
    storeId: string;
    claims: any
    setOpen: Dispatch<SetStateAction<boolean>>
    selectedItems: any
    setSelectedItems: any
}) {
    const [onProcess, setProcess] = useState(false)
    const [onPayment, setPayment] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState("gcash");

    const totalAmount = selectedItems.reduce((acc: any, i: any) => acc + (i.unit_price * i.quantity), 0);

    async function handleSubmit() { 
        try {
            setProcess(true)
            const data = await OrderService.createOrder({
                id: claims.id,
                total_amount: totalAmount,
                branch_id: storeId,
                payment_mode: selectedPayment
            });
            const orderItemsData = await OrderItemService.createOrderItem(selectedItems.map((item: any) => ({
                ...item,
                total_price: item.quantity * item.unit_price,
                order_id: data.id,
                image_url: undefined,
                name: undefined
            })));
            if (data && orderItemsData) {
                setSelectedItems([])
            }
        } catch (error) { toast.error(`${error}`) }
        finally { setProcess(false) }
    }

    return (
        <AlertDialog open onOpenChange={setOpen}>
            <AlertDialogContent className="h-10/11 w-[var(--products-width)] !max-w-none overflow-hidden">
                <div>
                    <AlertDialogTitle className="flex-center-y justify-between mb-4">
                        <div className="flex-center-y gap-2">
                            <Image
                                src='/svg/logo3.svg'
                                alt="Starbucks Logo"
                                width={50}
                                height={50}
                            />
                            <div className="text-xl font-extrabold text-green-900">ORDER SUMMARY</div>
                        </div>
                        <div className="font-extrabold text-xl"><span className="text-lg text-gray-600">TOTAL:</span> { formatToPeso(totalAmount) }</div>
                    </AlertDialogTitle>
                    <div className="mb-6">
                        <div className="font-extrabold text-lg mb-2 text-green-900">PAYMENT METHOD</div>
                        <RadioGroup 
                            value={selectedPayment} 
                            onValueChange={setSelectedPayment}
                            className="grid grid-cols-3 gap-3"
                        >
                            <label
                                htmlFor="gcash"
                                className={`cursor-pointer border rounded-xl px-4 py-2 flex-center-y gap-2 transition 
                                    ${selectedPayment === "gcash" ? "border-green-700 bg-green-50 shadow-sm shadow-green-900" : "border-gray-300"}`}
                            >
                                <RadioGroupItem 
                                    value="gcash" 
                                    id="gcash"
                                    className="hidden"
                                />
                                <div className="flex-center-y gap-2 mx-auto">
                                    <img 
                                        src="/svg/gcash.svg"
                                        className="w-10 h-10" 
                                    />
                                    <div>
                                        <div className="font-extrabold">GCASH</div>
                                        <div className="text-xs text-slate-600">Pay orders via Gcash app.</div>
                                    </div>
                                </div>
                            </label>

                            <label
                                htmlFor="visa"
                                className={`cursor-pointer border rounded-xl p-3 flex-center-y gap-2 transition 
                                    ${selectedPayment === "visa" ? "border-green-700 bg-green-50 shadow-sm shadow-green-900" : "border-gray-300"}`}
                            >
                                <RadioGroupItem 
                                    value="visa" 
                                    id="visa"
                                    className="hidden"
                                />
                                <div className="flex-center-y gap-2 mx-auto">
                                    <img 
                                        src="/svg/visa.svg"
                                        className="w-10 h-10" 
                                    />
                                    <div>
                                        <div className="font-extrabold">CREDIT/DEBIT CARD</div>
                                        <div className="text-xs text-slate-600">Pay orders via VISA Credit/Debit Card.</div>
                                    </div>
                                </div>
                            </label>

                            <label
                                htmlFor="mastercard"
                                className={`cursor-pointer border rounded-xl p-3 flex-center-y gap-2 transition 
                                    ${selectedPayment === "mastercard" ? "border-green-700 bg-green-50 shadow-sm shadow-green-900" : "border-gray-300"}`}
                            >
                                <RadioGroupItem
                                    value="mastercard" 
                                    id="mastercard"
                                    className="hidden"
                                />
                                <div className="flex-center-y gap-2 mx-auto">
                                    <img 
                                        src="/svg/mastercard.svg"
                                        className="w-10 h-10" 
                                    />
                                    <div>
                                        <div className="font-extrabold">MASTERCARD</div>
                                        <div className="text-xs text-slate-600">Pay orders via MasterCard.</div>
                                    </div>
                                </div>
                            </label>
                        </RadioGroup>
                    </div>

                    <div className="overflow-y-auto h-[70vh] pb-12">
                        {selectedItems.map(((item: any, i: any) => (
                            <div className="grid grid-cols-5 border-b border-gray-300" key={i}>
                                <div className="bg-white td col-span-2 flex items-center gap-2">
                                    <Image
                                        src={ item.image_url }
                                        alt={item.name}
                                        width={75}
                                        height={75}
                                        className="object-cover rounded"
                                    />
                                    <span className="text-[16px] font-semibold">{item.name}</span>
                                </div>
                                <div className="bg-white td flex-center-y">
                                    <X className="w-4 h-4" />
                                    <div className="font-bold text-xl">{item.quantity}</div>
                                </div>
                                <div className="bg-white td">{ formatToPeso(item.unit_price) }</div>
                                <div className="bg-white td text-lg font-semibold">{ formatToPeso(item.unit_price * item.quantity) }</div>
                            </div>
                        )))}
                    </div>
                    {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex-center-y gap-2">
                <Button 
                        onClick={ () => setOpen(prev => !prev)}
                        className="font-semibold tracking-wider !bg-red-900 text-lg"
                    >
                        CANCEL ORDER
                    </Button>
                    <Button 
                        // onClick={ handleSubmit }
                        onClick={() => setPayment(true)}
                        disabled={ onProcess }
                        className="font-semibold tracking-wider !bg-green-900 text-lg"
                    >
                        {onProcess ? <><LoaderCircle className="w-4 h-4 animate-spin" />PLACING ORDER</> : "PLACE ORDER"}
                    </Button>
                </div>
                <PaymentDialog 
                    open={ onPayment }
                    onProcess={ onProcess }
                    onOpenChange={ setPayment }
                    invoiceOpen={ setOpen }
                    accountId={ claims.id }
                    paymentMethod={ selectedPayment }
                    totalAmount={ totalAmount }
                    handleOrderProcess={ handleSubmit }
                />
                
            </AlertDialogContent>
        </AlertDialog>
    )
}

interface PaymentProps {
    onProcess: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoiceOpen: (open: boolean) => void;
    accountId: string;
    paymentMethod: string;
    totalAmount: string; 
    handleOrderProcess: any;
}

export function PaymentDialog({ open, onProcess, onOpenChange, accountId, paymentMethod, totalAmount, handleOrderProcess, invoiceOpen }: PaymentProps) {
    async function handleSubmit() {
        try {
            handleOrderProcess();
            const paymentData = await AccountCreditService.chargeCredit({
                user_id: accountId,
                payment_method: paymentMethod,
                total_amount: totalAmount
            })
            if (paymentData) {
                toast.success('Order Purchased Successfully')
                onOpenChange(false)
                invoiceOpen(false)
            }
        } catch (error) {
            toast.error(`${error}`)
        } 
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-extrabold text-green-900">
                        PAYMENT DETAILS
                    </DialogTitle>
                    <DialogDescription>
                        Review your payment information before continuing.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {/* Account ID */}
                    <div>
                        <label className="text-sm font-semibold text-gray-500">Account ID</label>
                        <div className="text-lg font-bold uppercase">{accountId}</div>
                    </div>

                    <Separator />

                    {/* Payment Method */}
                    <div>
                        <label className="text-sm font-semibold text-gray-500">Payment Method</label>
                        <div className="flex-center gap-2">
                            {paymentMethod === "gcash" && (
                                <img 
                                    src="/svg/gcash.svg"
                                    className="w-10 h-10 rounded-lg"
                                />
                            )}
                            {paymentMethod === "visa" && (
                                <img 
                                    src="/svg/visa.svg"
                                    className="w-10 h-10 rounded-lg"
                                />
                            )}
                            {paymentMethod === "mastercard" && (
                                <img 
                                    src="/svg/mastercard.svg"
                                    className="w-10 h-10 rounded-lg"
                                />
                            )}
                            <div className="text-lg font-bold capitalize">{paymentMethod}</div>
                        </div>
                    </div>

                    <Separator />

                    {/* Total Amount */}
                    <div>
                        <label className="text-sm font-semibold text-gray-500">Total Amount</label>
                        <div className="text-2xl font-extrabold text-green-900">{formatToPeso(Number(totalAmount))}</div>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button 
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        CLOSE
                    </Button>

                    <Button 
                        onClick={ handleSubmit }
                        className="bg-green-900 text-white font-semibold"
                        disabled={ onProcess }
                    >
                        CONFIRM PAYMENT
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
