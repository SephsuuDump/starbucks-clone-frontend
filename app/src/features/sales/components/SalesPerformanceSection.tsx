import { EmptyState } from "@/components/custom/EmptyState"
import { Pagination } from "@/components/custom/Pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { useFetchData } from "@/hooks/use-fetch-data"
import { usePagination } from "@/hooks/use-pagination"
import { useSearchFilter } from "@/hooks/use-search-filter"
import { formatToPeso } from "@/lib/formatter"
import { SalesReportService } from "@/services/sales/reportService"
import { File } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"
import { toast } from "sonner"

export function SalesPerformanceSection() {
    const { data: previousSales, loading: previousSalesLoading } =
        useFetchData(SalesReportService.getPastMonthSales)

    const { data: productSales = [], loading: productSalesLoading } =
        useFetchData(SalesReportService.getProductMonthlySales)

    const { setSearch, filteredItems } =
        useSearchFilter(productSales, ["product_name"])

    const groupedByMonth = useMemo(() => {
        const map = new Map<string, any[]>()

        filteredItems.forEach((s: any) => {
            if (!map.has(s.month)) {
                map.set(s.month, [])
            }
            map.get(s.month)!.push(s)
        })

        return Array.from(map.entries()).sort(
            ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
        )
    }, [filteredItems])

    const monthOptions = useMemo(() => {
        return groupedByMonth.map(([month, sales]) => ({
            value: month,
            label: sales[0].month_label
        }))
    }, [groupedByMonth])

    const [selectedMonth, setSelectedMonth] = useState<string>("")

    useEffect(() => {
        if (monthOptions.length > 0 && !selectedMonth) {
            setSelectedMonth(monthOptions[0].value)
        }
    }, [monthOptions, selectedMonth])

    const selectedSales = useMemo(() => {
        return groupedByMonth.find(([month]) => month === selectedMonth)?.[1] ?? []
    }, [groupedByMonth, selectedMonth])

    const {
        page,
        size,
        setPage,
        paginated
    } = usePagination(selectedSales, 10)

    useEffect(() => {
        setPage(1)
    }, [selectedMonth])

    async function exportProductSalesReport() {
        try {
            const response = await fetch(
                "http://localhost:4000/api/sales-report/export-product-sales-report",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/pdf",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(selectedSales), // ✅ FIXED
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
            a.download = `product-sales-report-${selectedSales[0]?.month_label ?? "all"}.pdf`;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error: any) {
            toast.error(error.message ?? "PDF export failed");
        }
    }

    if (previousSalesLoading || productSalesLoading) {
        return <div>Loading</div>
    }

    return (
        <section className="flex flex-col gap-4 pb-12">

            <div className="w-full rounded-lg border bg-white p-5 shadow-xs shadow-green-200">
                <div className="mb-4">
                    <h2 className="text-lg font-extrabold text-orange-900">
                        SALES OVERVIEW
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Monthly sales and order trends
                    </p>
                </div>

                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={buildLastMonthsData(previousSales)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#166534"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="flex-center-y justify-between">
                <div className="text-xl font-extrabold text-orange-900">
                    PRODUCT MONTHLY SALES 
                    <span className="ml-2 text-green-900 text-[16px]">
                        ({selectedSales[0]?.month_label ?? "—"})
                    </span>
                </div>
                <Button 
                    onClick={exportProductSalesReport}
                    className="!bg-green-900 font-extrabold hover:opacity-90"
                >
                    <File /> EXPORT FILE
                </Button>
            </div>

            <div className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Search product..."
                    className="w-full bg-white"
                    onChange={e => setSearch(e.target.value)}
                />

                <Select
                    value={selectedMonth}
                    onValueChange={setSelectedMonth}
                >
                    <SelectTrigger className="w-[200px] bg-white">
                        <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                        {monthOptions.map(m => (
                            <SelectItem key={m.value} value={m.value}>
                                {m.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedSales.length === 0 && (
                <EmptyState title="No sales data found." />
            )}

            {selectedSales.length > 0 && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center thead">
                        <div className="grid grid-cols-3 w-full">
                            <div className="th">Product</div>
                            <div className="th">Units Sold</div>
                            <div className="th">Revenue</div>
                        </div>
                    </div>

                    {paginated.map((s: any) => (
                        <div
                            key={`${s.product_id}-${s.month}`}
                            className="flex items-center tdata"
                        >
                            <div className="grid grid-cols-3 w-full">
                                <div className="td font-semibold">
                                    {s.product_name}
                                </div>

                                <div className="td">
                                    {s.units_sold}
                                </div>

                                <div className="td font-semibold">
                                    {formatToPeso(s.product_revenue)}
                                </div>
                            </div>
                        </div>
                    ))}

                    <Pagination
                        totalItems={selectedSales.length}
                        itemsPerPage={size}
                        currentPage={page}
                        onPageChange={setPage}
                    />
                </div>
            )}
        </section>
    )
}

function buildLastMonthsData(
    data: { month: string; sales: number }[],
    monthsBack = 6
) {
    const monthNames = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
    ]

    const now = new Date()
    const map = new Map(data.map(item => [item.month, item.sales]))

    return Array.from({ length: monthsBack }).map((_, i) => {
        const d = new Date(
            now.getFullYear(),
            now.getMonth() - (monthsBack - 1 - i),
            1
        )

        const month = monthNames[d.getMonth()]

        return {
            month,
            sales: map.get(month) ?? 0
        }
    })
}
