import { Brain, CalendarRange, ClipboardList, HandCoins, Landmark, LayoutDashboard, MessageSquareText, PhilippinePeso, ShoppingBasket, ShoppingCart, University, UsersRound } from "lucide-react";
import { Herr_Von_Muellerhoff } from "next/font/google";

export const employeeDashboard = [
    { 
        title: 'Procurement', 
        icon: ShoppingBasket,
        href: 'http://localhost:3100/procurement',
    },
    {
        title: 'Sales and Customer Support',
        icon: PhilippinePeso,
        href: 'http://localhost:3100/sales'
    },
    {
        title: "Inventory",
        icon: ClipboardList,
        href: "http://localhost:3100/inventory",
        children: [
            {
                title: "Inventory Logs",
                href: "http://localhost:3100/inventory/logs",
            },
            {
                title: "Request Transfer",
                href: "http://localhost:3100/inventory/transfer-request",
            },
            {
                title: "Transfer Request List",
                href: "http://localhost:3100/inventory/list-transfer",
            },
        ]
    },
    {
        title: 'Human Resource',
        icon: UsersRound,
        href: 'http://localhost:3101'
    },
    {
        title: 'Business Intelligence',
        icon: Brain,
        href: 'http://localhost:3102'
    },
    {
        title: 'Accounting and Finance',
        icon: HandCoins,
        href: 'http://localhost:3103'
    },
]