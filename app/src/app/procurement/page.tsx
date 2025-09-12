"use client"
import { DashboardSummary } from "@/components/custom/procurement/DashboardSummary";
import { RecentOrders } from "@/components/custom/procurement/RecentOrders";
import { useEffect, useState } from "react";
import { recentProcurements } from "../../../public/mock";
import { InvoicePreview } from "@/components/custom/procurement/InvoicePreview";
// import { getData, postData } from "@/services/_main";
import { UserService } from "@/services/userService";
import supabase from "@/lib/supabase";
import { PurchaseOrderService } from "@/services/purchaseOrderService";
import { toast } from "sonner";

export default function Procurement() {
    const [activeDateFilter, setDateFilter] = useState("This week");
    const [activeInvoice, setInvoice] = useState<Record<any, any>>();

    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [orders, setOrders] = useState<Record<any, any>[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await PurchaseOrderService.getAllPurchaseOrders();
                setOrders(data);
                setInvoice(data[0])
            } catch(error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [reload]);

    if (loading) return <div>Loading</div>
    return(
        <section className="flex flex-col gap-2">
            <div className="font-extrabold text-xl text-orange-900 uppercase">Procurement</div>
            <DashboardSummary />
            <div className="grid grid-cols-5 gap-2">
                <RecentOrders
                    activeDateFilter={ activeDateFilter }
                    setDateFilter={ setDateFilter }
                    activeInvoice={ activeInvoice! }
                    setInvoice={ setInvoice }
                    recentOrder={ orders }
                />
                <InvoicePreview 
                    activeInvoice={ activeInvoice! } 
                />
            </div>
        </section>
    );
}