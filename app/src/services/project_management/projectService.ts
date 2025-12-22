import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";
import { ProjectPayload } from "@/types/project";

const url = `${BASE_URL}/projects`;

export class ProjectService {
  static async create(payload: ProjectPayload) {
    return await requestData(`${url}/create`, "POST", undefined, payload);
  }

  static async update(id: string, payload: Partial<ProjectPayload>) {
    return await requestData(`${url}/update?id=${id}`, "POST", undefined, payload);
  }
  static async  approvedBudget(id: string, approved : boolean) {
    return await requestData(`${url}/approve-budget?id=${id}&approved=${approved}`, "POST", undefined, undefined);
  }
  
  static async deleteById(id: string) {
    return await requestData(`${url}/delete-by-id?id=${id}`, "POST", undefined, undefined);
  }

  static async getAll() {
    return await requestData(`${url}/get-all`,"GET", undefined, undefined);
  }

  static async getById(id: string) {
    return await requestData(`${url}/get-by-id?id=${id}`, "GET", undefined);
  }
}


