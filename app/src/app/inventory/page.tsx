import {BranchInventory} from "@/components/custom/inventory/BranchInventory";
import { InventoryItem } from "@/components/custom/inventory/inventory_item/InventoryItem";
import { WarehouseInventory } from "@/components/custom/inventory/WarehouseInventory";
import { useAuth } from "@/hooks/use-auth";


export default function Inventory()  {
    // const {claims, loading} = useAuth();
    return(
        <div>
            {/* IF BRANCH*/}
            {/* <BranchInventory /> */}
            {/*ELSE */}
            <WarehouseInventory />


        </div>
    );
}