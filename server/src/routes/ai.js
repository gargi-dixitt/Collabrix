import express from "express";

import authMiddleware from "../middleware/auth.js";

import { generateTasks } from "../controllers/aiController.js";
import { generateSprint } from "../controllers/sprintController.js";

const router = express.Router();

router.post(
  "/generate-tasks",
  authMiddleware,
  generateTasks
);

router.post("/generate-sprint", authMiddleware, generateSprint);

export default router;