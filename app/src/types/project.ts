export interface ProjectPayload {
  name: string;
  description?: string;
  start_date?: string | null;
  end_date?: string |null;
  status?: 
  | "PENDING_BUDGET"
  | "PENDING_TASK_ACCEPTANCE"
  | "PENDING_ALLOCATIONS"
  | "ONGOING"
  | "DONE";
  budget?: number;
}

export interface ProjectResponse {
  id: string;
  name: string;
  description?: string;
  start_date?: string |null;
  end_date?: string | null;
  status: string;
  budget?: number;
  actual_end?: string | null;
  progress: number;
}
