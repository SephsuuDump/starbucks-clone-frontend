"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { employeeDashboard } from "@/lib/page-route";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export function AppSidebar() {
    const { claims } = useAuth();
    const { open } = useSidebar();
    const pathname = usePathname();

    if (pathname === "/auth" || claims.role === "CUSTOMER") return null;

    const routes = employeeDashboard;
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    // Auto-open dropdown if current route is inside it
    useEffect(() => {
        const activeGroups: Record<string, boolean> = {};

        routes.forEach(route => {
            if (
                route.children?.some((child: any) =>
                    pathname.startsWith(child.href)
                )
            ) {
                activeGroups[route.title] = true;
            }
        });

        setOpenGroups(prev => ({ ...prev, ...activeGroups }));
    }, [pathname, routes]);

    function toggleGroup(title: string) {
        setOpenGroups(prev => ({
            ...prev,
            [title]: !prev[title],
        }));
    }

    return (
        <Sidebar collapsible="icon">
            <SidebarTrigger className="rounded-full shadow-6xl bg-white absolute z-50 right-[-28px] top-[47%] -translate-x-1/2 -translate-y-1/2" />

            <SidebarContent
                className="rounded-md bg-cover border-0"
                style={{ backgroundImage: "url(/images/sidebar_bg.svg)" }}
            >
                <Link href="/auth" className="text-center">
                    <Image
                        src="/svg/logo1.svg"
                        alt="Papiverse Logo"
                        width={open ? 50 : 30}
                        height={open ? 50 : 30}
                        className="mx-auto mt-4"
                    />
                    {open && (
                        <div className="text-orange-900 font-extrabold">
                            {claims.role}
                        </div>
                    )}
                </Link>

                <SidebarMenu className={`mt-4 ${!open && "flex-center"}`}>
                    {routes.map((item: any, i: number) => {
                        const isDropdown = Array.isArray(item.children);
                        const isOpen = openGroups[item.title];

                        return (
                            <div key={i} className="w-full">
                                {/* PARENT ITEM */}
                                {isDropdown ? (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            onClick={() => toggleGroup(item.title)}
                                            className={`flex items-center justify-between w-full pl-4 ${
                                                !open && "justify-center"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <item.icon className="w-4 h-4" />
                                                {open && item.title}
                                            </div>

                                            {open && (
                                                <ChevronDown
                                                    className={`w-4 h-4 transition-transform ${
                                                        isOpen ? "rotate-180" : ""
                                                    }`}
                                                />
                                            )}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ) : (
                                    <Link href={item.href} className="w-full">
                                        <SidebarMenuItem>
                                            <SidebarMenuButton className="flex gap-2 pl-4">
                                                <item.icon className="w-4 h-4" />
                                                {open && item.title}
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </Link>
                                )}

                                {/* CHILDREN */}
                                {isDropdown && isOpen && open && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {item.children.map(
                                            (child: any, idx: number) => (
                                                <Link
                                                    href={child.href}
                                                    key={idx}
                                                    className={`block rounded-md px-3 py-1 text-sm hover:bg-slate-100 ${
                                                        pathname === child.href
                                                            ? "bg-slate-100 font-semibold"
                                                            : ""
                                                    }`}
                                                >
                                                    {child.title}
                                                </Link>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}
