import {BranchInventory} from "@/components/custom/inventory/BranchInventory";
import { InventoryItem } from "@/components/custom/inventory/inventory_item/InventoryItem";
import { WarehouseInventory } from "@/components/custom/inventory/WarehouseInventory";


export default function Inventory()  {
    return(
        <div>
            {/* <InventoryItem /> */}
            {/* <BranchInventory /> */}
            <WarehouseInventory />
        </div>
    );
}