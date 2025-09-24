import { Button } from "@/components/ui/button"
import { Description } from "@radix-ui/react-dialog"
import { SquarePen, Trash2 } from "lucide-react"
import { ProcurementHeader } from "../procurement/Header"

const inventoryItem = [
    {
        skuid : "SK-12035",
        name : "Coffee Beans",
        category : "Coffee",
        description : "Main ingredient for coffee"
    },
    {
        skuid : "SK-12385",
        name : "Oatside",
        category : "Dairy",
        description : "N/A"
    },
    {
        skuid : "SK-091236",
        name : "Sugar",
        category : "Sweetened",
        description : "N/A"
    },
    {
        skuid : "SK-12093",
        name : "Garlic Bread",
        category : "Pastries",
        description : "N/A"
    },
    {
        skuid : "SK-64714",
        name : "Coffee Beans Arabica",
        category : "Coffee",
        description : "N/A"
    }
]



export function InventoryItem() {
    return(
        <div className="flex flex-col gap-2">
            <ProcurementHeader label="INVENTORY ITEM " />            
            <div className="thead grid grid-cols-5">
                <div className="th">SKUID</div>
                <div className="th ">Name</div>
                <div className="th ">Category</div>
                <div className="th ">Description</div>
                <div className="th "></div>
            </div>
            {inventoryItem.map((item, index) => (
                <div className="tdata grid grid-cols-5" key={index}>
                    <div className="td">{item.skuid}</div>
                    <div className="td">{item.name}</div>
                    <div className="td">{item.category}</div>
                    <div className="td">{item.description}</div>
                    <div className="td flex gap-2">
                        <Button className="!bg-green-900 hover:opacity-90"><SquarePen className="text-white w-1 h-1"/> Edit</Button>
                        <Button className="!bg-red-900 hover:opacity-90"><Trash2 className="text-white w-1 h-1"/> Delete</Button>
                    </div>

                </div>
            ))}
        </div>
    )
}