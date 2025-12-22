export interface ResourceAllocation {
  id: string;
  task_id: string;
  resource_id: string;
  quantity: number;
  allocated_cost: number;
  created_at: string;
}

export interface ResourceAllocationPayload {
  task_id: string;
  resource_id: string;
  quantity: number;
  allocated_cost: number;
}
