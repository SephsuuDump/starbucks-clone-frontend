"use client"

import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarProvider } from "../ui/sidebar";

export function AppSidebar()  {
    const pathName = usePathname();
    if (pathName === "/auth") return null;
    return(
        <Sidebar>
            <SidebarContent className="bg-white shaddow-sm">

            </SidebarContent>
        </Sidebar>
    )
}