import { EmptyState } from "@/components/custom/EmptyState"
import { Pagination } from "@/components/custom/Pagination"
import { Button } from "@/components/ui/button"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFetchData } from "@/hooks/use-fetch-data"
import { usePagination } from "@/hooks/use-pagination"
import { useSearchFilter } from "@/hooks/use-search-filter"
import { formatDateTime, formatToPeso } from "@/lib/formatter"
import { OrderService } from "@/services/ecommerce/orderService"
import { SalesReportService } from "@/services/sales/reportService"
import { EllipsisVertical, File } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

const branches = [
    { id: "032e6326-d605-4e4d-a0de-8c5f62f70774", name: "STARBUCKS HIRAYA" },
    { id: "0b0f48e1-6866-4776-9ce9-31309f5f4dbe", name: "STARBUCKS TRECE" },
]
const tabs = ["ORDERS", "PRODUCTS"]

export function BranchSalesSection() {
    const [tab, setTab] = useState(tabs[0]) 
    const [selectedBranch, setSelectedBranch] = useState(branches[0].id)
    // const { data: branchSales = [], loading: branchSalesLoading } = useFetchData(
    //     SalesReportService.getTopProducts,
    //     [selectedBranch],
    //     [selectedBranch]
    // )

    return (
        <section className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <div className="rounded-full bg-white w-fit mt-4">
                    {tabs.map((item) => (
                        <Button 
                            key={item}
                                onClick={ () => setTab(item) }
                            className={`bg-slate-50 text-black font-extrabold rounded-full hover:!opacity-90 text-[16px] py-5 w-35 ${tab === item && "!bg-green-900 !text-white"}`}
                        >
                            { item }
                        </Button>
                    ))}
                </div>
                <Select
                    value={ selectedBranch }
                    onValueChange={ (value) => setSelectedBranch(value) }
                >
                    <SelectTrigger className="text-lg font-extrabold bg-white">
                        <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                        {branches.map((item) => (
                            <SelectItem key={item.id} value={item.id}>{ item.name }</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="text-xl font-extrabold text-orange-900">
                {tab === "ORDERS" ? "SALES ORDERS" : "PRODUCT SALES"} FROM { branches.find(b => b.id === selectedBranch)?.name }
            </div>

            {tab === "ORDERS" && (
                <SalesOrders branchId={selectedBranch} />
            )}

            {tab === "PRODUCTS" && (
                <ProductSales branchId={selectedBranch} />
            )}

        </section>
    )
}

function SalesOrders({ branchId }: any) {
    const { data: orders = [], loading } = useFetchData(
        OrderService.getByBranch,
        [branchId],
        [branchId]
    )

    const { setSearch, filteredItems } = useSearchFilter(
        orders,
        ["status", "customer.first_name", "customer.last_name"]
    )

    const {
        page,
        size,
        setPage,
        paginated,
    } = usePagination(filteredItems, 10)

    async function exportPdfFile() {
        try {
            const response = await fetch(
                "http://localhost:4000/api/sales-report/export-sales-orders-report",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/pdf",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orders), // ✅ FIXED
                }
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to generate PDF");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `top-products.pdf`;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error: any) {
            toast.error(error.message ?? "PDF export failed");
        }
    }

    if (loading) return <div>Loading</div>

    return (
        <section className="w-full flex flex-col gap-2">

            <div className="flex-center-y justify-between">
                <div className="w-full sm:w-auto">
                    <Input
                        type="text"
                        placeholder="Search orders..."
                        className="bg-white w-100"
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <Button 
                    onClick={exportPdfFile}
                    className="!bg-green-900 font-extrabold hover:opacity-90"
                >
                    <File /> EXPORT FILE
                </Button>
            </div>

            <div className="flex items-center thead">
                <div className="grid grid-cols-6 w-full">     
                    <div className="th">Order ID</div>               
                    <div className="th">Customer</div>
                    <div className="th">Payment</div>
                    <div className="th">Status</div>
                    <div className="th !text-right">Total</div>
                    <div className="th">Date</div>
                </div>
            </div>

            {paginated.length === 0 && (
                <EmptyState title="No orders found." />
            )}

            {paginated.map((o: any) => (
                <div key={o.id} className="flex items-center tdata">
                    <div className="grid grid-cols-6 w-full">
                        <div className="td uppercase hover:underline hover:font-semibold cursor-pointer">
                            <Link href={`/sales/orders/${o.id}`}>OID-{o.id}</Link>
                        </div>

                        <div className="td flex-col !items-start">
                            <div className="font-semibold">
                                {o.customer?.last_name}, {o.customer?.first_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {o.customer?.city}, {o.customer?.country}
                            </div>
                        </div>

                        <div className="td text-xs flex items-center gap-2">
                            {o.payment_mode ? (
                                <img
                                    src={`/svg/${o.payment_mode}.svg`}
                                    className="w-10 h-10 rounded-md"
                                    alt={o.payment_mode}
                                />
                            ) : (
                                <span className="text-muted-foreground italic">
                                    No payment method
                                </span>
                            )}
                        </div>

                        <div className="td">
                            <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                    o.status === "COMPLETED"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {o.status}
                            </span>
                        </div>

                        <div className="td font-semibold text-green-900 justify-end">
                            {formatToPeso(o.total_amount)}
                        </div>

                        <div className="td text-xs">
                            {formatDateTime(o.created_at)}
                        </div>
                    </div>

                </div>
            ))}

            <Pagination
                totalItems={filteredItems.length}
                itemsPerPage={size}
                currentPage={page}
                onPageChange={setPage}
            />
        </section>
    )
}

function ProductSales({ branchId }: any) {
    const { data: productSales = [], loading } = useFetchData(
        SalesReportService.getTopProductsByBranch,
        [branchId],
        [branchId]
    )

    const {
        page,
        size,
        setPage,
        paginated,
    } = usePagination(productSales, 10)

    async function exportPdfFile() {
        try {
            const response = await fetch(
                "http://localhost:4000/api/sales-report/export-top-products-period-report",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/pdf",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(productSales), // ✅ FIXED
                }
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to generate PDF");
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `top-products.pdf`;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error: any) {
            toast.error(error.message ?? "PDF export failed");
        }
    }

    if (loading) return <div>Loading</div>

    return (
        <section className="w-full flex flex-col gap-2">
            <Button 
                onClick={exportPdfFile}
                className="!bg-green-900 font-extrabold hover:opacity-90 ms-auto"
            >
                <File /> EXPORT FILE
            </Button>
            <div className="flex items-center thead">
                <div className="flex-center w-20 th">#</div>
                <div className="grid grid-cols-3 w-full">
                    <div className="th">Product</div>
                    <div className="th">Units Sold</div>
                    <div className="th text-right">Sales</div>
                </div>
            </div>

            {paginated.length === 0 && (
                <EmptyState title="No product sales found." />
            )}

            {paginated.map((p: any, i: number) => (
                <div
                    key={p.product_id}
                    className="flex items-center tdata"
                >
                    <div className="td flex-center w-20 font-semibold">
                        {(page - 1) * size + i + 1}
                    </div>

                    <div className="grid grid-cols-3 w-full">
                        <div className="td gap-2">
                            <img
                                src={p.image_url}
                                alt={p.product_name}
                                className="w-12 h-12 rounded-md object-cover"
                            />
                            <div className="font-semibold">
                                {p.product_name}
                            </div>
                        </div>

                        <div className="td">
                            {p.total_quantity_sold}
                        </div>

                        <div className="td justify-end text-green-900 font-semibold">
                            {formatToPeso(p.total_revenue)}
                        </div>
                    </div>
                </div>
            ))}

            <Pagination
                totalItems={productSales.length}
                itemsPerPage={size}
                currentPage={page}
                onPageChange={setPage}
            />
        </section>
    )
}