import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchTasks(page = 1, limit = 3) {
  try {
    const res = await api.get(`/api/tasks?page=${page}&limit=${limit}`);
    return {
      tasks: res.data.tasks || [],
      pagination: res.data.pagination || {},
    };
  } catch (error) {
    console.error("Fetch tasks error:", error);
    throw new Error("Failed to fetch tasks");
  }
}

export async function fetchAllTasks() {
  try {
    const res = await api.get("/api/tasks");
    return res.data;
  } catch (error) {
    console.error("Fetch all tasks error:", error);
    throw new Error("Failed to fetch all tasks");
  }
}

export async function createTask(data) {
  try {
    const res = await api.post("/api/tasks", data);
    return res.data;
  } catch (error) {
    console.error("Create task error:", error);
    throw new Error("Failed to create task");
  }
}

export async function updateTask(id, updates) {
  try {
    const res = await api.put(`/api/tasks/${id}`, updates);
    return res.data;
  } catch (error) {
    console.error("Update task error:", error);
    throw new Error("Failed to update task");
  }
}

export async function deleteTask(id) {
  try {
    await api.delete(`/api/tasks/${id}`);
  } catch (error) {
    console.error("Delete task error:", error);
    throw new Error("Failed to delete task");
  }
}

export async function toggleTask(id) {
  try {
    const res = await api.patch(`/api/tasks/${id}/toggle`);
    return res.data;
  } catch (error) {
    console.error("Toggle task error:", error);
    throw new Error("Failed to toggle task");
  }
}
