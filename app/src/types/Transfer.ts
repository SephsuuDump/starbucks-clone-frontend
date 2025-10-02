export type Transfer = {
    from_warehouse : string, 
    to_warehouse : string | null,
    to_branch : string | null,
    items : [ 
        {
            inventory_item_id : string,
            qty : number;
        }
    ]
}