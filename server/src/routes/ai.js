import { Router } from "express";\nimport { processAI } from "../controllers/aiController.js";\nconst router = Router();\nrouter.post("/", processAI);\nexport default router;
