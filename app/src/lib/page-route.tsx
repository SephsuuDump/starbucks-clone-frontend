import { CalendarRange, Landmark, LayoutDashboard, MessageSquareText, PhilippinePeso, ShoppingBasket, ShoppingCart, University } from "lucide-react";
import { Herr_Von_Muellerhoff } from "next/font/google";

export const employeeDashboard = [
    { 
        title: 'Procurement', 
        icon: ShoppingBasket,
        href: '/procurement',
    },
    {
        title: 'Sales and Customer Support',
        icon: PhilippinePeso,
        href: '/sales'
    }
]