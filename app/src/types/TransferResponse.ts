export type TransferResponse = {
  id: string;
  status: string;
  total_cost: number;
  expected_arrival : string,
  actual_arrival : string;
  notes: string,
  from_warehouse: {
    id: string;
    name: string;
  } | null;
  to_warehouse: {
    id: string;
    name: string;
  } | null;
  to_branch: {
    id: string;
    name: string;
  } | null;
  transfer_item: {
    id: string;
    quantity: number;
    cost: number;
    inventory_item: {
      id: string;
      skuid: string;
      name: string;
    };
  }[];
};
