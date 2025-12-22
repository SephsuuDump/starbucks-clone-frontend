import { Button } from "@/components/ui/button";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { formatToPeso } from "@/lib/formatter";
import Link from "next/link";

export function EcommerceEmployeePage() {
    const ecommerceSummary = [
        { head: 'Manage Products', body: '-', href: '/ecommerce/products' },
        { head: 'Total Orders', body: '120', href: '/ecommerce/orders' },
        { head: 'Branch Sales', body: '120', href: '' },
    ]
    return (
        <section className="w-full flex flex-col gap-2">
            <ProcurementHeader label="E-Commerce" />
            <div className="flex flex-wrap gap-2">
                {ecommerceSummary.map((item, i) => (
                    <article 
                        key={i}
                        className="items-center flex-1 min-w-[260px] max-w-sm rounded-md border bg-white p-6 shadow"
                    >
                        <h3 className="text-[15px]">{ item.head }</h3>
                        <h6 className="text-3xl scale-x-110 origin-left font-semibold">
                            { item.body }
                        </h6>
                        <Link href={ item.href }>
                            <Button 
                                className="w-20 mt-4 !bg-green-900 font-semibold hover:opacity-90"
                                size="sm"
                            >
                                VIEW
                            </Button>
                        </Link>
                    </article>
                ))}
            </div>

        </section>
    )
}