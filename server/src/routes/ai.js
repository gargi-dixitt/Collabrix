import express from "express";

import authMiddleware from "../middleware/auth.js";

import { generateTasks } from "../controllers/aiController.js";

const router = express.Router();

router.post(
  "/generate-tasks",
  authMiddleware,
  generateTasks
);

export default router;