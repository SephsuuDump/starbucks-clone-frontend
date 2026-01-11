import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { formatToPeso } from "@/lib/formatter";
import { SalesSummaryService } from "@/services/sales/summaryService";
import { ChartColumnStacked, Handshake, PhilippinePeso, Quote, Scale, ShoppingBag, UsersRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"

const COLORS = ["#166534", "#22c55e", "#f97316"]

export function EcommerceManagerPage() {
    const router = useRouter();
    const { data: summary, loading } = useFetchOne(SalesSummaryService.getSalesSummary);

    if (loading || !summary) return <div>Loading</div>

    const summaryCards = [
        { icon: PhilippinePeso, count: formatToPeso(summary.totalSales), title: "Total Sales", href: '' },
        { icon: ShoppingBag, count: summary.ordersToday, title: "Orders Today", href: '/sales/orders' },
        { icon: Handshake, count: summary.totalProducts, title: "Total Products", href: '/sales/products' },
        { icon: UsersRound, count: summary.totalCustomers, title: "Total Customers", href: '/sales/customers' },
        { icon: Quote, count: summary.totalQuotations, title: "Quotiations", href: '/sales/quotations' },
        { icon: Handshake, count: summary.totalCases, title: "Support Cases", href: '/sales/support-cases' },
        { icon: Scale, count: summary.totalDiscounts, title: "Starbucks Discounts", href: '/sales/discounts' },
        { icon: ChartColumnStacked, count: "————", title: "Reports", href: '/sales/reports' },
    ] 
    return (
        <section className="w-full flex flex-col gap-2">
            <ProcurementHeader label="Sales and Customer Support" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {summaryCards.map((item, index) => {
                    const Icon = item.icon
                    return (
                        <Button
                            onClick={ () => { router.push(item.href) } }
                            key={index}
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-start gap-3 transition border border-green-600 hover:shadow-green-900 hover:shadow-xs"
                        >
                            <div className="flex w-full items-center justify-between">
                                <span className="text-sm uppercase font-extrabold text-orange-900">
                                    {item.title}
                                </span>
                                <Icon className="h-5 w-5 text-primary" />
                            </div>

                            <Separator />

                            <div className="text-2xl font-extrabold text-green-900">
                                {typeof item.count === "number"
                                    ? item.count.toLocaleString()
                                    : item.count}
                            </div>
                        </Button>
                    )
                })}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-2">
                <div className="w-full rounded-lg border bg-white p-5 shadow-xs shadow-green-200">
                    <div className="mb-4">
                        <h2 className="text-lg font-extrabold text-orange-900">SALES OVERVIEW</h2>
                        <p className="text-sm text-muted-foreground">
                            Monthly sales and order trends
                        </p>
                    </div>

                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={buildLastMonthsData(summary.salesOverview)}>
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
                <div className="w-full rounded-lg border bg-white p-5 shadow-xs shadow-green-200">
                    <div className="mb-4">
                        <h2 className="text-lg font-extrabold text-orange-900">CUSTOMER INSIGHTS</h2>
                        <p className="text-sm text-muted-foreground">
                            Customer distribution by activity status
                        </p>
                    </div>

                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={summary.customerInsights}
                                    dataKey="count"
                                    nameKey="type"
                                    cx="40%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={4}
                                >
                                    {summary.customerInsights.map((_: any, index: number) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />
                                <Legend
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="w-full overflow-hidden rounded-xl border bg-white shadow-sm shadow-green-200 mt-2 mb-8">
                <div className="flex-center-y justify-between px-5 py-4 border-b">
                    <div>
                        <h3 className="text-lg font-extrabold text-orange-900">LATEST ORDERS</h3>
                        <p className="text-sm text-muted-foreground">
                            Recent customer transactions
                        </p>
                    </div>
                    <Link 
                        href="/sales/orders?date=ALL"
                        className="underline text-sm font-semibold text-green-900"
                    >
                        MORE ORDERS
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Order ID</th>
                                <th className="px-4 py-3 text-left font-medium">Customer</th>
                                <th className="px-4 py-3 text-left font-medium">Branch</th>
                                <th className="px-4 py-3 text-center font-medium">Payment</th>
                                <th className="px-4 py-3 text-center font-medium">Status</th>
                                <th className="px-4 py-3 text-right font-medium">Amount</th>
                                <th className="px-4 py-3 text-right font-medium">Date</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {summary.latestOrders.map((order: any) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-3 font-mono text-sm">
                                        OID-{order.id.slice(0, 8)}…
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="font-medium">
                                            {order.customer?.first_name}{" "}
                                            {order.customer?.last_name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {order.customer?.city}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        {order.branch?.name ?? "—"}
                                    </td>

                                    <td className="px-4 py-3 text-center uppercase text-xs">
                                        {order.payment_mode}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                                                order.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : order.status === "PAID"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-right font-semibold">
                                        { formatToPeso(order.total_amount) }
                                    </td>

                                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

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
