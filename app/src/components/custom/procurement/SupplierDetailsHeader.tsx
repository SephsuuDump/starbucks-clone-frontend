import { Supplier } from "@/types/supplier";
import { Star } from "lucide-react";
import Image from "next/image";

export function SupplierDetailsHeader({ supplier }: { supplier: Supplier }) {
    return(
        <div className="flex gap-4 p-4 bg-slate-50 rounded-md shadow-sm">
            <Image
                src={ supplier.logo_url }
                alt={ supplier.name }
                width={200}
                height={200}
            />
            <div className="h-full">
                <div className="font-extrabold text-xl text-orange-900 uppercase">{ supplier.name }</div>
                <div className="text-sm text-gray-500 font-bold">{ supplier.contact }</div>
                <div className="flex gap-1 mt-4">
                    {[...Array(supplier.rating)].map((_, i) => (
                        <Star className="w-4 h-4 text-green-900" fill="#0d542b" key={i} />
                    ))}
                    {[...Array(5 - supplier.rating)].map((_, i) => (
                        <Star className="w-4 h-4 text-green-900" key={i} />
                    ))}
                </div>
            </div>

            <div className="ms-auto flex gap-8">
                <div>
                    <div className="text-2xl font-bold scale-x-120 text-green-900">{ supplier.total_sales }</div>
                    <div className="-ml-2 text-xs font-extrabold uppercase tracking-wider">Total</div>
                    <div className="-ml-2 text-xs font-extrabold uppercase tracking-wider">Sales</div>
                </div>
                <div>
                    <div className="text-2xl font-bold scale-x-120 text-green-900">{ supplier.supplier_item!.length }</div>
                    <div className="-ml-1.5 text-xs font-extrabold uppercase tracking-wider">Total</div>
                    <div className="-ml-1.5 text-xs font-extrabold uppercase tracking-wider">Items</div>
                </div>
            </div>
        </div>
    );
}