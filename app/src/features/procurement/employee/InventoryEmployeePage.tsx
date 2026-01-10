"use client"

import { ProcurementHeader } from "@/features/procurement/components/Header";
import { useAuth } from "@/hooks/use-auth";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { PurchaseOrderService } from "@/services/procurement/purchaseOrderService";
import { UserService } from "@/services/userService";
import { User } from "@/types/user";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PurchaseOrders } from "./components/PurchaseOrders";
import Link from "next/link";

const tabs = ['Pending', 'Delivered', 'Rejected/Cancelled']

export function InventoryEmployeePage() {
    const { claims, loading: authLoading } = useAuth();
    const { data: user, loading: userLoading } = useFetchOne<User>(
        UserService.getUserByEmployee, 
        [claims], 
        [claims.id])
    ;
    
    const [orders, setOrders] = useState<any[]>([]);
    const [tab, setTab] = useState('Pending');
    const [loadingOrders, setLoadingOrders] = useState<boolean>(false);

    useEffect(() => {
        const fetchOrders = async () => {
        if (!user?.warehouse?.id || authLoading || userLoading) return;

        setLoadingOrders(true);
        try {
            const data = await PurchaseOrderService.getPurchaseOrderByWarehouse(
            user.warehouse.id
            );
            setOrders(data);
        } catch (error) {
            toast.error("❌ Failed to fetch orders:");
        } finally {
            setLoadingOrders(false);
        }
        };

        fetchOrders();
    }, [user, authLoading, userLoading]);

    if (authLoading || userLoading || loadingOrders) return <div>Loading</div>
    return (
        <section className="flex flex-col gap-2">
            <ProcurementHeader label="purchase orders" />
            
            <div className="flex-center-y justify-between">
                <div className="flex-center-y bg-slate-50">
                {tabs.map((item, i) => (
                        <Button 
                            key={i}
                            onClick={ () => setTab(item) }
                            className={`rounded-none !bg-green-900 uppercase font-semibold hover:opacity-90 ${item !== tab && "opacity-30"}`}
                        >
                            { item }
                        </Button>
                    ))}
                </div>
                <Link href="/procurement/suppliers">
                    <Button 
                        className={`rounded-none !bg-orange-900 uppercase font-semibold hover:opacity-90`}
                    >
                        PURCHASE ORDER
                    </Button>
                </Link>
            </div>
            
            {tab === 'Pending' && (
                <PurchaseOrders
                    orders={ orders.filter(i => ['SENT', 'TO REVIEW', 'CONFIRMED'].includes(i.status)) }
                />
            )}

            {tab === 'Delivered' && (
                <PurchaseOrders
                    orders={ orders.filter(i => ['DELIVERED', 'RECEIVED'].includes(i.status)) }
                />
            )}
        </section>
    )
}