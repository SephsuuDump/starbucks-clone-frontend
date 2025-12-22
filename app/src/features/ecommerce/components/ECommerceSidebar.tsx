"use client"

import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function EcommerceSidebar({ categories, tab, setTab }: {
    categories: string[]
    tab: string
    setTab: (i: string) => void
}) {
    return (
        <section className="p-4 w-75 h-[95vh] bg-green-900 shadow-sm rounded-md sticky top-0">
            <div className="flex-center-y justify-between">
                <Image
                    src='/svg/logo2.svg'
                    alt="Starbucks"
                    width={150}
                    height={150}
                    className="drop-shadow-[0_4px_8px_rgba(255,255,255,0.25)]"
                />
                <Link 
                    href="/ecommerce/account"
                    className="bg-white rounded-full"
                >
                    <CircleUserRound className="text-green-950 w-8 h-8" />
                </Link>
            </div>
            <div className="flex flex-col mt-4">
                {categories.map((item, i) => (
                    <button 
                        key={i}
                        onClick={ () => setTab(item) }
                        className={`py-2 rounded-sm text-white font-semibold tracking-wider hover:bg-green-800 ${tab === item && "!bg-white !text-orange-900 !font-extrabold"}`}
                    >
                        { item }
                    </button>
                ))}
            </div>
        </section>
    )
}