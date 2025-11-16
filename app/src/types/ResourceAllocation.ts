export interface ResourceAllocationPayload {
  task_id: string;
  resource_id: string;
  quantity: number;
  allocated_cost?: number;
}

export interface AllocationResponse {
  id: string;
  task_id: string;
  resource_id: string;
  quantity: number;
  allocated_cost?: number;
  created_at: string;
  is_approved: boolean;
}
