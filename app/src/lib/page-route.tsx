import { Brain, CalendarRange, ClipboardList, FolderOpenDot, HandCoins, Landmark, LayoutDashboard, MessageCircleQuestionMark, MessageSquareText, PhilippinePeso, ShoppingBasket, ShoppingCart, University, UsersRound } from "lucide-react";
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
        title: "Project Management",
        icon: FolderOpenDot,
        href: "http://localhost:3100/project",
        children: [
            {
                title: "Projects",
                href: "http://localhost:3100/project",
            }, 
            {
                title: "Projects Activity",
                href: "http://localhost:3100/project/logs",
            },
            {
                title: "Task",
                href: "http://localhost:3100/project/employee/tasks",
            },
        ]
    },
    {
        title: "Inventory",
        icon: ClipboardList,
        href: "http://localhost:3100/inventory",
        children: [
            {
                title: "Warehouse Inventory",
                href: "http://localhost:3100/inventory",
            },
            {
                title: "Inventory Logs",
                href: "http://localhost:3100/inventory/logs",
            },
            {
                title: "Request Transfer",
                href: "http://localhost:3100/inventory/transfer-request",
            },
            {
                title: "Manage Transfer",
                href: "http://localhost:3100/inventory/manage-transfer",
            },
            {
                title: "Transfer Request List",
                href: "http://localhost:3100/inventory/list-transfer",
            },
            {
                title: "Request to Suppliers",
                href: "/procurement/suppliers",
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
    {
        title: 'Customer Support/Helpdesk',
        icon: MessageCircleQuestionMark,
        href: 'http://localhost:3104'
    },
]