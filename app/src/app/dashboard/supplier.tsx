"use client"

import { SupplierDetailsHeader } from "@/components/custom/procurement/SupplierDetailsHeader";
import { SupplierItem } from "@/components/custom/procurement/SupplierItem";
import { SupplierPurchasedOrders } from "@/components/custom/procurement/SupplierPurchasedOrders";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { UserService } from "@/services/userService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SupplierPage() {
    const activeTab = useSearchParams().get('activeTab');
    const { claims, loading } = useAuth();
    const [user, setUser] = useState<any>();
    const [tab, setTab] = useState(activeTab ?? 'SUPPLIES');
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const userRes = await UserService.getSupplierByUser(claims.id);
                userRes.supplier.supplier_item.sort((a: any, b: any) =>
                    a.name.localeCompare(b.name)
                );
                setUser(userRes);
            } catch (error) { toast.error(`${error}`) }
        }
        fetchData();    
    }, [claims]);    

    if (loading || !user) return <div>Loading</div>
    return(
        <section className="flex flex-col gap-2">
            <SupplierDetailsHeader supplier={ user.supplier } />

            <div className="flex-center-y justify-between">
                <div className="text-lg font-semibold uppercase">SUPPLY ITEMS OF <span className="text-orange-900">{ user.supplier.name }</span></div>
                <div>
                    <Button
                        onClick={ () => setTab('SUPPLIES') }
                        className={`${tab !== 'SUPPLIES' && "opacity-50"} !bg-orange-900 font-semibold rounded-none w-30`}
                    >
                        SUPPLIES
                    </Button>
                    <Button
                        onClick={ () => setTab('ORDERS') }
                        className={`${tab !== 'ORDERS' && "opacity-50"} !bg-green-900 font-semibold rounded-none w-30`}
                    >
                        ORDERS
                    </Button>
                </div>
            </div>

            {tab === 'SUPPLIES' &&
                <SupplierItem
                    open={ open }
                    setOpen={ setOpen }
                    supplierId={ user.supplier.id }
                    supplyItems={ user.supplier.supplier_item }
                />
            }   
            {tab === 'ORDERS' &&
                <SupplierPurchasedOrders
                    supplierId={ user.supplier.id } 
                />
            }
        </section>
    );
}