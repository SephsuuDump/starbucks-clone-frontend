export interface Project {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  budget: number;
  actual_end : string;
}

export interface ProjectPayload {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  budget: number;
}
