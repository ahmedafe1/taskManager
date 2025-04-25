import axios from "axios";
import { User, Task, TaskFormData } from "@/types";

const API_URL = "http://localhost:5000/api";

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      try {
        const response = await axios.post(
          `${API_URL}/auth/login`,
          { email, password },
          {
            headers: getHeaders(),
          }
        );
        console.log("Login success data:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.response) {
          throw new Error(error.response.data.message || "Login failed");
        }
        throw new Error(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      }
    },
    register: async (
      username: string,
      email: string,
      password: string
    ): Promise<User> => {
      try {
        const response = await axios.post(
          `${API_URL}/auth/register`,
          { username, email, password },
          {
            headers: getHeaders(),
          }
        );
        return response.data;
      } catch (error: any) {
        console.error("Registration error:", error);
        if (error.response) {
          throw new Error(error.response.data.message || "Registration failed");
        }
        throw new Error(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      }
    },
  },
  tasks: {
    getAll: async (token: string): Promise<Task[]> => {
      try {
        const response = await axios.get(`${API_URL}/tasks`, {
          headers: getHeaders(token),
        });
        return response.data;
      } catch (error: any) {
        console.error("Fetch tasks error:", error);
        throw new Error("Failed to fetch tasks");
      }
    },
    create: async (task: TaskFormData, token: string): Promise<Task> => {
      try {
        const response = await axios.post(`${API_URL}/tasks`, task, {
          headers: getHeaders(token),
        });
        return response.data;
      } catch (error: any) {
        console.error("Create task error:", error);
        throw new Error("Failed to create task");
      }
    },
    update: async (
      id: string,
      updates: Partial<Task>,
      token: string
    ): Promise<Task> => {
      try {
        const response = await axios.put(`${API_URL}/tasks/${id}`, updates, {
          headers: getHeaders(token),
        });
        return response.data;
      } catch (error: any) {
        console.error("Update task error:", error);
        if (error.response) {
          throw new Error(
            error.response.data.message || "Failed to update task"
          );
        }
        throw new Error("Failed to update task");
      }
    },
    delete: async (id: string, token: string): Promise<void> => {
      try {
        await axios.delete(`${API_URL}/tasks/${id}`, {
          headers: getHeaders(token),
        });
      } catch (error: any) {
        console.error("Delete task error:", error);
        throw new Error("Failed to delete task");
      }
    },
  },
};
