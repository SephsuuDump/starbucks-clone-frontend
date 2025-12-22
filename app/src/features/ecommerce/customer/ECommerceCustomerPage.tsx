"use client"

import { ShoppingBasket } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EcommerceSidebar } from "../components/ECommerceSidebar";
import { EcommerceProducts } from "../components/ECommerceProducts";
import { toast } from "sonner";
import { OrderDrawer } from "../components/OrderDrawer";
import { OrderInvoice } from "../components/OrderInvoice";
import { useAuth } from "@/hooks/use-auth";
import { useParams } from "next/navigation";

const categories = ["BAKED", "DESSERTS", "FRAPUCCINO", "FRUITS", "ICED CHOCOLATE", "ICED COFFEE", "ICED ESPRESSO", "ICED TEA", "PASTA", "REFRESHERS", "SANDWICHES"]

export function EcommerceCustomerPage() {
    const { id } = useParams();
    const { claims, loading } = useAuth();
    const [open, setOpen] = useState(false);
    const [invoice, setInvoice] = useState(false);
    const [tab, setTab] = useState(categories[0]);
    const [selectedItems, setSelectedItems] = useState<any>([]);

    const productsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = () => {
                if (productsRef.current) {
                document.documentElement.style.setProperty(
                    "--products-width",
                    productsRef.current.offsetWidth + "px"
                );
            }
        };
        update();
        window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
    }, []);

    const handleSelect = (item: any) => {
        const exists = selectedItems.find((i: any) => i.product_id === item.product_id);

        if (exists) {
            toast.warning('Product already in your bag.')
        } else {
            setSelectedItems([...selectedItems, item]);
            toast.success(`${item.name} added to bag.`)
        }
    };

    useEffect(()  => {
        console.log(selectedItems);
    }, [selectedItems])

    if (loading) return <div>Loading</div>
    return (
        <section className="relative flex gap-4 h-screen">
            <button 
                onClick={() => setOpen(true)}
                className="absolute bottom-12 right-8 rounded-full bg-green-200 p-4 shadow-sm cursor-pointer z-50"
            >
                {selectedItems.length > 0 && (
                    <span className="absolute -top-1.5 right-1 flex items-center justify-center 
                    h-6 w-6 rounded-full bg-green-900 text-white text-xs font-semibold shadow-md p-1">
                        { selectedItems.length }
                    </span>
                )}
                <ShoppingBasket className="w-8 h-8" />
            </button>

            <EcommerceSidebar
                categories={ categories }
                tab={ tab }
                setTab={ setTab }
            />

            <div className="flex-1 relative" ref={productsRef}>
                <EcommerceProducts
                    tab={ tab }
                    id={ String(id) }
                    handleSelect={ handleSelect }
                />
                <OrderDrawer
                    open={ open } 
                    setOpen={ setOpen }
                    selectedItems={ selectedItems }
                    setSelectedItems={ setSelectedItems }
                    setInvoice={ setInvoice }
                />
            </div>

            {invoice && (
                <OrderInvoice
                    storeId={ String(id) }
                    claims={ claims }
                    setOpen={ setInvoice }
                    selectedItems={ selectedItems }
                    setSelectedItems={ setSelectedItems }
                />
            )}
        </section>
    )
}