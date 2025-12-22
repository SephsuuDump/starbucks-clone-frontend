import { SupplyItem } from "./supplyItem";

export interface Supplier {
    id: string;
    created_at: string;
    name: string;
    contact: string;
    rating: number;
    logo_url: string;
    description: string;
    total_sales: number;
    is_active: boolean;
    user_id: string;

    supplier_item?: SupplyItem[];
}