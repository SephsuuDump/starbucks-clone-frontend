export interface ResourcePayload {
  type: string;    
  name: string;
  cost_per_unit?: number;
  unit?: string;
  availability?: number;
  project_id?: string;
}

export interface ResourceResponse {
  id: string;
  type: string;
  name: string;
  cost_per_unit?: number;
  unit?: string;
  availability: number;
  project: { id: string; name: string } | null;
}
