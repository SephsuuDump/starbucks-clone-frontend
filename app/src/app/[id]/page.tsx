"use client"

import { SupplyOrderForm } from "@/components/custom/procurement/SupplyOrderForm";
import { SupplyOrderReceipt } from "@/components/custom/procurement/SupplyOrderReceipt";
import { SupplierService } from "@/services/supplierService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SupplyOrder() {
    const { id } = useParams();
    const [tab, setTab] = useState('form');
    const [loading, setLoading] = useState(true);
    const [supplier, setSupplier] = useState<any>([])
    const [selectedItems, setSelectedItems] = useState<any>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await SupplierService.getSupplierById(String(id));
                setSupplier(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        } 
        fetchData();
    }, [id]);    

    const handleSelect = async (id: string) => {
        if (!selectedItems.find((item: any) => item.id === id)) {
            const selectedItem = supplier.supplier_item.find((item: any) => item.id === id);
            if (selectedItem) {
            setSelectedItems([
                ...selectedItems,
                { id, name: selectedItem.name, 
                    quantity: 1, 
                    description: selectedItem.description,
                    unit_cost: selectedItem.unit_cost
                }
            ]);
            } else {
            console.warn(`Item with code ${id} not found.`);
            }
        }
    };

    const handleQuantityChange = async (id: string, quantity: number) => {
        setSelectedItems(selectedItems.map((item: any) => 
            item.id === id 
                ? { ...item, quantity: quantity || 0 } 
                : item
        ));
    };

    const handleRemove = async (id: string) => {
        setSelectedItems(selectedItems.filter((item: any) => item.id !== id));
    };

    if (loading) return <div>Loading</div>
    return(
        <>
            {tab === 'form' && 
                <SupplyOrderForm 
                    supplier={ supplier }
                    selectedItems={ selectedItems }
                    handleSelect={ handleSelect }
                    handleQuantityChange={ handleQuantityChange }
                    handleRemove={ handleRemove }
                    setTab={ setTab }
                />
            }
            {tab === 'receipt' && 
                <SupplyOrderReceipt 
                    supplier={ supplier }
                    selectedItems={ selectedItems }
                    setTab={ setTab }
                />
            }
        </>
    );
}