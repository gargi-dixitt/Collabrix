import express from "express";

import authMiddleware from "../middleware/auth.js";

import {
  sendMessage,
  getMessages,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", authMiddleware, sendMessage);

router.get("/:projectId", authMiddleware, getMessages);

export default router;