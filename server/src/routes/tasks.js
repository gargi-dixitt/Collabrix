import { Router } from "express";\nimport { getTasks } from "../controllers/taskController.js";\nconst router = Router();\nrouter.get("/", getTasks);\nexport default router;
