import { Button } from "@/components/ui/button";
import { ChevronRight, Container, Eye, HandCoins, LoaderCircle, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function DashboardSummary() {
    return(
        <section className="grid grid-cols-4 gap-2">
            <Link 
                href="/procurement/order-history"
                className="text-start relative flex flex-col gap-2 bg-white shadow-sm rounded-md p-3 pb-4 hover:bg-blue-50"
            >
                <div className="w-full flex-center-y gap-2 font-semibold text-sm">
                    <HandCoins className="w-4 h-4 text-orange-900 animate-pulse"/>
                    <div className="text-green-900">Total Spent</div>
                </div>
                <div className="font-bold text-lg transform scale-x-120 ml-5">₱100,000.00 <span className="text-xs text-gray-500 font-normal">this month.</span></div>
                <div className="absolute top-2 right-1 w-fit ms-auto mt-auto flex-center gap-1 text-[10px] text-orange-900 bg-orange-100 py-0.5 px-2 rounded-md">
                    <div>View All</div>
                    <ChevronRight className="h-3 w-3" />
                </div>
            </Link>
            <Link 
                href="/procurement/pending-orders"
                className="text-start relative flex flex-col gap-2 bg-white shadow-sm rounded-md p-3 pb-4 hover:bg-yellow-50"
            >
                <div className="w-full flex-center-y gap-2 font-semibold text-sm">
                    <LoaderCircle className="w-4 h-4 text-orange-900 animate-spin"/>
                    <div className="text-green-900">Pending Orders</div>
                </div>
                <div className="font-bold text-lg transform scale-x-120 ml-5">100 <span className="text-xs text-gray-500 font-normal">this month.</span></div>
                <div className="absolute top-2 right-1 w-fit ms-auto mt-auto flex-center gap-1 text-[10px] text-orange-900 bg-orange-100 py-0.5 px-2 rounded-md">
                    <div>View All</div>
                    <ChevronRight className="h-3 w-3" />
                </div>
            </Link>
            <Link 
                href="/procurement/suppliers"
                className="text-start relative flex flex-col gap-2 bg-white shadow-sm rounded-md p-3 pb-4 hover:bg-red-50"
            >
                <div className="w-full flex-center-y gap-2 font-semibold text-sm">
                    <Container className="w-4 h-4 text-orange-900 animate-pulse"/>
                    <div className="text-green-900">Total Suppliers</div>
                </div>
                <div className="font-bold text-lg transform scale-x-120 ml-5">25 <span className="text-xs text-gray-500 font-normal">as of today.</span></div>
                <div className="absolute top-2 right-1 w-fit ms-auto mt-auto flex-center gap-1 text-[10px] text-orange-900 bg-orange-100 py-0.5 px-2 rounded-md">
                    <div>View All</div>
                    <ChevronRight className="h-3 w-3" />
                </div>
            </Link>
            <Link 
                href="/procurement/new-requests"
                className="text-start relative flex flex-col gap-2 bg-white shadow-sm rounded-md p-3 pb-4 hover:bg-green-50"
            >
                <div className="w-full flex-center-y gap-2 font-semibold text-sm">
                    <ShoppingCart className="w-4 h-4 text-orange-900 animate-pulse"/>
                    <div className="text-green-900">New Requests</div>
                </div>
                <div className="font-bold text-lg transform scale-x-120 ml-5">5 <span className="text-xs text-gray-500 font-normal">this month.</span></div>
                <Button className="absolute -top-1 -right-1 !bg-orange-900 !h-5 w-fit text-xs">
                    <Eye /> View
                </Button>
            </Link>
        </section>
    );
}