import {
  createAndAddTaskToStore,
  getTasks,
  getTaskById,
  updateTaskInStore,
  deleteTaskFromStore,
} from "../store/tasksStore.js";

export const getAllTasks = (req, res) => {
  const tasks = getTasks();
  res.json(tasks);
};

export const createTask = (req, res) => {
  const { title, description, priority = "medium" } = req.body || {};
  if (!title) return res.status(400).json({ error: "title is required" });
  const task = createAndAddTaskToStore({ title, description, priority });
  res.status(201).json(task);
};

export const updateTask = (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};
  const task = updateTaskInStore(id, updates);
  if (!task) return res.status(404).json({ error: "task not found" });
  res.json(task);
};

export const deleteTask = (req, res) => {
  const { id } = req.params;
  const ok = deleteTaskFromStore(id);
  if (!ok) return res.status(404).json({ error: "task not found" });
  res.status(204).send();
};

export const toggleTask = (req, res) => {
  const { id } = req.params;
  const task = getTaskById(id);
  if (!task) return res.status(404).json({ error: "task not found" });
  task.completed = !task.completed;
  res.json(task);
};
