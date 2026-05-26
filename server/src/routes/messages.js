import express from "express";

import authMiddleware from "../middleware/auth.js";

import {
  sendMessage,
  getMessages,
  toggleReaction,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:projectId", authMiddleware, getMessages);
router.put("/:messageId/reaction", authMiddleware, toggleReaction);

export default router;