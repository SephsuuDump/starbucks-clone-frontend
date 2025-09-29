import {InventoryStorage} from "@/components/custom/inventory/Inventory";
import { InventoryItem } from "@/components/custom/inventory/inventory_item/InventoryItem";


export default function Inventory()  {
    return(
        <div>
            {/* <InventoryItem /> */}
            <InventoryStorage />
        </div>
    );
}