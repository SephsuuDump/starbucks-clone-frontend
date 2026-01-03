import { EmptyState } from "@/components/custom/EmptyState";
import { Pagination } from "@/components/custom/Pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFetchData } from "@/hooks/use-fetch-data";
import { usePagination } from "@/hooks/use-pagination";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { formatToPeso } from "@/lib/formatter";
import { SalesReportService } from "@/services/sales/reportService";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function SalesPerformanceSection() {
    const { data: previousSales, loading: previousSalesLoading } = useFetchData(
        SalesReportService.getPastMonthSales
    );

    const { data: productSales = [], loading: productSalesLoading } = useFetchData(
        SalesReportService.getProductMonthlySales
    )

    const { setSearch, filteredItems } = useSearchFilter(
        productSales,
        ["product_name"]
    )

    const months = useMemo(() => {
        const unique = new Map()
        previousSales.forEach((s: any) => {
        unique.set(s.month, s.month_label)
        })
        return Array.from(unique.entries())
    }, [previousSales])

    const [monthFilter, setMonthFilter] = useState<string>("ALL")

    const filteredSales = useMemo(() => {
        return filteredItems.filter((s: any) => {
        return monthFilter === "ALL" || s.month === monthFilter
        })
    }, [filteredItems, monthFilter])

    const { page, size, setPage, paginated } = usePagination(filteredSales, 10)

    if (previousSalesLoading || productSalesLoading) return <div>Loading</div>
    return (
        <section className="flex flex-col gap-2">
            <div className="w-full rounded-lg border bg-white p-5 shadow-xs shadow-green-200">
                <div className="mb-4">
                    <h2 className="text-lg font-extrabold text-orange-900">SALES OVERVIEW</h2>
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

            <div className="flex flex-wrap items-center gap-2">
                <div className="w-full sm:w-auto flex-1">
                    <Input
                        type="text"
                        placeholder="Search product..."
                        className="w-full bg-white"
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Months</SelectItem>
                        {months.map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center thead">
                <div className="grid grid-cols-4 w-full">
                    <div className="th">Product</div>
                    <div className="th">Units Sold</div>
                    <div className="th">Revenue</div>
                    <div className="th">Actions</div>
                </div>
            </div>


            {paginated.length === 0 && (
                <EmptyState title="No sales data found." />
            )}

            {paginated.map((s: any) => (
                <div
                    key={`${s.product_id}-${s.month}`}
                    className="flex items-center tdata"
                >
                    <div className="grid grid-cols-4 w-full">
                        <div className="td font-semibold">
                            {s.product_name}
                        </div>

                        <div className="td">
                            {s.units_sold}
                        </div>

                        <div className="td font-semibold">
                            {formatToPeso(s.product_revenue)}
                        </div>

                        <div className="td">
                            {/* actions */}
                        </div>
                    </div>
                </div>
            ))}


            <Pagination
                totalItems={filteredSales.length}
                itemsPerPage={size}
                currentPage={page}
                onPageChange={setPage}
            />
        </section>
    )
}

function buildLastMonthsData(
    data: { month: string; sales: number }[],
    monthsBack = 6
) {
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const now = new Date()

    const map = new Map(
        data.map(item => [item.month, item.sales])
    )

    return Array.from({ length: monthsBack }).map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1 - i), 1)
        const month = monthNames[d.getMonth()]

        return {
            month,
            sales: map.get(month) ?? 0
        }
    })
}