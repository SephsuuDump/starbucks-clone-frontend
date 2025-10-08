export interface ResourceAllocation {
  id: number;
  project_id: number;
  task_id: number;
  resource_id: number;
  quantity: number;
  allocated_cost: number;
  created_at: string;
}

export interface ResourceAllocationPayload {
  project_id: number;
  task_id: number;
  resource_id: number;
  quantity: number;
  allocated_cost: number;
}
