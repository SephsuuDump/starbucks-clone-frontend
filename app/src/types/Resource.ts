export interface Resource {
  id: string;
  type: string;
  name: string;
  cost_per_unit: number;
  unit: string;
  availability: number;
  created_at: string;
  project : {
    id: string, 
    name : string
  }
}

export interface ResourcePayload {
  type: string;
  name: string;
  cost_per_unit: number;
  unit: string;
  availability: number;
  project_id : string;
}
