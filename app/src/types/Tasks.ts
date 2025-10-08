export interface Task {
  id: string;
  project_id: string;
  name: string;
  description: string;
  start_date: string;
  expected_date: string;
  end_date: string;
  employee_id: string;
  status: string;
  progress: number;
}

export interface TaskPayload {
  project_id: string;
  name: string;
  description: string;
  start_date: string;
  expected_date: string;
  end_date: string;
  employee_id: string;
  status: string;
  progress: number;
}
