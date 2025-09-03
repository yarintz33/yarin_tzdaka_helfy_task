import {
  createAndAddTaskToStore,
  getTasks,
  getTaskById,
  updateTaskInStore,
  deleteTaskFromStore,
} from "../store/tasksStore.js";

export const getAllTasks = (req, res) => {
  try {
    // אם יש query parameters, השתמש ב-pagination
    if (req.query.page || req.query.limit) {
      const { page = 1, limit = 3 } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      const allTasks = getTasks();
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;

      const paginatedTasks = allTasks.slice(startIndex, endIndex);
      const totalTasks = allTasks.length;
      const totalPages = Math.ceil(totalTasks / limitNum);

      res.json({
        tasks: paginatedTasks,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalTasks,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      });
    } else {
      // אם אין query parameters, החזר את כל המשימות
      const tasks = getTasks();
      res.json({ tasks });
    }
  } catch (error) {
    console.error("Error in getAllTasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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
