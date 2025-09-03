import express from "express";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from "../controllers/taskController.js";

const router = express.Router();

const baseUrl = "/api/tasks";

router.get(baseUrl, getAllTasks);

router.post(baseUrl, createTask);

router.put(baseUrl + "/:id", updateTask);

router.delete(baseUrl + "/:id", deleteTask);

router.patch(baseUrl + "/:id/toggle", toggleTask);

export default router;
