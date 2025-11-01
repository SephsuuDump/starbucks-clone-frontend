export type Inventory = {
    id : string,
    qty :  number,
    inventory_item : {
        skuid : string,
        name : string,
        unit_measurement : string,
        required_stock : number,
        category : string
    },
    warehouse:  {
        name : string, 
        location : string 
    } | null, 
    branch : {
        name : string, 
        location : string 
    } | null
}

