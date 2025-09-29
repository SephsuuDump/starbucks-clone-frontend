export type Inventory = {
    id : string,
    qty :  number,
    inventory_item : {
        name : string,
        unit_measurement : string
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

