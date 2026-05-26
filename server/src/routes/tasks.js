import express from "express";

import authMiddleware from "../middleware/auth.js";

import {
  createTask,
  getTasks,
  updateTaskStatus,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);

router.get("/:projectId", authMiddleware, getTasks);

router.put("/:taskId", authMiddleware, updateTaskStatus);

export default router;