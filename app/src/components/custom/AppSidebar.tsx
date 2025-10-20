"use client"

import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarProvider } from "../ui/sidebar";
import Link from "next/link";

export function AppSidebar()  {
    const pathName = usePathname();
    if (pathName === "/auth") return null;
    return(
        <Sidebar>
            <SidebarContent className="bg-white shaddow-sm">
                <Link href={''}>Project Manager</Link>
            </SidebarContent>
        </Sidebar>
    )
}