import { useFetchData } from "@/hooks/use-fetch-data"
import { CustomerService } from "@/services/ecommerce/customerService"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useMemo, useState } from "react"
import { ProductService } from "@/services/ecommerce/productService"
import { formatToPeso } from "@/lib/formatter"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { DiscountService } from "@/services/sales/discountService"
import { toast } from "sonner"
import { OrderItemService, OrderService } from "@/services/ecommerce/orderService"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProcurementHeader } from "@/features/procurement/components/Header"

const branches = [
    { id: "032e6326-d605-4e4d-a0de-8c5f62f70774", name: "STARBUCKS HIRAYA" },
    { id: "0b0f48e1-6866-4776-9ce9-31309f5f4dbe", name: "STARBUCKS TRECE" },
]

export function CreateQuotation({ setOpen }: any) {
    const [onProcess, setProcess] = useState(false);
    const [order, setOrder] = useState<{
        branch_id: string
        customer_id: string
        selectedItems: {
            product_id: string
            name: string
            quantity: number
            unit_price: number
            image_url: string
        }[]
        discounts: {
            discount_id: string
            name: string
            type: "Discount Percentage" | "Fixed Amount"
            value: number
        }[]
    }>({
        branch_id: branches[0].id,
        customer_id: "",
        selectedItems: [],
        discounts: []
    })

    const { data: branchProducts, loading: loadingBranchProducts } = useFetchData(
        ProductService.getByBranch,
        [order.branch_id],
        [order.branch_id]
    )

    const { data: discounts, loading: loadingDiscounts } = useFetchData(
        DiscountService.getAllDiscounts,
    )    

    const { data: customers, loading: loadingCustomers } = useFetchData(
        CustomerService.getAllCustomers
    ) 

    const handleSelect = (id: string) => {
        if (!order.selectedItems.find((item) => item.product_id === id)) {
            const selectedItem = branchProducts.find((item) => item.id === id)

            if (!selectedItem) {
            console.warn(`Product with id ${id} not found`)
            return
            }

            setOrder(prev => ({
            ...prev,
            selectedItems: [
                ...prev.selectedItems,
                {
                product_id: selectedItem.id,
                name: selectedItem.name,
                quantity: 1,
                unit_price: selectedItem.price,
                image_url: selectedItem.image_url
                }
            ]
            }))
        }
    }

    const handleQuantityChange = (id: string, quantity: number) => {
        setOrder(prev => ({
            ...prev,
            selectedItems: prev.selectedItems.map(item =>
            item.product_id === id
                ? { ...item, quantity: quantity || 1 }
                : item
            )
        }))
    }

    const handleRemove = (id: string) => {
        setOrder(prev => ({
            ...prev,
            selectedItems: prev.selectedItems.filter(item => item.product_id !== id)
        }))
    }

    const handleDiscountSelect = (id: string) => {
        if (order.discounts.find(d => d.discount_id === id)) {
            return
        }

        const selectedDiscount = discounts.find(
            (discount: any) => discount.id === id
        )

        if (!selectedDiscount) {
            console.warn(`Discount with id ${id} not found`)
            return
        }

        setOrder(prev => ({
            ...prev,
            discounts: [
                ...prev.discounts,
                {
                    discount_id: selectedDiscount.id,
                    name: selectedDiscount.name,
                    type: selectedDiscount.type,
                    value: selectedDiscount.value
                }
            ]
        }))
    }

    const handleRemoveDiscount = (id: string) => {
        setOrder(prev => ({
            ...prev,
            discounts: prev.discounts.filter(
                discount => discount.discount_id !== id
            )
        }))
    }

    const computeSubtotal = () => {
        return order.selectedItems.reduce(
            (sum, item) => sum + item.quantity * item.unit_price,
            0
        )
    }

    const computeTotalDiscount = (subtotal: number) => {
        let total = subtotal

        order.discounts.forEach(discount => {
            if (discount.type === "Discount Percentage") {
                total -= total * (discount.value / 100)
            }

            if (discount.type === "Fixed Amount") {
                total -= discount.value
            }
        })

        return Math.max(subtotal - total, 0)
    }

    const computeGrandTotal = () => {
        const subtotal = computeSubtotal()
        let total = subtotal

        order.discounts.forEach(discount => {
            if (discount.type === "Discount Percentage") {
                total -= total * (discount.value / 100)
            }

            if (discount.type === "Fixed Amount") {
                total -= discount.value
            }
        })

        return Math.max(total, 0)
    }

    const subtotal = useMemo(
        () => computeSubtotal(),
        [order.selectedItems]
    )

    const grandTotal = useMemo(
        () => computeGrandTotal(),
        [order.selectedItems, order.discounts]
    )

    const totalDiscount = useMemo(
        () => subtotal - grandTotal,
        [subtotal, grandTotal]
    )

    async function handleSubmit() {
        try {
            setProcess(true)
            const data = await OrderService.createOrder({
                id: order.customer_id,
                total_amount: grandTotal,
                branch_id: order.branch_id,
                payment_mode: "mastercard",
                discount_amount: totalDiscount,
            });
            const orderItemsData = await OrderItemService.createOrderItem(order.selectedItems.map((item: any) => ({
                ...item,
                total_price: item.quantity * item.unit_price,
                order_id: data.id,
                image_url: undefined,
                name: undefined
            })));
            const orderDiscountsData = await DiscountService.createOrderDiscount(order.discounts.map((item: any) => ({
                order_id: data.id,
                discount_id: item.discount_id
            })));
            if (data && orderItemsData && orderDiscountsData) {
                toast.success('Quotation created sucessfully.');
                setOpen(false);
            }
        } catch (error) {
            toast.error(String(error))
        } finally { setProcess(false) }
    }

    if (loadingCustomers) return (
        <Drawer open>
            <DrawerContent className="fixed mx-auto left-0 top-0 h-full w-[var(--products-width)] !max-w-none border-l rounded-none p-4">
                <DrawerTitle className="flex-center-y justify-between">
                    <ProcurementHeader label="loading..." />
                </DrawerTitle>
            </DrawerContent>
        </Drawer>
    )
    return (
        <Drawer open onOpenChange={ setOpen }>
            <DrawerContent className="fixed mx-auto left-0 top-0 h-full w-[var(--products-width)] !max-w-none border-l rounded-none p-4">
                <DrawerTitle className="flex-center-y justify-between">
                    <ProcurementHeader label="create quotation" />
                </DrawerTitle>

                <div className="relative overflow-y-auto">
                    <div className="my-2 font-extrabold text-orange-900 text-[16px]">SELECT BRANCH AND CUSTOMER</div>

                    <div className="flex-center-y gap-2">
                        <Select 
                            value={ order.customer_id }
                            onValueChange={ (value) => setOrder(prev => ({
                                ...prev,
                                customer_id: value
                            }))}
                        >
                            <SelectTrigger className="text-lg font-extrabold shadow shadow-green-900 uppercase">
                                <SelectValue placeholder="SELECT CUSTOMER" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map((item) => (
                                    <SelectItem key={item.id} value={item.id} className="text-[16px] font-extrabold uppercase">
                                        { item.first_name ?? "-" } { item.last_name ?? "-" }
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={ order.branch_id }
                            onValueChange={ (value) => setOrder(prev => ({
                                ...prev,
                                branch_id: value
                            }))}
                        >
                            <SelectTrigger className="text-lg font-extrabold shadow shadow-green-900">
                                <SelectValue placeholder="SELECT CUSTOMER" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((item) => (
                                    <SelectItem key={item.id} value={item.id} className="text-[16px] font-extrabold">
                                        { item.name }
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator className="h-2 bg-gray-300 my-4" />

                    <div className="my-2 font-extrabold text-orange-900 text-[16px]">SELECT PRODUCTS</div>

                    {loadingBranchProducts ? (
                        <div className="font-extrabold my-4 text-center">Loading...</div>
                    ) : (
                        <div className="">
                            <div className="thead grid grid-cols-[1fr_1fr_1fr_1fr_auto]">
                                <div className="th">Product</div>
                                <div className="th">Quantity</div>
                                <div className="th">Unit Price</div>
                                <div className="th">Total</div>
                                <div className="th w-10"></div>
                            </div>

                            {order.selectedItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="tdata grid grid-cols-[1fr_1fr_1fr_1fr_auto]"
                                >
                                    <div className="td flex-center-y gap-2">
                                        <Image
                                            src={item.image_url}
                                            alt=""
                                            width={40}
                                            height={40}
                                            className="rounded"
                                        />
                                        <span className="font-semibold">
                                            {item.name}
                                        </span>
                                    </div>

                                    <div className="td">
                                        <input
                                            min={1}
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    item.product_id,
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="text-[16px] font-semibold w-18 border rounded-sm bg-slate-100 pl-2"
                                        />
                                    </div>

                                    <div className="td">
                                        {formatToPeso(item.unit_price)}
                                    </div>

                                    <div className="td">
                                        {formatToPeso(item.quantity * item.unit_price)}
                                    </div>

                                    <div className="td w-10">
                                        <button
                                            onClick={() =>
                                                handleRemove(item.product_id)
                                            }
                                        >
                                            <Trash2 className="w-4 h-4 text-orange-900" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="grid grid-cols-6">
                                <Select onValueChange={handleSelect}>
                                    <SelectTrigger className="h-15 text-[16px] font-extrabold uppercase">
                                        <SelectValue placeholder="Select Product">
                                            Select Product
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Branch Products</SelectLabel>
                                            {branchProducts.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <Separator className="h-2 bg-gray-300 my-4" />

                    <div className="my-2 font-extrabold text-orange-900 text-[16px]">SELECT DISCOUNT</div>

                    {loadingDiscounts ? (
                        <div className="font-extrabold my-4 text-center">Loading...</div>
                    ) : (
                        <div className={``}>
                            <div className="thead grid grid-cols-[1fr_1fr_auto]">
                                <div className="th">Discount</div>
                                <div className="th">Value</div>
                                <div className="th w-10"></div>
                            </div>

                            {order.discounts.map((discount, index) => (
                                <div
                                    key={index}
                                    className="tdata grid grid-cols-[1fr_1fr_auto]"
                                >
                                    <div className="td font-semibold">
                                        {discount.name}
                                    </div>

                                    <div className="td">
                                        {discount.type === "Discount Percentage"
                                            ? `${discount.value}%`
                                            : formatToPeso(discount.value)}
                                    </div>

                                    <div className="td w-10">
                                        <button
                                            onClick={() =>
                                                handleRemoveDiscount(
                                                    discount.discount_id
                                                )
                                            }
                                        >
                                            <Trash2 className="w-4 h-4 text-orange-900" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="grid grid-cols-6">
                                <Select onValueChange={handleDiscountSelect}>
                                    <SelectTrigger className="h-15 text-[16px] font-extrabold uppercase">
                                        <SelectValue placeholder="Select Discount">
                                            Select Discount
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Available Discounts
                                            </SelectLabel>

                                            {discounts.map((discount: any) => (
                                                <SelectItem
                                                    key={discount.id}
                                                    value={discount.id}
                                                >
                                                    {discount.name}
                                                    {" "}
                                                    (
                                                    {discount.type === "Discount Percentage"
                                                        ? `${discount.value}%`
                                                        : formatToPeso(discount.value)}
                                                    )
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <Separator className="h-2 bg-gray-300 my-4" />

                    <div className="flex flex-col items-end pr-8">
                        <div className="font-extrabold pl-4">SUB TOTAL: <span className="text-green-900 text-lg">+ {formatToPeso(subtotal)}</span></div>
                        <div className="font-extrabold">TOTAL DISCOUNT: <span className="text-red-900 text-lg">+ {formatToPeso(totalDiscount)}</span></div>
                        <Separator className="h-2 bg-gray-300 my-2" />
                        <div className="font-extrabold">TOTAL DISCOUNT: <span className="text-green-900 text-lg">+ {formatToPeso(grandTotal)}</span></div>
                    </div>

                    <div className="fixed bottom-2 left-4 flex-center gap-2">
                        <Button
                            onClick={() => setOpen(false)}
                            className="!bg-red-900 font-extrabold hover:opacity-90"
                        >
                            CANCEL
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            className="!bg-green-900 font-extrabold hover:opacity-90"
                            disabled={ onProcess }
                        >
                            CREATE QUOTATION
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}