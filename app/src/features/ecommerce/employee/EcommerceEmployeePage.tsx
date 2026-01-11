import { Button } from "@/components/ui/button";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { formatToPeso } from "@/lib/formatter";
import { NotepadText, PhilippinePeso, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function EcommerceEmployeePage() {
    const router = useRouter();
    const ecommerceSummary = [
        { head: 'Manage Products', body: '————', href: '/ecommerce/products', icon: ShoppingCart },
        { head: 'Manage Orders', body: '————', href: '/ecommerce/orders', icon: NotepadText },
        { head: 'Branch Sales', body: '————', href: '', icon: PhilippinePeso },
    ]
    return (
        <section className="w-full flex flex-col gap-2">
            <ProcurementHeader label="Sales and Customer Support" />
            <div className="flex flex-wrap gap-2">
                {ecommerceSummary.map((item, i) => {
                    const Icon = item.icon

                    return (
                        <Button
                            key={i}
                            onClick={() => router.push(item.href)}
                            variant="outline"
                            className="
                                h-auto
                                flex-1
                                min-w-[260px]
                                max-w-sm
                                p-6
                                flex
                                flex-col
                                items-start
                                gap-3
                                border
                                border-green-600
                                bg-white
                                transition
                                hover:shadow-green-900
                                hover:shadow-xs
                            "
                        >
                            {/* Header */}
                            <div className="flex w-full items-center justify-between">
                                <span className="text-sm uppercase font-extrabold text-orange-900">
                                    {item.head}
                                </span>

                                {Icon && (
                                    <Icon className="h-5 w-5 text-primary" />
                                )}
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px bg-gray-200" />

                            {/* Body / Value */}
                            <div className="text-3xl font-extrabold text-green-900 scale-x-110 origin-left">
                                {item.body}
                            </div>
                        </Button>
                    )
                })}
            </div>


        </section>
    )
}