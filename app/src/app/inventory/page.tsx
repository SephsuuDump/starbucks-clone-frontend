import {BranchInventory} from "@/components/custom/inventory/BranchInventory";
import { InventoryItem } from "@/components/custom/inventory/inventory_item/InventoryItem";


export default function Inventory()  {
    return(
        <div>
            {/* <InventoryItem /> */}
            <BranchInventory />
        </div>
    );
}