import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  extractUrlMetadata,
  createResource,
  getResources,
  updateResource,
  deleteResource,
  toggleLike,
  addComment,
  attachToTask,
  getAiRecommendations,
  trackFeedback,
  trackView,
} from "../controllers/resourceController.js";

const router = express.Router();

router.post("/extract", authMiddleware, extractUrlMetadata);
router.post("/", authMiddleware, createResource);
router.get("/workspace/:workspaceId", authMiddleware, getResources);
router.put("/:id", authMiddleware, updateResource);
router.delete("/:id", authMiddleware, deleteResource);
router.post("/:id/like", authMiddleware, toggleLike);
router.post("/:id/comment", authMiddleware, addComment);
router.post("/:id/attach", authMiddleware, attachToTask);
router.post("/feedback", authMiddleware, trackFeedback);
router.post("/:id/view", authMiddleware, trackView);
router.get("/workspace/:workspaceId/recommend", authMiddleware, getAiRecommendations);

export default router;
