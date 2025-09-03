import taskModel from "../models/taskModel.js";

const tasks = [];
let currentId = 0;

export function createAndAddTaskToStore({
  title,
  description,
  priority = "medium",
}) {
  currentId++;

  const task = structuredClone(taskModel);
  task.id = currentId;
  task.title = title;
  task.description = description;
  task.priority = priority;
  task.completed = false;
  task.createdAt = new Date();
  tasks.push(task);
  return task;
}

export function getTasks() {
  return tasks;
}

export function getTaskById(id) {
  return tasks.find((t) => t.id === Number(id));
}

export function updateTaskInStore(id, updates) {
  const task = getTaskById(id);
  if (!task) return null;
  Object.assign(task, updates);
  return task;
}

export function deleteTaskFromStore(id) {
  const index = tasks.findIndex((t) => t.id === Number(id));
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}
