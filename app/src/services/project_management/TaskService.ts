import { BASE_URL } from "@/lib/config";
import { Task ,TaskPayload } from "@/types/Tasks";
import { requestData } from "../_main";


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

  static async getAll(params?: { project_id?: string;}) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return await requestData(`${url}/get-all?${query}`, "GET");
  }

  static async getById(id: string) {
    return await requestData(`${url}/get-by-id?id=${id}`, "GET");
  }
}
