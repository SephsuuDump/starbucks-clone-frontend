export interface TaskPayload {
  project_id: string;
  name: string;
  description?: string;
  start_date: string | null;
  expected_date: string | null;
  end_date?: string | null;
  employee_id?: string;
  status?: 
  | "PENDING" 
  | "ACCEPTED"
  | "PENDING_ALLOCATIONS"
  | "IN_PROGRESS"           
  | "REJECTED"              
  | "DONE";                

}

export interface TaskResponse {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  start_date: string;
  expected_date: string;
  end_date?: string;
  employee_id?: string;
  status: string;
}
