import { Supplier } from "@/types/supplier";
import { Bookmark, Star } from "lucide-react";
import Link from "next/link";

export function SupplierCard({ supplier }: { supplier: Supplier }) {
    return(
        <div className="flex flex-col gap-2 rounded-lg shadow-sm bg-white p-1">
            <div className="p-4 bg-orange-50 rounded-sm">
                <div className="flex-center-y justify-between">
                    <div className="flex gap-1">
                        {[...Array(supplier.rating)].map((_, i) => (
                            <Star className="w-4 h-4 text-orange-900" fill="#7e2a0c" key={i} />
                        ))}
                        {[...Array(5 - supplier.rating)].map((_, i) => (
                            <Star className="w-4 h-4 text-orange-900" key={i} />
                        ))}
                    </div>
                    <button><Bookmark className="w-5 h-5 text-green-900" /></button>
                </div>
                <div className="text-3xl py-4">{ supplier.description }</div>
            </div>
            <div className="flex-center-y justify-between px-4 pb-2 my-auto">
                <div className="flex-center-y gap-2">
                    <img src={ supplier.logo_url } alt={ supplier.name } className="w-10 h-10" />
                    <div>
                        <div className="text-sm text-orange-900 font-bold tracking-wider uppercase">{ supplier.name }</div>
                        <div className="text-xs text-gray-500">{ supplier.contact }</div>
                    </div>
                </div>
                <Link
                    href={`/procurement/suppliers/${supplier.id}`}
                    className="text-xs rounded-full bg-green-900 text-white px-3 py-1"
                >
                    View
                </Link>
            </div>
        </div>
    );
}