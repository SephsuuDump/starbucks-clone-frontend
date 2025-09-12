import { ProcurementBadge } from "@/components/ui/badge";
import { ChevronRight, CircleCheckBig, Hourglass, X } from "lucide-react";
import Link from "next/link";

interface Props {
    activeDateFilter: string;
    setDateFilter: (i: string) => void;
    activeInvoice: Record<any, any>;
    setInvoice: (i: object) => void;
    recentOrder: Record<any, any>[];
}

const dateFilters = ["This week", "This month", "This Caya", "Last 3 months"];

export function RecentOrders({ activeDateFilter, setDateFilter, activeInvoice, setInvoice, recentOrder }: Props) {
    return(
        <div className="col-span-3 rounded-md shadow-sm bg-white p-3">
            <div className="flex justify-between">
                <div className="text-lg font-extrabold text-orange-900 uppercase my-2">Recent Orders</div>
                <Link 
                    href="/procurement/order-history"
                    className="text-orange-900 text-xs"
                >
                    View All
                </Link>
            </div>
            <div className="flex border-slate-200 shadow-xs">
                {dateFilters.map((item, _) => (
                    <button
                        key={_}
                        onClick={ () => setDateFilter(item) }
                        className={`w-full text-sm p-1 ${activeDateFilter === item && "bg-orange-100 text-orange-900"}`}
                    >
                        { item }
                    </button>
                ))}
            </div>
            <div className="flex flex-col">
                {recentOrder.length > 0 && recentOrder.map((item, _)  => (
                    <button 
                        key={_}
                        onClick={ () => setInvoice(item) }
                        className={`flex p-2 gap-2 shadow-xs border-1 rounded-md ${activeInvoice === item && "bg-slate-100"}`}
                    >
                        <div className="w-full">
                            <div className="flex-center-y gap-2">
                                {item.status === "PENDING" || item.status === "SENT" ? 
                                    <Hourglass className="h-4 w-4 text-yellow-600 animate-spin" /> 
                                : item.status === 'APPROVED' || item.status === "CONFIRMED" ?
                                    <CircleCheckBig className="h-4 w-4 text-green-600 animate-pulse" /> 
                                : <X className="h-4 w-4 text-red-600 animate-pulse" /> }
                                <div className="text-sm font-semibold">{ item.supplier.name }</div>
                                <div className="font-semibold text-xs text-slate-500">{ item.type }</div>
                                <ProcurementBadge label={ item.status }/>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-20 ml-6 text-lg font-semibold">{ "34" } <span className="text-xs text-gray-500">items</span></div>
                                <div className="mt-auto mb-1.5 h-2 w-full rounded-sm bg-gray-300">
                                    <div className={`bg-orange-900 rounded-sm h-2 ${item.status === 'PENDING' ? "w-1/2" : item.status === 'APPROVED' ? "w-full" : "w-0"}`}></div>
                                </div>
                            </div>
                        </div>
                        <div className="my-auto"><ChevronRight className={`w-5 h-5 scale-y-125 ${activeInvoice === item ? "text-black" : "text-gray-400"}`}/></div>
                    </button>
                ))}
            </div>
        </div>
    );
}