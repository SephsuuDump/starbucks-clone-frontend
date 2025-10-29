import { CalendarRange, Landmark, LayoutDashboard, MessageSquareText, ShoppingBasket, ShoppingCart, University } from "lucide-react";
import { Herr_Von_Muellerhoff } from "next/font/google";

export const employeeDashboard = [
    { 
        title: 'Procurement', 
        icon: ShoppingBasket,
        href: '/procurement',
    },
    {
        title: 'E-Commerce',
        icon: ShoppingCart,
        href: '/ecommerce'
    }
]