import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";
import { TaskPayload } from "@/types/Tasks";


const url = `${BASE_URL}/tasks`;

export class TaskService {
  static async create(payload: TaskPayload) {
    return await requestData(`${url}/create`, "POST", undefined, payload);
  }

  static async update(id: string, payload: Partial<TaskPayload>) {
    return await requestData(`${url}/update?id=${id}`, "PUT", undefined, payload);
  }

  static async deleteById(id: string) {
    return await requestData(`${url}/delete-by-id?id=${id}`, "DELETE");
  }

  static async getAll(project_id : string) {
    return await requestData(`${url}/get-all?project_id=${project_id}`, "GET", undefined, undefined);
  }

   static async getByEmployee(employee_id : string) {
    return await requestData(`${url}/get-by-employee?employee_id=${employee_id}`, "GET", undefined, undefined);
  }

  static async getById(id: string) {
    return await requestData(`${url}/get-by-id?id=${id}`, "GET");
  }

  static async respond(id: string, action: "ACCEPT" | "REJECT") {
    return await requestData(`${url}/respond?id=${id}`, "POST", undefined, { action });
  }

  static async markDone(id: string) {
    return await requestData(`${url}/mark-done?id=${id}`, "POST");
  }
}
