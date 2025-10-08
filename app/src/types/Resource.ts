export interface Resource {
  id: number;
  type: string;
  name: string;
  cost_per_unit: number;
  unit: string;
  availability: number;
  created_at: string;
}

export interface ResourcePayload {
  type: string;
  name: string;
  cost_per_unit: number;
  unit: string;
  availability: number;
}
