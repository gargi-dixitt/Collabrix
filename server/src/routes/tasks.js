import express from "express";

import authMiddleware from "../middleware/auth.js";

import {
  createTask,
  getTasks,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);

router.get("/:projectId", authMiddleware, getTasks);

export default router;